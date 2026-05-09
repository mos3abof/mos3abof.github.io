---
title: "What Happens When You `kubectl apply -f network-policy.yaml`?"
date: 2026-05-09
tags: [kubernetes, networking, ebpf, sre]
---

{{
  image(
    src="cover.jpg",
    alt="Abstract visualisation of Kubernetes infrastructure, servers, databases and container orchestration in blue tones",
    text="Photo by Growtika on Unsplash",
    size="full"
  )
}}

There's a famous interview question floating around the internet: **What
happens when you type www.google.com into your browser and hit enter?**[^1] If
you've never seen the answer written out, do yourself a favour and read it;
it's a masterclass in how much sits underneath an action that feels
instantaneous.

There's a sibling question that I like even more, that is shorter on the wire
but just as deep in the kernel: **What happens when you run `ls` in your terminal?**

I've spent the last few weeks elbow-deep with network policies in kubernetes,
and one nasty bug that I hit was an orphan BPF pin files leak in
`aws-network-policy-agent` on our EKS clusters at work. While I had the layers
fresh in my head, it felt like a good moment to sit down and write the
Kubernetes-flavoured version of the same question: **What happens when you**
`kubectl apply -f network-policy.yaml`?

{{ sep(style="dingbats", gap="sm") }}

A NetworkPolicy is one of those Kubernetes objects that *feels* like it should
be simple. You write a YAML, you say "deny everything except this", you press
return, and packets start getting dropped. But that one-liner hides at least
six distinct layers — control plane, controller, CRD, node agent, eBPF
verifier, and the actual kernel hook that fires on a packet, and any one of
them can fail silently. The fun is in walking down the stack.

A caveat before I start: this walkthrough is anchored on **EKS running the AWS
VPC CNI plus `aws-network-policy-agent`** (NPA), because that's the dataplane
I've been living inside. The shape of the story is the same on Calico and
Cilium; the dataplane is wildly different. I'll come back to that near the end.

