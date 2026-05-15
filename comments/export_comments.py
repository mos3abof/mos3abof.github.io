#!/usr/bin/env python3
"""
Generate comments.toml files from Neon for all approved comments.

Run at build time (before zola build). The generated files are ephemeral --
they are written into the workspace for the build but never committed.

Usage:
    NEON_DATABASE_URL="postgres://..." python comments/export_comments.py
"""

import os
import sys
from pathlib import Path

import psycopg2
import tomli_w

DATABASE_URL = os.environ.get("NEON_DATABASE_URL", "")
CONTENT_DIR = Path(__file__).resolve().parent.parent / "content"
GRAVATAR_BASE = "https://www.gravatar.com/avatar/"


def gravatar_url(email_hash: str) -> str:
    return f"{GRAVATAR_BASE}{email_hash}?s=72&d=identicon"


def main() -> None:
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute(
        """
        SELECT post_slug, author, email_hash, website, avatar_url, profile_url,
               text, submitted_at, is_author, blogger_comment_url
        FROM comments
        WHERE status = 'approved'
        ORDER BY post_slug, submitted_at
        """
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    by_slug: dict[str, list[dict]] = {}
    for row in rows:
        (slug, author, email_hash, website, av_url, prof_url,
         text, submitted_at, is_author, blogger_url) = row

        resolved_avatar = av_url or (gravatar_url(email_hash) if email_hash else None)
        resolved_profile = prof_url or website or None

        comment: dict = {
            "author": author,
            "date": submitted_at.isoformat(),
            "text": text,
        }
        if is_author:
            comment["is_author"] = True
        if resolved_avatar:
            comment["avatar_url"] = resolved_avatar
        if resolved_profile:
            comment["profile_url"] = resolved_profile
        if blogger_url:
            comment["comment_url"] = blogger_url

        by_slug.setdefault(slug, []).append(comment)

    written = 0
    for slug, comments in by_slug.items():
        target = CONTENT_DIR / slug / "comments.toml"
        target.parent.mkdir(parents=True, exist_ok=True)
        with open(target, "wb") as fh:
            tomli_w.dump({"comments": comments}, fh)
        written += 1

    print(f"Wrote {written} comments.toml file(s) for {len(rows)} approved comment(s).")


if __name__ == "__main__":
    if not DATABASE_URL:
        print("NEON_DATABASE_URL not set, skipping comment export.", file=sys.stderr)
        sys.exit(0)
    main()
