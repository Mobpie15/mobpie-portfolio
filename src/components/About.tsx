"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInView } from "framer-motion";
import Mascot from "./Mascot";
import { Reveal, SectionHead } from "./ui";
import { Smile } from "./Doodles";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1300;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="relative scroll-mt-20 border-t-[1.5px] border-ink/10 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          index="07"
          kicker="The human behind it"
          doodle={<Smile />}
          title={<>Hi, I&apos;m Mobpie. <em className="font-display italic text-ember">Your unfair advantage.</em></>}
        />

        <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="absolute -left-3 -top-3 h-full w-full rounded-[2rem] border-[1.5px] border-ink bg-sun" />
            <div className="relative overflow-hidden rounded-[2rem] border-[1.5px] border-ink bg-card">
              <Image
                src="/images/mobpie-avatar.jpg"
                alt="Mobpie — independent web engineer and designer from India"
                width={800}
                height={800}
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border-[1.5px] border-ink bg-paper px-4 py-3">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-ember">Based in India</p>
                  <p className="text-[14px] font-bold">Working worldwide, remote</p>
                </div>
                <span className="w-10"><Mascot body="#f04a1d" /></span>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="font-display text-2xl leading-snug font-medium sm:text-[1.8rem]">
                Agencies sell you account managers and junior interns. With me you get the{" "}
                <em className="italic text-ember">designer and the engineer</em> in one person —
                direct chat, rapid turnarounds, code so clean your pages load before visitors blink.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { v: <Counter to={50} suffix="+" />, l: "Projects shipped" },
                  { v: <Counter to={16} suffix="" />, l: "Tools mastered" },
                  { v: <Counter to={7} suffix="" />, l: "Day fastest sprint" },
                ].map((s) => (
                  <div key={s.l} className="sticker rounded-2xl bg-card px-2 py-5 text-center">
                    <p className="font-display text-3xl font-semibold text-ember sm:text-4xl">{s.v}</p>
                    <p className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink2 sm:text-[11px]">{s.l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
