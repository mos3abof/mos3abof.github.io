#!/usr/bin/env python3
"""
One-time script: import all existing Blogger comments from TOML files into Neon.

Usage:
    NEON_DATABASE_URL="postgres://..." python comments/import_blogger_comments.py

Run this once after creating the schema. The ON CONFLICT clause makes it safe
to re-run — already-imported comments are skipped.
"""

import os
import sys
import tomllib
from pathlib import Path

import psycopg2

DATABASE_URL = os.environ["NEON_DATABASE_URL"]
CONTENT_DIR = Path(__file__).resolve().parent.parent / "content"


def post_slug(toml_path: Path) -> str:
    """blog/2007-08-19-sometimes-i-forget  (relative to content/)"""
    return str(toml_path.relative_to(CONTENT_DIR).parent)


def detect_lang(toml_path: Path) -> str:
    return "ar" if (toml_path.parent / "index.ar.md").exists() else "en"


def main() -> None:
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    toml_files = sorted(CONTENT_DIR.rglob("comments.toml"))
    inserted = skipped = 0

    for toml_path in toml_files:
        slug = post_slug(toml_path)
        lang = detect_lang(toml_path)

        with open(toml_path, "rb") as fh:
            data = tomllib.load(fh)

        for c in data.get("comments", []):
            blogger_url = c.get("comment_url") or None

            cur.execute(
                """
                INSERT INTO comments (
                    post_slug, lang, author, text, status,
                    submitted_at, is_author,
                    avatar_url, profile_url, blogger_comment_url
                )
                VALUES (%s, %s, %s, %s, 'approved', %s, %s, %s, %s, %s)
                ON CONFLICT (blogger_comment_url) DO NOTHING
                """,
                (
                    slug,
                    lang,
                    c.get("author", "Anonymous"),
                    c.get("text", ""),
                    c.get("date"),
                    c.get("is_author", False),
                    c.get("avatar_url") or None,
                    c.get("profile_url") or None,
                    blogger_url,
                ),
            )
            if cur.rowcount:
                inserted += 1
            else:
                skipped += 1

    conn.commit()
    cur.close()
    conn.close()
    print(f"Done. Inserted {inserted}, skipped {skipped} duplicates.")


if __name__ == "__main__":
    if "NEON_DATABASE_URL" not in os.environ:
        sys.exit("Error: NEON_DATABASE_URL environment variable is not set.")
    main()
