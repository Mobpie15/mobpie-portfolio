"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Send, X } from "lucide-react";
import { track } from "@vercel/analytics";
import Mascot, { MobiAvatar } from "@/components/Mascot";
import RecommendationCard from "./RecommendationCard";
import { recommend } from "@/lib/consult/knowledge";
import { EMPTY_CHIPS, FLOW, LEAD_EVENT, STARTERS, followUps, nextStep, type Answers, type Chip } from "@/lib/consult/flows";
import {
  EMPTY,
  loadChat,
  nextId,
  saveChat,
  saveLead,
  wipeChat,
  type ChatState,
  type Msg,
} from "@/lib/consult/session";
import { cn } from "@/lib/utils";

const INTRO =
  "Hey! I'm MobPie's website consultant.\nNot sure what kind of website you need? Tell me what you're building and I'll help you figure it out.";

const FALLBACK =
  "I'm having trouble connecting right now. You can still tell me what kind of website you're looking for and I'll point you in the right direction — or talk to Mobpie directly.";

// Rate limit is not a connection problem, so it gets its own honest wording.
const rateLimited = (secs: number) =>
  `You've sent a few messages in a row — give it about ${Math.max(1, Math.ceil(secs / 60))} minute${
    Math.ceil(secs / 60) > 1 ? "s" : ""
  } and we can carry on. In the meantime, this is a good moment to talk to Mobpie directly.`;

type Props = {
  open: boolean;
  minimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
};

