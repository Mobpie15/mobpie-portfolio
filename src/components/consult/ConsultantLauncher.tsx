"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { track } from "@vercel/analytics";
import Mascot from "@/components/Mascot";
import { SEEN_KEY } from "@/lib/consult/flows";
import { readLead } from "@/lib/consult/session";
import { waLink } from "@/lib/data";
import { cn } from "@/lib/utils";

// The chat panel is only loaded once the visitor actually reaches for Mobi.
const Consultant = dynamic(() => import("./Consultant"), { ssr: false });

const PEEK = "Need help figuring out what kind of website you need?";

/**
 * Fired by the hero robot (and any future in-page trigger) to open the panel.
 */
export const OPEN_EVENT = "mobi:consult-open";

/**
 * The robot invites people on its own rather than waiting for a hover.
 * Touch devices have no hover at all, and even on desktop most visitors never
 * rest on it — so the nudge is automatic, rotating, and easy to dismiss.
 */
const NUDGES = [
  PEEK,
  "Tell me what you're building and I'll work out what you actually need.",
  "Prices, timelines, features — ask me anything about getting a site built.",
  "Not sure if you need a site at all? I'll tell you honestly.",
];

const FIRST_NUDGE_AFTER = 2600;
const ROTATE_EVERY = 11_000;
const NUDGE_VISIBLE = 6500;

export default function ConsultantLauncher() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const [ready, setReady] = useState(false);
  const [hasLead, setHasLead] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [nudge, setNudge] = useState(PEEK);
  const [scrolled, setScrolled] = useState(false);

  // Mobi and the WhatsApp button arrive together once the hero is out of the
  // way, which is exactly how the old WhatsApp float behaved.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Wait for the preloader to clear so the robot does not fight it for attention.
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1700);
    return () => clearTimeout(t);
  }, []);

  // The robot introduces itself on its own — no hover, no click. On touch
  // devices hover does not exist at all, so waiting for it would mean the
  // invitation never shows on a phone.
  const openRef = useRef(false);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!ready || dismissed) return;
    let idx = 0;

    const show = () => {
      if (openRef.current) return;
      setHasLead(Boolean(readLead()));
      setNudge(NUDGES[idx % NUDGES.length]);
      setPeeking(true);
      idx += 1;
    };

    const first = setTimeout(show, FIRST_NUDGE_AFTER);
    // Each nudge hides itself, so keep re-arming the timer for the next one
    // instead of relying on one long interval.
    const loop = setInterval(show, ROTATE_EVERY);
    return () => {
      clearTimeout(first);
      clearInterval(loop);
    };
  }, [ready, dismissed]);

  // hide after a beat, then let the loop bring back the next nudge
  useEffect(() => {
    if (!peeking) return;
    const hide = setTimeout(() => setPeeking(false), NUDGE_VISIBLE);
    return () => clearTimeout(hide);
  }, [peeking]);

  // temporary hide: the nudge will come back on its own later
  const hidePeek = useCallback(() => setPeeking(false), []);

  // permanent dismiss: only the X button does this, for the rest of the session
  const dismissPeek = useCallback(() => {
    setPeeking(false);
    setDismissed(true);
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode */
    }
  }, []);

  const openChat = useCallback(() => {
    hidePeek();
    setMinimized(false);
    setOpen(true);
    track("consult_opened");
  }, [hidePeek]);

  // the hero robot (and any other in-page trigger) can open the panel
  useEffect(() => {
    const onOpen = () => openChat();
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, [openChat]);

  return (
    <>
      <Consultant
        open={open}
        minimized={minimized}
        onClose={() => setOpen(false)}
        onMinimize={() => setMinimized((m) => !m)}
      />

      {/* One fixed column on the right: Mobi sits directly above WhatsApp.
          Both arrive together once the visitor has scrolled past the hero, the
          same way the old WhatsApp float used to, so nothing stacks up at the
          top of the page. */}
      <AnimatePresence>
        {ready && scrolled && !open && (
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 26, scale: 0.7 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-4 bottom-5 z-[64] flex flex-col items-end gap-3 sm:right-5"
          >
            <AnimatePresence>
              {peeking && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.92 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="relative max-w-[13.5rem] sm:max-w-[16rem]"
                >
                  <button
                    type="button"
                    onClick={openChat}
                    className="animate-bubble-in w-full rounded-2xl border-[1.5px] border-ink bg-card px-3.5 py-2.5 pr-8 text-left text-[12.5px] font-bold leading-snug shadow-[3px_3px_0_#16130e]"
                  >
                    {hasLead ? "Ready to start? Your plan is saved." : nudge}
                  </button>
                  <span
                    aria-hidden
                    className="absolute -bottom-1.5 right-8 h-3 w-3 rotate-45 border-b-[1.5px] border-r-[1.5px] border-ink bg-card"
                  />
                  <button
                    type="button"
                    onClick={dismissPeek}
                    aria-label="Dismiss hint"
                    className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full text-faint transition-colors hover:text-ember"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={openChat}
              aria-label="Ask Mobi what kind of website you need"
              // same box as the WhatsApp button below, so the pair reads as one
              // tidy stack rather than two differently sized circles
              className="group relative flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-ink bg-card p-1 transition-shadow hover:shadow-[4px_4px_0_#16130e]"
            >
              {/* the float lives on the inner span so it can pause on hover/focus
                  and never make the tap target itself move under the user's finger */}
              <span
                className={cn(
                  "flex h-full w-full items-center justify-center [animation-play-state:paused] group-hover:[animation-play-state:running] group-focus-visible:[animation-play-state:running]",
                  peeking ? "animate-robot-peek" : "animate-robot-float",
                )}
              >
                <Mascot className="h-full w-full transition-transform duration-300 group-hover:scale-105" />
              </span>
              {!peeking && (
                <span className="absolute -right-0.5 -bottom-0.5 flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] border-ink bg-leaf text-white">
                  <MessageCircle size={11} strokeWidth={3} />
                </span>
              )}
            </button>

            <motion.a
              href={waLink("Hi Mobpie! I'm interested in commissioning a website project.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.08, rotate: -4 }}
              whileTap={{ scale: 0.94 }}
              className="sticker flex h-14 w-14 items-center justify-center rounded-full bg-leaf text-white"
            >
              <MessageCircle size={23} />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
