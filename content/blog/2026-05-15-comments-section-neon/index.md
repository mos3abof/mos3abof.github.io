---
title: "Comments Backed by Neon & Cloudflare"
date: 2026-05-15
tags: [neon, cloudflare, postgres, zola, static-site]
---

This blog has had comments since 2006. They lived on Blogger, which hosted the
whole thing back then. When I moved to a static site a few years ago, I exported
all the old content: posts, images, and comments. The comments became `.toml`
files sitting next to each post. The display layer already knew how to render
them. They looked fine.

What I did not keep was the ability to write new ones. If you wanted to leave a
comment after the migration, there was simply nowhere to send it.

I have been meaning to fix that for a while. This week I finally did.

{{ sep(style="dingbats", gap="sm") }}

The core problem with comments on a static site is that a static site has no
server. When you hit "submit" on a form, something has to catch the request,
validate it, and store it somewhere. A static file host does none of that.

There are two ways out. You outsource to a third-party commenting service
(Disqus is the obvious one, there are smaller alternatives), or you build a
small backend yourself and keep control of the data. I dislike Disqus on
principle: the tracker payload, the ads, the constant account nagging. Building
the backend is also the more interesting problem, so that is what I did.

## Architecture

The shape of the solution at a glance:

{% mermaid() %}
flowchart LR
    subgraph Browser
        A[Comment Form]
    end
    subgraph CF [Cloudflare]
        B[Worker]
        T[Turnstile]
    end
    subgraph N [Neon]
        D[(PostgreSQL)]
    end
    subgraph GH [GitHub]
        I[Issue]
        E[Approve Action]
        BW[Build Action]
        R[Repository]
    end
    A -->|POST JSON| B
    B <-->|verify token| T
    B -->|INSERT pending| D
    B -->|open issue| I
    I -->|approved label| E
    E -->|UPDATE approved| D
    E -->|workflow_call| BW
    BW -->|SELECT approved| D
    BW -->|zola build| R
    R --> S([Live Site])
{% end %}

A form on the page posts JSON to a Cloudflare Worker. The Worker validates the
input, checks a Turnstile CAPTCHA token, hashes the email and IP, and inserts
the comment into Neon with `status = 'pending'`. It then opens a GitHub issue
containing the comment text for review. When I add the `approved` label to that
issue, an Actions workflow sets the status to `'approved'` in the database,
closes the issue, and calls the build workflow. That build queries all approved
comments, writes ephemeral `comments.toml` files into the workspace, runs
`zola build`, and deploys. The TOML files are never committed back to the
repository.

## The submission flow in detail

{% mermaid() %}
sequenceDiagram
    actor User
    participant Form
    participant TS as Turnstile
    participant W as Cloudflare Worker
    participant DB as Neon PostgreSQL
    participant GH as GitHub API

    User->>Form: fills in name + comment
    Form->>TS: widget solves challenge
    TS-->>Form: one-time token
    Form->>W: POST {author, text, email, token, ...}
    W->>W: CORS origin check
    W->>W: POST method check
    W->>W: honeypot field check
    W->>W: input validation
    W->>TS: verify token + visitor IP
    TS-->>W: success: true
    W->>W: SHA-256(email), SHA-256(IP)
    W->>DB: INSERT INTO comments ...
    DB-->>W: row inserted
    W-->>Form: 201 {ok: true}
    W-)GH: open issue (pending review)
    Form-->>User: "Comment posted!"
{% end %}

Before inserting, the Worker normalises line endings to `<br />` so that
paragraph breaks in the comment body render correctly in the Zola template,
which outputs the text as raw HTML after escaping everything else.

The issue is opened via `ctx.waitUntil`, meaning the Worker returns the 201
to the browser immediately and creates the issue in the background. The
commenter does not wait for it.

## The approval flow

{% mermaid() %}
sequenceDiagram
    actor Me
    participant GH as GitHub Issues
    participant A as Approve Action
    participant DB as Neon PostgreSQL
    participant B as Build Action

    GH->>Me: notification: new comment issue
    Me->>GH: add "approved" label
    GH->>A: issues.labeled event
    A->>A: verify label added by repo owner
    A->>DB: UPDATE SET status='approved'
    DB-->>A: row updated
    A->>GH: close issue
    A->>B: workflow_call
    B->>DB: SELECT all approved comments
    DB-->>B: rows grouped by post_slug
    B->>B: write comments.toml, zola build
    B->>B: deploy to gh-pages
{% end %}

