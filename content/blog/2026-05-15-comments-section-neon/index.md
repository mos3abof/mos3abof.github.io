---
title: "Comments Backed by Neon & Cloudflare"
date: 2026-05-15
tags: [neon, cloudflare, postgres, zola, static-site]
draft: true
---

This blog has had comments since 2006. They lived on Blogger, which hosted the
whole thing back then. When I moved to a static site a few years ago, I
exported all the old content, posts, images, comments, and kept the comments
as `.toml` files sitting next to each post. The display layer already knows how
to render them. They look fine.

What I did not keep was the ability to write new ones. If you wanted to leave a
comment after I migrated, there was simply nowhere to send it.

I have been meaning to fix that for a while. This week I finally did.

{{ sep(style="dingbats", gap="sm") }}

The core problem with comments on a static site is that a static site has no
server. When you hit "submit" on a form, something has to catch the request,
validate it, and store it somewhere. A static file host does none of that.

There are two exits from this corner. You outsource to a third-party commenting
service, Disqus is the obvious one, there are smaller ones, or you build a
small backend yourself and keep control of the data. I dislike Disqus on
principle (the tracker payload, the ads, the constant account nagging), and
frankly building the backend is the more interesting problem, so that's what I
did.

The shape of the solution ended up being:

{% mermaid() %}
flowchart TD
    A([Commenter]) -->|POST JSON| B[Cloudflare Worker]
    B -->|validate + insert| C[(Neon PostgreSQL)]
    B -->|repository_dispatch| D[GitHub Actions]
    D -->|SELECT approved| C
    D --> E[/comments.toml files/]
    E --> F[git commit]
    F --> G[Build Workflow]
    G --> H([Site])
{% end %}

A form on the page posts JSON to a Cloudflare Worker. The Worker validates the
input, verifies a Turnstile CAPTCHA, hashes the email and IP address, and
inserts the comment into a Neon PostgreSQL table. It then fires a
`repository_dispatch` event at GitHub, which triggers a separate Action that
queries the database, regenerates the `comments.toml` files, and commits the
result. The existing build workflow picks up the commit and deploys.

## Why these pieces

**Neon** is serverless PostgreSQL. Connections are handled over HTTP, which
matters a lot when your backend is an edge function that might run in hundreds
of different locations, you can't hold a traditional TCP connection open.
Neon's free tier is generous, the SQL is just SQL, and I can inspect or edit
rows directly in their console without installing anything. No ORM, no
migration framework, one table.

**Cloudflare Workers** was the obvious choice for the API layer because the
domain is already on Cloudflare, and Workers run at the edge, meaning the
validation code runs physically close to whoever is submitting the comment. The
free tier is also absurdly generous for a personal blog. Turnstile, the CAPTCHA
widget I'm using for bot protection, is also a Cloudflare product, so the
server-side verification is a single internal API call.

**GitHub Actions** for the export was the path of least resistance. I already
have a deploy Action running on every push to `main`. Adding a second workflow
that triggers on `repository_dispatch` with a `new-comment` event type cost
about twenty lines of YAML. The Worker sends a `POST` to the GitHub API after
the DB insert, the Action runs, and a few minutes later the comment is live.

## The TOML loop

The bit that sounds the strangest is regenerating static files every time
someone leaves a comment. Why not just serve comments from the database at
request time?

Because this is a static site. There is no "request time" in that sense, the
HTML is generated once at build time, not per-visitor. Zola, the static site
generator I use, reads the `.toml` files alongside each post during the build
and injects the comments into the page template. That rendering code is already
written and working fine. The historical Blogger comments sit in the same
format. If I can keep feeding the same format from a different source, the
display layer never needs to change.

So the loop exists to bridge two worlds: the live database where new comments
land, and the static build process that only knows how to read files. The
export script queries all approved comments per post and writes them out. The
commit is the trigger.

It is a little baroque. It also means a comment takes a few minutes to appear
rather than being instant. I think that is fine.

## Security without login

I made a deliberate call not to require login. The barrier to commenting on a
personal blog is already high, most people read and move on, and adding an
auth wall would not stop spam, it would just stop the few people who might
actually have something to say.

What is in place instead:

- **Cloudflare Turnstile** on the form. It is effectively invisible to real
  users, and it works well against bots. Unlike reCAPTCHA, it does not build a
  profile of your visitors.
- **A honeypot field** that is hidden from real browsers but visible to bots
  scraping the DOM. Any submission with that field filled in gets a silent 201
  and is immediately discarded.
- **Email is never stored raw.** If you provide one, it is optional, and only
  used to pull a Gravatar avatar, the Worker hashes it with SHA-256 before
  inserting. Same for the IP address. Neither ever touches the database in
  plain form.
- **CORS is locked** to `mosab.co.uk`. The Worker rejects requests from any
  other origin at the top of the handler, before anything else runs.

All comments go straight to `approved`. I chose this because
moderation-by-email means building email infrastructure I do not want to
maintain, and moderation-by-console means I will forget to check it. If spam
becomes a real problem later, Akismet has a clean API and can be wired in
without changing anything else in the pipeline.

## What it took

The whole system is six pieces:

1. A SQL migration, one `CREATE TABLE`.
2. A one-time Python script that imports all the existing Blogger comments from
   the TOML files into Neon, so the database becomes the single source of truth.
3. A Cloudflare Worker in TypeScript, about 150 lines including the
   validation, hashing, and Turnstile check.
4. A GitHub Action that runs on `repository_dispatch`, connects to Neon, and
   rewrites the relevant `.toml` files.
5. A Zola template partial for the form itself, with RTL/LTR handling for both
   Arabic and English.
6. Fourteen i18n strings in each language file.

The form is at the bottom of this post; try it out and tell me what you think!
