import { CHAT_KEY, LEAD_KEY, type Answers } from "./flows";

/** Session-scoped chat state. No server persistence, no PII beyond what the visitor types. */

export type Msg = { id: string; role: "user" | "assistant"; text: string };

export type Lead = {
  type: string;
  goal: string;
  audience: string;
  sections: string[];
  features: string[];
  planHint: string;
};

export type ChatState = {
  messages: Msg[];
  answers: Answers;
  step: string | null;
  lead: Lead | null;
  greeted: boolean;
};

export const EMPTY: ChatState = { messages: [], answers: {}, step: null, lead: null, greeted: false };

// Message ids must stay unique for the whole component lifetime, including after a
// conversation is restored from sessionStorage (where the counter starts over).
// A per-load random prefix guarantees that, and bumping the counter past any
// restored id keeps restored messages unique among themselves.
const RUN = Math.random().toString(36).slice(2, 8);
let seq = 0;

export const nextId = () => `m${RUN}${++seq}`;

/** Keeps the counter ahead of ids loaded from storage, so new ids never clash. */
function bumpSeq(messages: Msg[]) {
  let max = 0;
  for (const m of messages) {
    const tail = Number(m.id.split(/[^\d]/).pop());
    if (Number.isFinite(tail) && tail > max) max = tail;
  }
  if (max > seq) seq = max;
}

export function loadChat(): ChatState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CHAT_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<ChatState>;
    if (!p || !Array.isArray(p.messages) || p.messages.length === 0) return null;
    const messages = p.messages.slice(-24);
    bumpSeq(messages);
    return {
      messages,
      answers: p.answers ?? {},
      step: p.step ?? null,
      lead: p.lead ?? null,
      greeted: true,
    };
  } catch {
    return null;
  }
}

export function saveChat(s: ChatState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CHAT_KEY, JSON.stringify({ ...s, messages: s.messages.slice(-24) }));
  } catch {
    /* private mode — chat just won't persist */
  }
}

export function saveLead(lead: Lead) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(LEAD_KEY, JSON.stringify(lead));
  } catch {
    /* ignore */
  }
}

export function readLead(): Lead | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(LEAD_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<Lead>;
    return p && p.type ? (p as Lead) : null;
  } catch {
    return null;
  }
}

export function clearLead() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(LEAD_KEY);
  } catch {
    /* ignore */
  }
}

export function wipeChat() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(CHAT_KEY);
  } catch {
    /* ignore */
  }
}