export default function Consultant({ open, minimized, onClose, onMinimize }: Props) {
  const [state, setState] = useState<ChatState>(EMPTY);
  const [chips, setChips] = useState<Chip[]>([]);
  const [showStarters, setShowStarters] = useState(true);
  const [pending, setPending] = useState(false);
  const [stream, setStream] = useState("");
  const [input, setInput] = useState("");

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<ChatState>(EMPTY);
  const rafRef = useRef(0);

  const commit = useCallback((next: ChatState) => {
    stateRef.current = next;
    setState(next);
    saveChat(next);
  }, []);

  // sessionStorage is an external store that does not exist during SSR, so the
  // saved conversation can only be read after mount. Reading it in a microtask
  // keeps the first client render identical to the server render.
  useEffect(() => {
    const t = setTimeout(() => {
      const restored = loadChat();
      if (restored) {
        commit(restored);
        setShowStarters(false);
        const s = nextStep(restored.answers);
        setChips(s && restored.step === s ? FLOW[s].chips : EMPTY_CHIPS);
        return;
      }
      commit({ ...EMPTY, messages: [{ id: nextId(), role: "assistant", text: INTRO }], greeted: true });
    }, 0);
    return () => clearTimeout(t);
  }, [commit]);

  // Peeking is handled entirely by the launcher, so the panel just ignores it.
  useEffect(() => {
    if (open && minimized) onMinimize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [state.messages.length, stream, pending, open]);

  useEffect(() => {
    if (!open || minimized || !window.matchMedia("(min-width: 768px)").matches) return;
    const t = setTimeout(() => inputRef.current?.focus(), 320);
    return () => clearTimeout(t);
  }, [open, minimized]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onMinimize();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onMinimize]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const finishLead = useCallback(
    (answers: Answers) => {
      const r = recommend(answers);
      const lead = {
        type: r.type,
        goal: r.goal,
        audience: r.audience,
        sections: r.sections,
        features: r.features,
        planHint: r.planHint,
      };
      saveLead(lead);
      track("consult_recommendation", { type: r.type });
      return { lead, text: `Based on what you've told me, a ${r.type.toLowerCase()} would probably fit you best.\n\n${r.why}` };
    },
    [],
  );

  const send = useCallback(
    async (raw: string, chipId?: string) => {
      const text = raw.trim().slice(0, 800);
      if (!text || pending) return;

      if (chipId) track("consult_quick_action", { id: chipId });
      if (stateRef.current.messages.length <= 1) track("consult_started");

      const userMsg: Msg = { id: nextId(), role: "user", text };
      const withUser: ChatState = { ...stateRef.current, messages: [...stateRef.current.messages, userMsg] };
      commit(withUser);

      setInput("");
      setPending(true);
      setStream("");
      setChips([]);
      setShowStarters(false);

      // Record the answer when this chip belongs to the guided flow.
      // Chips send their `value`; free-typed text will not match, which is correct.
      let answers = withUser.answers;
      for (const key of Object.keys(FLOW)) {
        const hit = FLOW[key].chips.find((c) => c.value === text);
        if (hit) {
          answers = { ...answers, [key]: hit.value };
          break;
        }
      }
      const afterStep = nextStep(answers);
      const withAnswers: ChatState = { ...withUser, answers, step: afterStep };
      commit(withAnswers);

      let full = "";
      try {
        const res = await fetch("/api/consult", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: withAnswers.messages.map((m) => ({ role: m.role, content: m.text })),
          }),
        });
        if (!res.ok) {
          if (res.status === 429) {
            const info = (await res.json().catch(() => null)) as { retryIn?: number } | null;
            full = rateLimited(info?.retryIn ?? 600);
            setStream(full);
            throw new Error("rate_limited");
          }
          throw new Error("bad_response");
        }
        if (!res.body) throw new Error("bad_response");

        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            const t = line.trim();
            if (!t) continue;
            let obj: { t?: string };
            try {
              obj = JSON.parse(t);
            } catch {
              continue;
            }
            if (!obj.t || obj.t === "__DONE__") continue;
            full += obj.t;
            const snapshot = full;
            if (!rafRef.current) {
              rafRef.current = requestAnimationFrame(() => {
                setStream(snapshot);
                rafRef.current = 0;
              });
            }
          }
        }
      } catch (err) {
        // a 429 already set its own message; anything else is a real failure
        if ((err as Error)?.message !== "rate_limited") {
          full = FALLBACK;
          setStream(full);
        }
      } finally {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
        }
        setPending(false);
      }

      const reply: Msg = { id: nextId(), role: "assistant", text: full.trim() || FALLBACK };
      const finalState: ChatState = { ...stateRef.current, messages: [...stateRef.current.messages, reply] };
      commit(finalState);
      setStream("");

      const s = nextStep(finalState.answers);
      if (s) {
        commit({ ...finalState, step: s });
        setChips(FLOW[s].chips);
        setShowStarters(false);
      } else if (Object.keys(finalState.answers).length >= 4 && !finalState.lead) {
        const { lead, text } = finishLead(finalState.answers);
        commit({
          ...finalState,
          lead,
          step: null,
          messages: [...finalState.messages, { id: nextId(), role: "assistant", text }],
        });
        setChips([]);
      } else {
        setChips(followUps(finalState.answers));
      }
    },
    [pending, commit, finishLead],
  );

  const reset = useCallback(() => {
    track("consult_reset");
    wipeChat();
    commit({ ...EMPTY, messages: [{ id: nextId(), role: "assistant", text: INTRO }], greeted: true });
    setChips([]);
    setShowStarters(true);
    setStream("");
    setPending(false);
    setInput("");
  }, [commit]);

  const startProject = useCallback(() => {
    track("consult_cta", { id: "start_project" });
    // Tell the already-mounted contact form to re-read the saved plan.
    window.dispatchEvent(new Event(LEAD_EVENT));
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    onClose();
  }, [onClose]);

  const chipList: Chip[] = showStarters
    ? STARTERS.map((s) => ({ id: s.id, label: s.label, value: s.send }))
    : chips;

  const mood = pending ? "thinking" : state.lead ? "happy" : "idle";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="MobPie's website consultant"
          className={cn(
            "fixed z-[75] flex flex-col overflow-hidden border-[1.5px] border-ink bg-paper",
            // full-width bottom sheet on phones, fixed card on larger screens.
            // No CSS entrance animation here: it would fight framer-motion's own
            // transform on this element.
            "inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[1.75rem] pb-[env(safe-area-inset-bottom)]",
            "sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[25rem] sm:max-h-[min(640px,80vh)] sm:rounded-[1.75rem] sm:pb-0",
          )}
        >
          {minimized ? (
            <button type="button" onClick={onMinimize} className="flex items-center gap-2.5 px-4 py-3 text-left">
              <span className="w-7 shrink-0">
                <Mascot mood={mood} />
              </span>
              <span className="text-[13.5px] font-bold">Mobi is here when you are</span>
            </button>
          ) : (
            <>
              <div className="flex shrink-0 items-center gap-3 border-b-[1.5px] border-ink bg-card px-4 py-3">
                <MobiAvatar mood={mood} className="h-10 w-10 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold leading-tight">Mobi · website consultant</p>
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ember">
                    <span className={cn("h-1.5 w-1.5 rounded-full", pending ? "animate-pulse-dot bg-ember" : "bg-leaf")} />
                    {pending ? "thinking" : "online"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={reset}
                    aria-label="Start over"
                    className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-ink/20 transition-colors hover:border-ember hover:text-ember"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={onMinimize}
                    aria-label="Minimise chat"
                    className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-ink/20 transition-colors hover:border-ember hover:text-ember"
                  >
                    <span className="text-[17px] font-bold leading-none">&minus;</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close chat"
                    className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-ink/20 transition-colors hover:border-ember hover:text-ember"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div
                ref={listRef}
                data-lenis-prevent
                className="no-scrollbar flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
              >
                {state.messages.map((m) => (
                  <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                    <p
                      className={cn(
                        "animate-bubble-in max-w-[86%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed sm:text-[14px]",
                        m.role === "user"
                          ? "rounded-br-md bg-ink text-paper"
                          : "rounded-bl-md border-[1.5px] border-ink/15 bg-card text-ink",
                      )}
                    >
                      {m.text}
                    </p>
                  </div>
                ))}

                {pending && (
                  <div className="flex justify-start">
                    <span className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border-[1.5px] border-ink/15 bg-card px-3.5 py-3">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="animate-dot-bounce h-1.5 w-1.5 rounded-full bg-ink"
                          style={{ animationDelay: `${i * 0.16}s` }}
                        />
                      ))}
                    </span>
                  </div>
                )}

                {stream && (
                  <div className="flex justify-start">
                    <p className="animate-bubble-in max-w-[86%] whitespace-pre-wrap break-words rounded-2xl rounded-bl-md border-[1.5px] border-ink/15 bg-card px-3.5 py-2.5 text-[13.5px] leading-relaxed text-ink sm:text-[14px]">
                      {stream}
                      <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse-dot bg-ember" />
                    </p>
                  </div>
                )}

                {state.lead && <RecommendationCard lead={state.lead} onStart={startProject} />}
              </div>

              {!pending && chipList.length > 0 && (
                <div className="no-scrollbar shrink-0 overflow-x-auto px-4 pb-2.5">
                  <div className="flex w-max gap-2">
                    {chipList.map((c, i) => (
                      <button
                        key={`${c.id}-${i}`}
                        type="button"
                        onClick={() => send(c.value, c.id)}
                        className="animate-chip-in h-11 shrink-0 whitespace-nowrap rounded-full border-[1.5px] border-ink bg-card px-4 text-[13px] font-bold transition-all hover:bg-ink hover:text-paper"
                        style={{ animationDelay: `${i * 0.04}s` }}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex shrink-0 items-center gap-2 border-t-[1.5px] border-ink/15 bg-card px-3 py-2.5"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={800}
                  enterKeyHint="send"
                  placeholder="Type your answer…"
                  aria-label="Message Mobi"
                  className="h-11 min-w-0 flex-1 rounded-full border-[1.5px] border-ink/20 bg-paper px-4 text-[14px] font-medium outline-none transition-colors placeholder:font-normal placeholder:text-faint focus:border-ember"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || pending}
                  aria-label="Send message"
                  className="sticker flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ember text-white disabled:opacity-40"
                >
                  <Send size={17} />
                </button>
              </form>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