The policy we'll trace through the stack is the most boring one I could come up
with on purpose:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-allow-from-frontend
  namespace: prod
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes: ["Ingress"]
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 8080
```

In English: pods labelled `app=api` in `prod` only accept `TCP/8080` from pods
labelled `app=frontend`.

Now let's watch what the cluster actually does with that.

{{ sep(style="dingbats", gap="sm") }}

## Stage 1: `kubectl apply`, the easy bit

`kubectl` is, almost embarrassingly, just a fancy HTTP client. When you run

```shell
❯ kubectl apply -f network-policy.yaml
```

a few things happen on your laptop before a single byte leaves it:

1. `kubectl` parses the YAML and converts it to JSON — Kubernetes' API is
   actually JSON-over-HTTP; YAML is an ergonomic shim for humans.

2. It consults its discovery cache (under `~/.kube/cache`) to figure out which
   API group/version owns `NetworkPolicy` — `networking.k8s.io/v1` — and
  therefore which REST path to use: `POST
  /apis/networking.k8s.io/v1/namespaces/prod/networkpolicies`.

3. It computes the three-way diff between *the file you applied*, *the
   last-applied annotation*, and *the live object* (if it exists). This is the
  reason `apply` is idempotent and `create` isn't.

4. It opens a TLS connection to the apiserver, presents the client cert in your
   kubeconfig, and sends the request.

The apiserver does a lot more than people give it credit for. The request goes
through, in order:

- **Authentication**: your client cert, OIDC token, or webhook auth tells the
apiserver *who you are*.

- **Authorization**: RBAC checks whether *you* are allowed to create
  `networkpolicies` in `prod`. (If you're using ABAC or webhook authz, those
  fire here too. Almost no one is.)

- **Admission**: both *mutating* and *validating* admission webhooks. This is
  where Pod Security Standards, OPA Gatekeeper, Kyverno, and a long tail of
  in-house policy engines get a chance to rewrite or reject the object.

- **Schema validation**: the object is checked against the OpenAPI schema for
  `networking.k8s.io/v1.NetworkPolicy`. Typo `podSelector` as `podSelecter` and
  this is where you find out.

- **Storage**: the apiserver writes the object to etcd via a transactional
  `Txn` that includes a resource-version check. Only *after* this commit does
  the object exist in any meaningful sense.

The instant etcd commits, the apiserver's *watch cache* fans the new
`NetworkPolicy` out to every controller and agent that has an open watch on
that resource. If you want to see this happen in real time, run `kubectl get
networkpolicy -A -w` in a second terminal *before* you apply, the watch event
lands within a few milliseconds.

So far we have a row in etcd. The cluster's behaviour hasn't changed. *Not a
single packet has been dropped or permitted differently because of what we just
did.* A NetworkPolicy on its own is inert, it's a declaration of intent.
Something has to be listening.

{{ sep(style="dingbats", gap="sm") }}

## Stage 2: Two controllers wake up

In the AWS VPC CNI world, two things care that we just wrote a NetworkPolicy:

1. The **network-policy controller** (`amazon-network-policy-controller-k8s`),
   which on EKS runs inside the managed control plane.

2. The per-node **aws-network-policy-agent** (NPA), running as a sidecar in the
   `aws-node` DaemonSet pod on every worker.

The controller's job is *resolution*. The selectors in your YAML (`app=api`,
`app=frontend`) are not the truth — they're a *query* over the truth, and the
truth lives in the Pod and Namespace objects in etcd. The controller has to
translate "all pods labelled `app=api` in `prod`" into a concrete list of pods,
on specific nodes, with specific IPs, *right now*. And it has to keep doing
that, forever, because:

- A pod can be labelled `app=api` today and `app=archive` tomorrow.
- A new pod can be scheduled with `app=frontend` two seconds from now.
- A namespace can get a new label that changes whether a `namespaceSelector`
matches.
- A pod can be rescheduled to a different node and pick up a different IP.

This is the part where I think a lot of NetworkPolicy mental models start to
fall apart, people imagine a static "firewall rule" being installed once, when
in reality the controller is in a *continuous* reconciliation loop. The
selector `app=frontend` is "labels at this moment", not "labels at the time you
applied".

What the controller produces is a **`PolicyEndpoint`** custom resource
(cluster-scoped variant: `ClusterPolicyEndpoint`). Roughly one per
(NetworkPolicy × node-with-matching-pods). Crucially, a `PolicyEndpoint` has
*no selectors* in it, only fully-resolved pod IPs, CIDR ranges, ports, and
protocols. All the dynamic resolution work has been done; the result is the
boring, concrete, byte-pushable version of your intent.

You can see them with `kubectl get policyendpoint -A`. If you've never looked,
do, they're the most concrete answer to "what does my NetworkPolicy *actually
mean* right now?" you're going to get.

A reasonable question: *why a CRD as the contract between the controller and
the agent? Why not a direct gRPC?* The convincing answer I could conclude is
that you get a lot for free, Kubernetes' API gives you ordering, retries,
audit, RBAC, field-selectors, watches, and `kubectl get` as a debugging tool,
and you pay for it with a small amount of latency and a CRD type to maintain.
It's a good trade.

Each NPA pod watches `PolicyEndpoint` with a field selector pinned to its own
node, so it only sees the resolved policies for the pods it actually hosts.
That sharding is the only reason this design scales.

{{ sep(style="dingbats", gap="sm") }}

## Stage 3: The agent translates pods into eBPF

Now we're on the worker node. NPA is running in the `aws-node` DaemonSet pod,
in the **host network namespace**. It does two things:

1. Watches `PolicyEndpoint` on the apiserver (Stage 2's output).
2. Listens on a tiny gRPC server at `127.0.0.1:50052`, which the CNI plugin
   calls during pod `ADD` and `DEL` to say "this pod just appeared, here's its
   namespace and veth" or "this pod is gone".

For each pod that has at least one policy applied to it, NPA computes a
`podIdentifier`. The formula is, and I had to read this code very carefully
before I trusted it, roughly:

1. Take the pod name.
2. Replace `.` with `_`.
3. Strip the trailing `-<lastSegment>` (the ReplicaSet hash for Deployments,
   the StatefulSet ordinal lookalike, etc.).
4. Append `-<podNamespace>`.

So `api-7d4b8-xyz` in `prod` becomes `api-7d4b8-prod`. Two pods from the *same*
ReplicaSet on the *same* node will share one `podIdentifier`. This is a
deliberate optimisation, same-ReplicaSet pods have identical labels and
therefore identical policy attachments, so they can share the same BPF
program(s) and one set of maps. It's also a beautifully sharp edge that you
only learn about the hard way: any code that reasons about pod-to-program
ownership *must* treat every live pod that hashes to the same identifier as a
"still in use" signal, or it will happily delete a program that another pod is
still relying on. (Ask me how I know.[^2])

For each `podIdentifier`, NPA produces a small constellation of pinned BPF
objects under `/sys/fs/bpf/globals/aws/`:

```text
/sys/fs/bpf/globals/aws/programs/
  <podIdentifier>_handle_ingress
  <podIdentifier>_handle_egress


/sys/fs/bpf/globals/aws/maps/
  <podIdentifier>_ingress_map
  <podIdentifier>_egress_map
  <podIdentifier>_ingress_pod_state_map
  <podIdentifier>_egress_pod_state_map

  global_aws_conntrack_map     # one per node, shared across all pods
  global_policy_events         # perf ring buffer back to userspace
