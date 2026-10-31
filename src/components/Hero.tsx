"use client";

import { motion } from "framer-motion";
import { useCallback } from "react";
import { ArrowDown } from "lucide-react";
import Mascot, { OrbitBadge } from "./Mascot";
import { EmberButton, InkButton } from "./ui";
import { Sparkle, Squiggle } from "./Doodles";
import { TICKER, WA_DISPLAY, waLink } from "@/lib/data";
import { OPEN_EVENT } from "@/components/consult/ConsultantLauncher";

const ease = [0.22, 1, 0.36, 1] as const;

const STATS: [string, string][] = [
  ["<0.4s", "page loads"],
  ["99/100", "google vitals"],
  ["1–3 days", "free demo site"],
  ["100%", "code is yours"],
];

export default function Hero() {
  // the hero robot is the first thing that talks to a visitor about their own site
  const openConsultant = useCallback(() => {
    window.dispatchEvent(new Event(OPEN_EVENT));
  }, []);

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div className="dotgrid pointer-events-none absolute inset-0" />

      {/* floating doodles */}
      {/* the hero robot is the front door to the consultant — make it obviously tappable */}
      <motion.button
        type="button"
        onClick={openConsultant}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.1, duration: 0.7, ease }}
        aria-label="Ask Mobi what kind of website you need"
        className="group absolute right-[6%] top-[16%] z-20 hidden w-24 md:block"
      >
        <span className="relative flex h-full w-full items-center justify-center rounded-[2rem] border-[1.5px] border-transparent p-2 transition-all duration-300 group-hover:rotate-3 group-hover:border-ink group-hover:bg-card group-hover:shadow-[5px_5px_0_#16130e]">
          <Mascot className="h-full w-full transition-transform duration-300 group-hover:scale-110" />
          <span className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-[1.5px] border-r-[1.5px] border-ink bg-card opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </span>
        <span className="pointer-events-none absolute bottom-full right-0 mb-1.5 w-max max-w-[13rem] rounded-2xl border-[1.5px] border-ink bg-card px-3 py-2 text-left text-[12px] font-bold leading-snug opacity-0 shadow-[3px_3px_0_#16130e] transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-100">
          Not sure what kind of website you need? Ask me.
        </span>
      </motion.button>
      <span className="animate-floaty pointer-events-none absolute left-[4%] top-[58%] hidden select-none font-display text-7xl italic text-ink/10 lg:block" style={{ "--fl-rot": "-8deg", animationDelay: "1s" } as React.CSSProperties}>
        hello!
      </span>
      <div className="animate-floaty pointer-events-none absolute right-[24%] top-[13%] hidden w-10 text-ember md:block" style={{ animationDelay: "0.6s" }}>
        <Sparkle />
      </div>
      <div className="animate-floaty pointer-events-none absolute bottom-[36%] left-[2%] hidden w-8 text-ink/40 lg:block" style={{ animationDelay: "2s" }}>
        <Sparkle />
      </div>
      <div className="animate-wiggle pointer-events-none absolute right-5 top-24 w-7 text-ember md:hidden">
        <Sparkle />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
        <h1 className="mt-6 font-bold uppercase leading-[0.92] tracking-tight">
          <motion.span
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.65, duration: 0.85, ease }}
            className="block text-[15.5vw] sm:text-[11vw] lg:text-[8.5rem]"
          >
            Websites
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.76, duration: 0.85, ease }}
            className="block text-[15.5vw] sm:text-[11vw] lg:text-[8.5rem]"
          >
            people{" "}
            <em className="relative inline-block pb-[0.28em] font-display font-medium normal-case italic text-ember">
              remember↗
              <Squiggle className="absolute bottom-0 left-0 h-[0.22em] w-full" />
            </em>
          </motion.span>
        </h1>

        <div className="mt-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.7, ease }}
            className="max-w-xl text-[15px] leading-relaxed text-ink2 sm:text-lg"
          >
            I&apos;m <b className="text-ink">Mobpie</b> — an independent web engineer & designer from India.
            I build blazing-fast, mobile-first websites with motion and 3D that turn casual visitors into paying customers.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 0.7, ease }}
            className="hidden shrink-0 md:block"
          >
            <OrbitBadge text="scroll for proof · free demo first " />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.7, ease }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <EmberButton href={waLink("Hi Mobpie! I saw your portfolio and want to commission a website.")} external>
            Start a project · {WA_DISPLAY}
          </EmberButton>
          <InkButton href="#work">See live work ↓</InkButton>
          {/* the hero robot is hidden on phones, so give mobile an explicit way in */}
          <button
            type="button"
            onClick={openConsultant}
            className="sticker flex h-[54px] items-center justify-center gap-2 rounded-full bg-card px-6 text-[14px] font-bold text-ink sm:hidden"
          >
            <Mascot className="w-6" /> Ask Mobi
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="mt-10 grid grid-cols-2 overflow-hidden rounded-2xl border-[1.5px] border-ink bg-card sm:grid-cols-4"
        >
          {STATS.map(([a, b], i) => (
            <div key={b} className={`px-4 py-4 sm:px-5 ${i > 0 ? "border-l-[1.5px] border-ink/10" : ""} ${i === 2 ? "max-sm:border-l-0 max-sm:border-t-[1.5px]" : ""} ${i === 3 ? "max-sm:border-t-[1.5px]" : ""}`}>
              <p className="text-xl font-bold tracking-tight sm:text-2xl">{a}</p>
              <p className="mt-0.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-faint">{b}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#work"
        aria-label="Scroll to work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
        className="relative z-10 mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-ink bg-card"
      >
        <ArrowDown size={17} className="animate-floaty" />
      </motion.a>

      <div className="relative z-10 border-t-[1.5px] border-ink bg-sun py-3">
        <div className="mask-fade-x flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-8 pr-8">
            {[...Array(2)].flatMap((_, r) =>
              TICKER.map((t) => (
                <span key={`${r}-${t}`} className="flex items-center gap-8 whitespace-nowrap text-[12.5px] font-bold uppercase tracking-[0.22em] text-ink">
                  {t} <span>✳</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
