/**
 * Server-only guards: IP rate limiting, input sanitising, output scrubbing.
 * No global setInterval — cleanup is lazy, per-request.
 */

type Bucket = { count: number; reset: number };
type Table = Map<string, Bucket>;

const g = globalThis as unknown as {
  __consultHits?: Table;
  __consultLast?: number;
};

const hits: Table = (g.__consultHits ??= new Map());
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20;
const SWEEP_MS = 60 * 1000;
const MAX_MESSAGES = 24;
const MAX_CHARS = 800;

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "local";
}

function sweep(now: number) {
  if (now - (g.__consultLast ?? 0) < SWEEP_MS) return;
  g.__consultLast = now;
  for (const [k, v] of hits) if (v.reset <= now) hits.delete(k);
}

export function rateLimit(req: Request): { ok: boolean; retryIn?: number } {
  const now = Date.now();
  sweep(now);
  const key = clientIp(req);
  const b = hits.get(key);
  if (!b || b.reset <= now) {
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
    return { ok: true };
  }
  if (b.count >= MAX_PER_WINDOW) {
    return { ok: false, retryIn: Math.ceil((b.reset - now) / 1000) };
  }
  b.count += 1;
  return { ok: true };
}

/** Strips control characters and clamps length. Never throws. */
export function sanitize(text: unknown): string {
  if (typeof text !== "string") return "";
  return text
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, MAX_CHARS);
}

export type InMsg = { role: "user" | "assistant"; content: string };

export function cleanMessages(raw: unknown): InMsg[] {
  if (!Array.isArray(raw)) return [];
  const out: InMsg[] = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    if (!m || typeof m !== "object") continue;
    const role = (m as { role?: unknown }).role;
    const content = sanitize((m as { content?: unknown }).content);
    if (!content) continue;
    if (role === "assistant") out.push({ role: "assistant", content });
    else if (role === "user") out.push({ role: "user", content });
  }
  return out;
}

/** Final safety net: nothing secret-shaped ever reaches the browser. */
export function scrub(text: string): string {
  return text
    .replace(/gsk_[A-Za-z0-9_-]{8,}/g, "[redacted]")
    .replace(/process\.env[\w.]*/g, "[redacted]")
    .replace(/\b(system prompt|my instructions|my system message)\b/gi, "that")
    .replace(/GROQ_API_KEY/gi, "[redacted]");
}