```

The two programs are loaded from `tc.v4ingress.bpf.o` and `tc.v4egress.bpf.o`
(plus v6 variants), verified by the kernel's BPF verifier, and **attached to TC
ingress and egress** on the **host-side veth** of the pod's network namespace.
That last detail is the one I want you to take away from this section, because
it answers a lot of "but where exactly does the rule live?" questions:

- It's not iptables. There are no `cali-` or `KUBE-NWPLCY-` chains. `iptables -L`
  will tell you nothing useful.

- It's not a cgroup-level hook. Two containers in the same pod (same network
  namespace, same veth) get the same enforcement; that's correct, because
  NetworkPolicy is pod-scoped.

- It's not on the pod-side of the veth, it's on the host-side. Which means
  the pod can't escape it by playing games inside its own netns, and `tc`
  utilities run from the host see it directly.

You can confirm any of this on a real node:

```shell
❯ ls /sys/fs/bpf/globals/aws/programs/ | head
api-7d4b8-prod_handle_egress
api-7d4b8-prod_handle_ingress
frontend-9c2d3-prod_handle_egress
frontend-9c2d3-prod_handle_ingress
```

And you can use `bpftool` to interact with those programs:

```shell
❯ bpftool prog show pinned /sys/fs/bpf/globals/aws/programs/api-7d4b8-prod_handle_ingress
123: sched_cls  name handle_ingress  tag a1b2c3d4e5f6
        loaded_at 2026-05-08T17:42:11+0000  uid 0
        xlated 2104B  jited 1421B  memlock 4096B  map_ids 456,457,458
```

The `map_ids` line is the breadcrumb to the policy data. `bpftool map dump id
456` will print the actual permitted CIDR-port-protocol entries for that pod's
ingress. *That* is your NetworkPolicy, made byte-shaped.

{{ sep(style="dingbats", gap="sm") }}

## Stage 4: A packet shows up

A `frontend` pod opens a TCP connection to `10.0.5.7:8080`, the IP of an `api`
pod. Walk the packet through:

1. The packet leaves the `frontend` container's veth and crosses into the
   host's network namespace via the host-side veth.

2. **TC egress on the `frontend` host-veth fires `frontend-...-prod_handle_egress`.**
   The program reads the SKB metadata, builds a 5-tuple
   `(src IP, dst IP, src port, dst port, protocol)`, and:

   - Looks up `global_aws_conntrack_map` keyed by 5-tuple. If this is an
     established connection, it's a hit, the timestamps get bumped, and the
     packet is permitted. *Done. Constant-time.*

   - If miss, it looks up `frontend-...-prod_egress_map` keyed by destination
     CIDR + port + protocol. Match → permit, **also insert into conntrack so
     the return path is free**. No match → drop, emit a perf event into
     `global_policy_events` so userspace can log it.

3. The (permitted) packet is forwarded by the host's normal routing and the
   VPC CNI's ENI plumbing to the destination pod's host-veth.

4. **TC ingress on the `api` host-veth fires `api-...-prod_handle_ingress`.**
   Same dance: conntrack lookup first, policy map lookup second, drop or
   permit.

5. The return packet (`api → frontend`) comes back, hits TC egress on `api`,
   and now the conntrack entry from step 2 short-circuits the whole policy
   lookup. The "stateful" in stateful firewall is, mechanically, that one map
   lookup.

If you've ever wondered why dropped NetworkPolicy packets don't show up in
`iptables -nvL`, this is why, they were never in iptables. They're in BPF
maps. The way to see drops is the perf events stream:

```shell
❯ kubectl exec -n kube-system aws-node-xxxxx -c aws-network-policy-agent -- \
    aws-eks-na-cli ebpf dump-policy-events
