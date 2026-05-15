#!/usr/bin/env python3
"""
Approve a pending comment in Neon.

Called by the approve-comment GitHub Actions workflow when the 'approved'
label is added to a comment issue. Reads the comment UUID from the issue
body (embedded in an HTML comment) and sets status='approved' in the DB.

Usage (within the workflow):
    env:
      NEON_DATABASE_URL: ${{ secrets.NEON_DATABASE_URL }}
      ISSUE_BODY: ${{ github.event.issue.body }}
    run: python comments/approve_comment.py
"""

import os
import re
import sys

import psycopg2

ISSUE_BODY = os.environ.get("ISSUE_BODY", "")
DATABASE_URL = os.environ.get("NEON_DATABASE_URL", "")

if not DATABASE_URL:
    sys.exit("Error: NEON_DATABASE_URL not set.")

match = re.search(r"<!--\s*comment-id:\s*([0-9a-f-]{36})\s*-->", ISSUE_BODY)
if not match:
    sys.exit("Error: comment-id not found in issue body.")

comment_id = match.group(1)
print(f"Approving comment {comment_id}")

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()
cur.execute(
    "UPDATE comments SET status = 'approved' WHERE id = %s AND status = 'pending'",
    (comment_id,),
)
if cur.rowcount == 0:
    print(f"Warning: no pending comment with id={comment_id} (already approved or not found).")
else:
    print(f"Comment {comment_id} approved.")
conn.commit()
cur.close()
conn.close()
