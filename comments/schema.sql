-- Run once in your Neon project's SQL editor.

CREATE TABLE IF NOT EXISTS comments (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug            TEXT        NOT NULL,
  lang                 TEXT        NOT NULL DEFAULT 'en',
  author               TEXT        NOT NULL,
  email_hash           TEXT,                      -- SHA-256(lower(trim(email))), for Gravatar only
  website              TEXT,                      -- optional; becomes profile_url in TOML
  text                 TEXT        NOT NULL,
  status               TEXT        NOT NULL DEFAULT 'approved',
  ip_hash              TEXT,                      -- SHA-256(IP), never the raw address
  submitted_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_author            BOOLEAN     NOT NULL DEFAULT false,
  -- Fields populated only for comments imported from Blogger
  avatar_url           TEXT,
  profile_url          TEXT,
  blogger_comment_url  TEXT        UNIQUE         -- NULL for new comments
);

CREATE INDEX IF NOT EXISTS comments_slug_status_date
  ON comments (post_slug, status, submitted_at);
