import { buildSystemPrompt, wrapUserText } from "@/lib/consult/prompt";
import { cleanMessages, rateLimit, scrub } from "@/lib/consult/guard";
import { offlineReply } from "@/lib/consult/offline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const PRIMARY_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const FALLBACK_MODEL = "openai/gpt-oss-20b";
const TIMEOUT_MS = 25_000;

type Delta = { t: string };

function sse(chunks: Delta[]): Response {
  const enc = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const c of chunks) controller.enqueue(enc.encode(JSON.stringify(c) + "\n"));
      controller.close();
    },
  });
  return new Response(body, {
    headers: {
      "Content-Type": "text/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

function err(code: string, status: number, extra?: Record<string, unknown>) {
  return Response.json({ error: code, ...extra }, { status });
}

async function callGroq(
  key: string,
  model: string,
  system: string,
  history: { role: "user" | "assistant"; content: string }[],
  signal: AbortSignal,
): Promise<Response> {
  const messages = [
    { role: "system", content: system },
    ...history.map((m) =>
      m.role === "user"
        ? { role: "user", content: wrapUserText(m.content) }
        : { role: "assistant", content: m.content },
    ),
  ];

  return fetch(GROQ_URL, {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages, stream: true, temperature: 0.7, max_tokens: 700 }),
  });
}

const DOWN = "I'm having trouble connecting right now — but we can still get somewhere.";

export async function POST(request: Request) {
  const limit = rateLimit(request);
  if (!limit.ok) return err("rate_limited", 429, { retryIn: limit.retryIn });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return err("bad_request", 400);
  }

  const history = cleanMessages((payload as { messages?: unknown })?.messages);
  if (history.length === 0) return err("bad_request", 400);

  const lastUser = [...history].reverse().find((m) => m.role === "user")?.content ?? "";
  const key = process.env.GROQ_API_KEY;
  const system = buildSystemPrompt();

  // No key configured: stay useful with a deterministic reply instead of a dead chat.
  if (!key) {
    return sse([{ t: `I'm running in offline mode right now, so I'll keep this useful.\n\n${offlineReply(lastUser)}` }]);
  }

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);

  try {
    let res: Response | null = null;
    try {
      res = await callGroq(key, PRIMARY_MODEL, system, history, ac.signal);
      // Overload / not-found / rate-limited on the big model -> retry on the small one.
      if (res && (res.status === 429 || res.status === 404 || res.status === 503)) {
        res = await callGroq(key, FALLBACK_MODEL, system, history, ac.signal);
      }
    } catch {
      res = null;
    }

    if (!res || !res.ok || !res.body) {
      return sse([{ t: `${DOWN}\n\n${offlineReply(lastUser)}` }]);
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    const out = new ReadableStream<Uint8Array>({
      async start(controller) {
        const enc = new TextEncoder();
        let buf = "";
        let sent = false;
        try {
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += dec.decode(value, { stream: true });
            const lines = buf.split("\n");
            buf = lines.pop() ?? "";
            for (const line of lines) {
              const t = line.trim();
              if (!t.startsWith("data:")) continue;
              const raw = t.slice(5).trim();
              if (!raw || raw === "[DONE]") continue;
              try {
                const text: string | undefined = JSON.parse(raw)?.choices?.[0]?.delta?.content;
                if (text) {
                  sent = true;
                  controller.enqueue(enc.encode(JSON.stringify({ t: scrub(text) }) + "\n"));
                }
              } catch {
                /* partial json line — skip */
              }
            }
          }
        } catch {
          /* aborted mid-stream */
        }
        if (!sent) {
          controller.enqueue(enc.encode(JSON.stringify({ t: `${DOWN}\n\n${offlineReply(lastUser)}` }) + "\n"));
        }
        controller.enqueue(enc.encode(JSON.stringify({ t: "__DONE__" }) + "\n"));
        controller.close();
      },
      cancel() {
        clearTimeout(timer);
      },
    });

    return new Response(out, {
      headers: {
        "Content-Type": "text/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch {
    return sse([{ t: `${DOWN}\n\n${offlineReply(lastUser)}` }]);
  } finally {
    clearTimeout(timer);
  }
}
