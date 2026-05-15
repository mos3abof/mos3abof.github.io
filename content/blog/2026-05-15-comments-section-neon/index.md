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
        E[Actions]
        R[Repository]
    end
    A -->|POST JSON| B
    B <-->|verify token| T
    B -->|INSERT| D
    B -->|repository_dispatch| E
    E -->|SELECT approved| D
    E -->|commit .toml| R
    R -->|push triggers| P[Build & Deploy]
    P --> S([Live Site])
{% end %}

A form on the page posts JSON to a Cloudflare Worker. The Worker validates the
input, checks a Turnstile CAPTCHA token, hashes the email and IP, and inserts
the comment into a Neon PostgreSQL table. It then fires a `repository_dispatch`
event at GitHub, which triggers a separate Action. That Action queries the
database, regenerates the `comments.toml` files, and commits the result. The
existing build workflow picks up the commit and deploys the site.

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
    W->>W: honeypot field check
    W->>W: input validation
    W->>TS: verify token + visitor IP
    TS-->>W: success: true
    W->>W: SHA-256(email), SHA-256(IP)
    W->>DB: INSERT INTO comments ...
    DB-->>W: row inserted
    W-->>Form: 201 {ok: true}
    W-)GH: repository_dispatch new-comment
    Form-->>User: "Comment posted!"
{% end %}

The `repository_dispatch` call is fired via `ctx.waitUntil`, meaning the Worker
returns the 201 to the browser immediately and dispatches to GitHub in the
background. The commenter does not wait for the export to finish.

## The export pipeline

{% mermaid() %}
sequenceDiagram
    participant GH as GitHub API
    participant A as Export Action
    participant DB as Neon PostgreSQL
    participant R as Repository
    participant B as Build Workflow

    GH->>A: trigger on new-comment event
    A->>R: checkout main
    A->>DB: SELECT all approved comments
    DB-->>A: rows grouped by post_slug
    A->>A: write content/.../comments.toml per post
    A->>R: git add content/**/*.toml
    Note over A,R: only commits if files changed
    A->>R: git commit + push
    R->>B: push event triggers build
    B->>B: zola build
    B->>R: deploy to GitHub Pages
{% end %}

The export script is plain Python with `psycopg2` and `tomli-w`. It queries
every approved comment, groups them by `post_slug`, and writes one `comments.toml`
per post directory. The Action then commits only the files that actually changed.
If the same `repository_dispatch` fires twice in quick succession, the second
commit will be empty and skipped.

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
  status               TEXT        NOT NULL DEFAULT 'approved',
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

**GitHub Actions** for the export was the path of least resistance. I already
have a deploy Action running on every push to `main`. Adding a second workflow
that triggers on `repository_dispatch` with a `new-comment` event type cost
about twenty lines of YAML.

## The TOML loop

The bit that sounds strangest is regenerating static files every time someone
leaves a comment. Why not serve comments from the database at request time?

Because this is a static site. There is no request time in that sense. The HTML
is generated once at build time, not per-visitor. Zola reads the `.toml` files
alongside each post during the build and injects the comments into the page
template. That rendering code was already written and working for the historical
Blogger comments, which sit in the same format. Keeping the same format from a
new source means the display layer never needs to change.

So the loop exists to bridge two worlds:

{% mermaid() %}
flowchart LR
    subgraph live [Live world]
        direction TB
        F[Comment form] --> W[Worker] --> DB[(Neon)]
    end
    subgraph static [Static world]
        direction TB
        T[comments.toml] --> Z[Zola build] --> P[HTML page]
    end
    DB -->|export Action| T
{% end %}

The export script is the only thing that crosses the boundary. It runs on every
`new-comment` event, pulls approved rows from Neon, and writes them into the
file tree that Zola knows how to read. The commit is the trigger for the build.

It is a little baroque. It also means a comment takes a few minutes to appear
rather than being instant. That tradeoff is fine for a personal blog.

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
    C5 -->|yes| OK[Insert + dispatch]
{% end %}

All comments go straight to `approved` for now. Moderation-by-email would
require email infrastructure I do not want to maintain. Moderation-by-console
means I will forget to check it. If spam becomes a real problem later, Akismet
has a clean API and can be wired in without changing anything else in the
pipeline.

## What it took

The whole system is six pieces:

1. A SQL migration: one `CREATE TABLE` and one `CREATE INDEX`.
2. A one-time Python script that imports all existing Blogger comments from the
   exported TOML files into Neon, making the database the single source of truth.
3. A Cloudflare Worker in TypeScript (~150 lines): CORS, honeypot, validation,
   Turnstile check, SHA-256 hashing, DB insert, GitHub dispatch.
4. A GitHub Action (~40 lines of YAML): checkout, run export script, commit if
   anything changed.
5. A Python export script (~80 lines): connect to Neon, group rows by slug,
   write `comments.toml` files with `tomli-w`.
6. Two Zola template partials: one for rendering the comment list (with empty
   state), one for the form itself with RTL/LTR support for Arabic and English.

The form is at the bottom of this post. Try it out and let me know what you
think.
