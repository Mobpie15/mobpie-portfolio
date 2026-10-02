"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal, SectionHead } from "./ui";
import { PlusDoodle } from "./Doodles";
import { WA_DISPLAY, waLink } from "@/lib/data";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How much does a website cost?",
    a: "No hourly billing, no surprises. After a free WhatsApp consultation, you get a fixed quote with a fixed timeline — Starter (3–5 days), Flagship (7–10 days) or 3D Atelier (14–20 days). The price we agree is the price you pay.",
  },
  {
    q: "Do I have to pay anything in advance?",
    a: "No. You simply book by sharing your website info — zero payment. Within 1–3 days I build you a free demo site. Pay the 40–50% advance only if you love the demo. After that, work and payments move milestone-wise. Simple and scam-proof.",
  },
  {
    q: "How long will my project take?",
    a: "Most sites ship in 7–10 days. You get a live preview link from day one, updated daily — you watch it being built and approve every screen before launch.",
  },
  {
    q: "Will it work properly on mobile?",
    a: "Mobile-first is non-negotiable. Every layout is designed thumb-first with big touch targets and readable type, then tested on real phones — because that's where your customers are.",
  },
  {
    q: "Do I actually own the website?",
    a: "100%. Complete source code, design assets and repository — yours forever. No monthly traps, no hostage fees, no proprietary lock-in. If we ever part ways, your site keeps running.",
  },
  {
    q: "I already have a website. Can you fix it?",
    a: "That's my specialty — full rebuilds and makeovers. I keep your domain, content and Google rankings intact, then relaunch you with zero downtime on a site that loads in under half a second.",
  },
  {
    q: "What happens after launch?",
    a: "Every plan includes free post-launch support (up to 3 months on Atelier builds). After that, optional monthly management covers updates, security and speed — or take the keys and drive yourself.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative scroll-mt-20 border-t-[1.5px] border-ink/10 bg-paper2/50 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHead
          index="08"
          kicker="Fair questions"
          doodle={<PlusDoodle />}
          title={<>Everything clients ask <em className="font-display italic text-ember">before paying.</em></>}
        />

        <div className="overflow-hidden rounded-[1.75rem] border-[1.5px] border-ink bg-card">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={cn(i > 0 && "border-t-[1.5px] border-ink/10")}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 p-5 text-left sm:p-6"
                >
                  <span className="font-display text-lg font-semibold text-ember">Q{i + 1}</span>
                  <span className="flex-1 font-display text-xl font-semibold tracking-tight sm:text-2xl">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink transition-colors",
                      isOpen ? "bg-ember text-white" : "bg-paper"
                    )}
                  >
                    <Plus size={17} strokeWidth={3} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl px-5 pb-6 pl-[4.25rem] pr-6 text-[14.5px] leading-relaxed text-ink2 sm:pl-[4.75rem]">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 text-center text-[14.5px] text-ink2">
            Still thinking?{" "}
            <a
              href={waLink("Hi Mobpie! I have a question about getting a website built.")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-ember underline underline-offset-4"
            >
              Ask me on WhatsApp ({WA_DISPLAY})
            </a>{" "}
            — I usually reply the same day.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