The approval workflow runs only when the label is added by the repository owner,
checked via `github.actor == github.repository_owner`. Anyone else adding the
label causes the job to be skipped entirely.

## The build pipeline

{% mermaid() %}
sequenceDiagram
    participant GH as GitHub Actions
    participant A as Build Action
    participant DB as Neon PostgreSQL
    participant R as Repository

    GH->>A: workflow_call from approve action
    A->>R: checkout main
    A->>DB: SELECT all approved comments
    DB-->>A: rows grouped by post_slug
    A->>A: write content/.../comments.toml per post
    Note over A: files exist only in the CI workspace
    A->>A: zola build (reads .toml files)
    A->>R: deploy ./public to gh-pages
{% end %}

The export script is plain Python with `psycopg2` and `tomli-w`. It queries
every approved comment, groups them by `post_slug`, and writes one `comments.toml`
per post directory. Zola then reads those files during the build exactly as it
does for the historical Blogger comments. The `comments.toml` files are never
staged or committed; the CI workspace is discarded after the build completes.

## The database

One table, no ORM, no migration framework:

```sql
CREATE TABLE IF NOT EXISTS comments (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug            TEXT        NOT NULL,
  lang                 TEXT        NOT NULL DEFAULT 'en',
  author               TEXT        NOT NULL,
  email_hash           TEXT,          -- SHA-256(lower(trim(email))), for Gravatar only
  website              TEXT,          -- optional; becomes profile_url in TOML
  text                 TEXT        NOT NULL,
  status               TEXT        NOT NULL DEFAULT 'pending',  -- Worker always sets explicitly
  ip_hash              TEXT,          -- SHA-256(IP), never the raw address
  submitted_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_author            BOOLEAN     NOT NULL DEFAULT false,
  -- Fields populated only for comments imported from Blogger
  avatar_url           TEXT,
  profile_url          TEXT,
  blogger_comment_url  TEXT        UNIQUE
);

CREATE INDEX IF NOT EXISTS comments_slug_status_date
  ON comments (post_slug, status, submitted_at);
```

The `email_hash` column deserves a note. Gravatar uses a SHA-256 hash of the
lowercased, trimmed email address to look up avatars, so storing the hash is
sufficient. The raw address never touches the database. Same for the IP: it is
hashed before insert and only useful if I ever want to rate-limit by identity
without knowing who the person is.

The `blogger_comment_url` column is only populated for comments imported from
the old Blogger export. New comments leave it null. The `UNIQUE` constraint
prevents importing the same Blogger comment twice.

## Why these pieces

**Neon** is serverless PostgreSQL. Connections are handled over HTTP via their
`@neondatabase/serverless` driver, which matters a great deal when your backend
is an edge function that might run in dozens of locations: you cannot hold a
traditional TCP connection open. Neon's free tier is generous, the SQL is just
SQL, and I can inspect or edit rows directly in their console without installing
anything.

**Cloudflare Workers** was the obvious choice for the API layer because the
domain is already on Cloudflare, and Workers run at the edge. The free tier is
absurdly generous for a personal blog. Turnstile, the CAPTCHA widget I am using
for bot protection, is also a Cloudflare product, so the server-side
verification is a single internal API call.

**GitHub Actions** handles moderation, site deployment, and Worker deployment.
The build workflow runs on push to `main`, on `repository_dispatch`, and as a
reusable workflow via `workflow_call`. On a push to `main` it also deploys the
Cloudflare Worker via `wrangler deploy`, so Worker and site changes ship
together. The approval workflow triggers on any issue label event, checks that
the actor is the repository owner, flips the status in Neon, and calls the
build workflow. No separate deploy step: the same build path runs regardless of
what triggered it.

## Bridging two worlds

The bit that sounds strangest is regenerating static files every time someone
leaves a comment. Why not serve comments from the database at request time?

Because this is a static site. There is no request time in that sense. The HTML
is generated once at build time, not per-visitor. Zola reads the `.toml` files
alongside each post during the build and injects the comments into the page
template. That rendering code was already written and working for the historical
Blogger comments, which sit in the same format. Keeping the same format from a
new source means the display layer never needs to change.

So the build step exists to bridge two worlds:

