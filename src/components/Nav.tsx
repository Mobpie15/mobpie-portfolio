"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { NAV, WA_DISPLAY, waLink } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-[70] transition-all duration-300",
          scrolled ? "border-b-[1.5px] border-ink/10 bg-paper/90 backdrop-blur-xl" : "bg-transparent"
        )}
      >
        <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 top-0 h-[3px] origin-left bg-ember" />
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6">
          <Link href="#top" className="text-[22px] font-bold tracking-tight sm:text-2xl">
            Mobpie<span className="text-ember">®</span>
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="text-[13.5px] font-bold uppercase tracking-[0.08em] text-ink2 transition-colors hover:text-ember">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={waLink("Hi Mobpie! I saw your portfolio and want to discuss a website project.")}
              target="_blank"
              rel="noopener noreferrer"
              className="sticker hidden h-11 items-center gap-1.5 rounded-full bg-ink px-5 text-[13px] font-bold text-paper sm:inline-flex"
            >
              Let&apos;s talk <ArrowUpRight size={15} />
            </a>
            <button onClick={() => setOpen(true)} className="sticker flex h-11 w-11 items-center justify-center rounded-full bg-paper" aria-label="Open menu">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[80] flex flex-col bg-ink text-paper"
          >
            <div className="flex h-16 items-center justify-between px-4 sm:h-[72px] sm:px-6">
              <span className="text-[22px] font-bold tracking-tight">
                Mobpie<span className="text-ember">®</span>
              </span>
              <button onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-paper/30" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1 px-6">
              {NAV.map((n, i) => (
                <motion.div
                  key={n.href}
                  initial={{ opacity: 0, x: -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.1 }}
                >
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-4 border-b border-paper/10 py-3"
                  >
                    <span className="text-xs font-bold text-ember">0{i + 1}</span>
                    <span className="font-display text-5xl font-semibold transition-transform group-hover:translate-x-2 sm:text-6xl">
                      {n.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="p-6">
              <a
                href={waLink("Hi Mobpie! I saw your portfolio and want to discuss a website project.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[56px] items-center justify-center gap-2 rounded-full bg-ember text-[15px] font-bold text-white"
              >
                Let&apos;s talk · {WA_DISPLAY} <ArrowUpRight size={18} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
