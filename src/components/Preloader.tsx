"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Mascot from "./Mascot";

const WORDS = ["Sketching", "Designing", "Coding", "Polishing"];

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setCount(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 200);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ y: "-100%" }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-paper"
        >
          <div className="w-24 animate-wiggle sm:w-28">
            <Mascot />
          </div>
          <p className="font-display text-2xl italic sm:text-3xl">
            {WORDS[Math.min(WORDS.length - 1, Math.floor(count / 26))]}…
          </p>
          <p className="font-display text-6xl tabular-nums sm:text-7xl">
            {count}
            <span className="text-ember">%</span>
          </p>
          <div className="h-2 w-52 overflow-hidden rounded-full border-[1.5px] border-ink bg-paper2">
            <div className="h-full rounded-full bg-ember transition-[width]" style={{ width: `${count}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