{% mermaid() %}
flowchart LR
    subgraph live [Live world]
        direction TB
        F[Comment form] --> W[Worker] --> DB[(Neon)]
    end
    subgraph build [Build]
        direction TB
        X[export script] --> T[comments.toml] --> Z[Zola] --> P[HTML page]
    end
    DB -->|SELECT at build time| X
{% end %}

The export script is the only thing that crosses the boundary. It runs at the
start of every build — whether triggered by a push to `main` or by the approval
workflow — pulls approved rows from Neon, and writes them into the workspace
where Zola can find them. The files are temporary: Zola reads them, produces
HTML, and they vanish with the runner. Nothing is written back to the
repository.

An earlier version of this system committed the `comments.toml` files after
each new submission, then let the resulting push trigger the build. It worked,
but it meant every comment created a commit, the repository history filled with
churn, and a second comment arriving while the first export was still running
could race. Querying at build time is simpler and avoids all of that.

A comment still takes a few minutes to appear because a full build has to run.
That tradeoff is fine for a personal blog.

## Security without login

I made a deliberate call not to require login. The barrier to commenting on a
personal blog is already high; most people read and move on. Adding an auth wall
would not stop spam, it would stop the few people who might actually have
something to say.

What is in place instead:

**Cloudflare Turnstile** sits on the form. It is effectively invisible to real
users and works well against bots. Unlike reCAPTCHA it does not build a
behavioural profile of your visitors.

**A honeypot field** is hidden from real browsers but visible to bots scraping
the DOM. Any submission with that field filled in receives a silent `201` and is
immediately discarded. The bot thinks it succeeded.

**CORS is locked** to `mosab.co.uk`. The Worker rejects requests from any other
origin at the very top of the handler, before parsing the body or touching the
database.

**Input validation** checks every field: author length, text length, post slug
format (a strict regex: `^[a-z0-9/_-]+$`), and URL validity for the optional
website field.

**Nothing sensitive is stored raw.** Email, if provided, is only used to
resolve a Gravatar avatar. The Worker hashes it with SHA-256 before inserting.
The visitor IP is treated the same way.

The security layers in sequence:

{% mermaid() %}
flowchart TD
    R[Incoming request] --> C1{Correct origin?}
    C1 -->|no| X1[403 Forbidden]
    C1 -->|yes| C2{POST method?}
    C2 -->|no| X2[405 Method Not Allowed]
    C2 -->|yes| C3{Honeypot empty?}
    C3 -->|no| X3[201 silent discard]
    C3 -->|yes| C4{Input valid?}
    C4 -->|no| X4[400 Bad Request]
    C4 -->|yes| C5{Turnstile passes?}
    C5 -->|no| X5[400 CAPTCHA failed]
    C5 -->|yes| OK[Insert pending + open issue]
{% end %}

Every comment lands in the database as `pending` and is invisible until I
approve it. The approval mechanism is a GitHub issue: the Worker opens one for
each submission, I read the text, and if it looks fine I add the `approved`
label. An Actions workflow catches the label event, flips the status in the
database, closes the issue, and triggers a build. If the submission is spam I
just close the issue without labelling it and the comment stays pending forever.

No email infrastructure, no admin panel, no console queries. The issue inbox
is the moderation queue.

## What it took

The whole system is seven pieces:

1. A SQL migration: one `CREATE TABLE` and one `CREATE INDEX`.
2. A one-time Python script that imports all existing Blogger comments from the
   exported TOML files into Neon, making the database the single source of truth.
3. A Cloudflare Worker in TypeScript (~150 lines): CORS, honeypot, validation,
   Turnstile check, SHA-256 hashing, DB insert as `pending`, GitHub issue creation.
4. A moderation workflow (~30 lines of YAML): triggers on issue label, verifies
   the actor is the repo owner, runs the approval script, closes the issue, calls
   the build workflow.
5. A Python approval script (~30 lines): extracts the comment UUID from the issue
   body and sets `status = 'approved'` in Neon.
6. A Python export script (~60 lines): connect to Neon, group rows by slug,
   write `comments.toml` files into the workspace with `tomli-w`.
7. Two Zola template partials: one for rendering the comment list (with empty
   state), one for the form itself with RTL/LTR support for Arabic and English.

The form is at the bottom of this post. Comments are moderated, so yours will
appear once I have had a chance to review it.
