import { neon } from '@neondatabase/serverless';

export interface Env {
  NEON_DATABASE_URL: string;
  TURNSTILE_SECRET_KEY: string;
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;   // e.g. "mos3abof/mos3abof.github.io"
  ALLOWED_ORIGIN: string; // e.g. "https://mosab.co.uk"
}

const MAX_AUTHOR = 100;
const MAX_TEXT = 5000;
const MAX_WEBSITE = 200;
const SLUG_RE = /^[a-z0-9/_-]+$/;

// ── Helpers ──────────────────────────────────────────────────────────────────

async function sha256hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(input.toLowerCase().trim()),
  );
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function isValidHttpUrl(s: string): boolean {
  try {
    const { protocol } = new URL(s);
    return protocol === 'http:' || protocol === 'https:';
  } catch { return false; }
}

async function verifyTurnstile(token: string, ip: string, secret: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token, remoteip: ip }),
  });
  const data = await res.json() as { success: boolean };
  return data.success === true;
}

async function openIssue(
  env: Env,
  id: string,
  slug: string,
  author: string,
  text: string,
): Promise<void> {
  const postUrl = `${env.ALLOWED_ORIGIN}/${slug}/`;
  const body = [
    `**Author:** ${author}`,
    `**Post:** [${slug}](${postUrl})`,
    ``,
    `---`,
    ``,
    text,
    ``,
    `---`,
    ``,
    `Add the **approved** label to publish this comment.`,
    ``,
    `<!-- comment-id: ${id} -->`,
  ].join('\n');

  const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'mosab-comments/1.0',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: `New comment: ${author} on ${slug}`,
      body,
    }),
  });
  if (!res.ok) {
    console.error('GitHub issue creation failed:', res.status, await res.text());
  }
}

function respond(data: unknown, status: number, cors: HeadersInit): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}

// ── Main handler ─────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get('Origin') ?? '';
    const cors: HeadersInit = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (origin !== env.ALLOWED_ORIGIN) {
      return new Response('Forbidden', { status: 403 });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: cors });
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json() as Record<string, unknown>;
    } catch {
      return respond({ error: 'Invalid JSON' }, 400, cors);
    }

    // Honeypot: bots fill the hidden field; humans don't
    if (body.website_url) {
      return respond({ ok: true }, 201, cors);
    }

    // ── Input validation ──────────────────────────────────────────────────────
    const author = String(body.author ?? '').trim();
    const text = String(body.text ?? '').trim();
    const postSlug = String(body.post_slug ?? '').trim();
    const lang = body.lang === 'ar' ? 'ar' : 'en';
    const email = String(body.email ?? '').trim();
    const website = String(body.website ?? '').trim();
    const tsToken = String(body.cf_turnstile_response ?? '');

    if (!author || author.length > MAX_AUTHOR)
      return respond({ error: 'Invalid author' }, 400, cors);

    if (!text || text.length > MAX_TEXT)
      return respond({ error: 'Invalid text' }, 400, cors);

    if (!postSlug || postSlug.length > 200 || !SLUG_RE.test(postSlug))
      return respond({ error: 'Invalid post_slug' }, 400, cors);

    if (website && (!isValidHttpUrl(website) || website.length > MAX_WEBSITE))
      return respond({ error: 'Invalid website URL' }, 400, cors);

    // ── Turnstile verification ────────────────────────────────────────────────
    const ip = request.headers.get('CF-Connecting-IP') ?? '';
    if (!await verifyTurnstile(tsToken, ip, env.TURNSTILE_SECRET_KEY))
      return respond({ error: 'CAPTCHA verification failed' }, 400, cors);

    // ── Persist ───────────────────────────────────────────────────────────────
    const emailHash = email ? await sha256hex(email) : null;
    const ipHash = ip ? await sha256hex(ip) : null;

    // Normalise line endings → <br /> so the Zola template renders line breaks
    const normText = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n/g, '<br />');

    let commentId: string;
    try {
      const sql = neon(env.NEON_DATABASE_URL);
      const rows = await sql`
        INSERT INTO comments (post_slug, lang, author, email_hash, website, text, ip_hash, status)
        VALUES (${postSlug}, ${lang}, ${author}, ${emailHash}, ${website || null}, ${normText}, ${ipHash}, 'pending')
        RETURNING id
      `;
      commentId = rows[0].id as string;
    } catch (err) {
      console.error('DB insert error:', err);
      return respond({ error: 'Database error' }, 500, cors);
    }

    // Open a GitHub issue for moderation — commenter doesn't wait for it
    ctx.waitUntil(openIssue(env, commentId, postSlug, author, text));

    return respond({ ok: true }, 201, cors);
  },
};