```

...or, if you have it, the agent's structured logs.

The whole packet path, TC egress, conntrack, policy lookup, network forward, TC
ingress, conntrack, policy lookup, is on the order of microseconds. The
expensive part of NetworkPolicy is everything that happened in stages 1–3,
which got us here in the first place.

{{ sep(style="dingbats", gap="sm") }}

## Stage 5: The pod dies, and the policy has to die with it

This is the stage I've spent the most time in over the last few weeks, so I
have to resist the urge to write five thousand words on it alone. The short
version: cleanup is harder than setup, and the unhappy paths are where
dataplanes go to die.

The happy path is simple. The pod is deleted, kubelet runs CNI `DEL`, the CNI
plugin issues a gRPC `DeletePodNp()` to NPA on `127.0.0.1:50052`, the agent
detaches the BPF programs, releases its FDs, and unpins the files. If this was
the last pod referencing that `podIdentifier`, the kernel reclaims the program
and maps; if not, the agent decrements a refcount and waits.

The unhappy paths look like any of the following:

- The agent OOMs while it's halfway through `DeletePodNp()`.
- The CNI plugin's gRPC call times out after two seconds and soft-fails.
- The node reboots before the agent finishes.
- kubelet skips CNI `DEL` entirely on certain abnormal pod terminations
  (this one I had to learn by reading kubelet source).
- The agent restarts, reads the existing pin files via `recoverBPFState()`, but
  doesn't fully repopulate its in-memory ProgFD reverse-map, so its own
  delete RPC silently no-ops on anything it didn't recover correctly.

That last one is a real bug, fixed forward -partially- in NPA `v1.3.4`, but
only forward. On `v1.2.1`, every one of those scenarios drops a pinned BPF
program and four maps on disk, with the kernel still holding the FDs and the
memory. On a long-lived node, that's a slow leak. On a long-lived *fleet* of
long-lived nodes, it's a real outage waiting for a quiet weekend. (We caught it
right when it started causing problems; it's the kind of thing that puts you
off your tea.)

The problem is amplified if your clusters are running a high number of pods
that match the selection criteria for your network policy, and it is amplified
even more if your workload has a high churn rate.

The bigger point is that any control loop that drives a kernel-level dataplane
has the same problem in the same shape: **the create path and the delete path
are not symmetric**, and the delete path runs in the worst conditions, during
termination, during failure, during reboot. If you're building this sort of
agent, write the cleanup tests first.

{{ sep(style="dingbats", gap="sm") }}

## A short word on Calico and Cilium

If you're not on EKS-with-VPC-CNI, your dataplane is almost certainly Calico or
Cilium, and the answer to "what happens when..." diverges at Stage 3.

- **Calico, default mode**: same controller pattern, but the dataplane is
  iptables. Look for chains prefixed `cali-` in `iptables-save -t filter`.
  Easier to inspect with familiar tools, harder to reason about at scale, and
  every rule update is a non-atomic `iptables-restore`.

- **Calico, eBPF dataplane**: closer to NPA in spirit. TC programs, BPF maps,
  similar shape.

- **Cilium**: the most architecturally different of the three. Cilium
  translates labels into a numeric **identity** at the controller layer, then
  tags packets with that identity, and the dataplane does
  *identity-to-identity* policy lookups instead of *IP-to-IP*. It scales
  better in clusters with high pod churn (because identities are stable while
  IPs are not), and it gets you L7 policy almost for free.

All three answer the same question — *should I drop or permit this packet?*,
with the same overall recipe:

```text
API → control loop → resolved CR or in-process state → node-local agent → kernel hook
```

The interesting differences live in the last two letters: where exactly do
bytes get inspected, and what is the lookup key.

{{ sep(style="dingbats", gap="sm") }}

## Putting it back together

So, what *actually* happened when you ran `kubectl apply` six pages ago?

1. Your YAML became JSON, was authenticated and authorised, ran a gauntlet of
   admission webhooks, was schema-validated, and committed to etcd.

2. The network-policy controller's watch fired. It resolved your selectors
   into concrete pods, sliced the result by node, and emitted a
   `PolicyEndpoint` per affected node.

3. NPA on each affected node saw the `PolicyEndpoint`, computed a
   `podIdentifier` for the targeted pods, and produced two BPF programs and
   four BPF maps per identifier, pinned under `/sys/fs/bpf/globals/aws/`.

4. The programs got attached, by the kernel's BPF verifier and TC subsystem,
   to the host-side veth of each pod's netns at ingress and egress.

5. The next packet through that veth got 5-tuple-extracted, conntrack-checked,
   policy-map-checked, and either permitted (with a conntrack insert) or
   dropped (with a perf event).

6. When the pods die, the whole thing has to unwind in reverse, and the
   delete path runs in the worst conditions, which is where dataplane bugs
   live.

Six layers, all of them necessary, any one of them able to fail quietly.

The pretty thing about NetworkPolicy is also the trap: you write a YAML that
*reads* like a firewall rule, and the system makes that abstraction look
seamless. But the rule isn't a rule until a TC program woke up forty
milliseconds later on a worker node you've never SSH'd into, and pulled four
bytes out of an SKB, and looked up a CIDR in an LPM trie. *That's* where the
policy actually lives.

Next time you `kubectl apply` one, picture the verdict happening down there.

Happy enforcing.

---

[^1]: [https://github.com/alex/what-happens-when](https://github.com/alex/what-happens-when)

[^2]: The orphan-cleanup story deserves its own post; I'll write that one
later. Short version: in older NPA versions, `recoverBPFState()` re-ingests pinned
objects on agent restart but doesn't fully populate the program-FD reverse
maps, so the agent's own `DeletePodNp()` returns `Success: true` while quietly
doing nothing on orphans. Fix went in via [PR #520][1], released in `v1.3.4`. The
fix is forward-only, pre-existing leaks on already-running nodes need explicit
cleanup.


[1]: https://github.com/aws/aws-network-policy-agent/pulls/520
