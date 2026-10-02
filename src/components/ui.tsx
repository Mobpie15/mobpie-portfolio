"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  delay = 0,
  y = 30,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({
  index,
  kicker,
  title,
  blurb,
  doodle,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  blurb?: string;
  doodle?: React.ReactNode;
}) {
  return (
    <div className="mb-10 sm:mb-14">
      <Reveal>
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] sm:text-xs">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[11px] text-paper">
            {index}
          </span>
          <span className="text-ember">{kicker}</span>
          {doodle && <span className="inline-flex w-7 text-ember sm:w-8">{doodle}</span>}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-4 max-w-3xl text-balance font-display text-4xl font-semibold leading-[0.98] tracking-tight sm:text-6xl">
          {title}
        </h2>
      </Reveal>
      {blurb && (
        <Reveal delay={0.14}>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink2">{blurb}</p>
        </Reveal>
      )}
    </div>
  );
}

export function InkButton({
  children,
  href,
  external,
  className,
}: {
  children: React.ReactNode;
  href: string;
  external?: boolean;
  className?: string;
}) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={{ scale: 1.03, rotate: -0.5 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "sticker inline-flex h-[54px] items-center justify-center gap-2 rounded-full bg-ink px-7 text-[14px] font-bold text-paper sm:text-[15px]",
        className
      )}
    >
      {children}
    </motion.a>
  );
}

export function EmberButton({
  children,
  href,
  external,
  className,
}: {
  children: React.ReactNode;
  href: string;
  external?: boolean;
  className?: string;
}) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={{ scale: 1.03, rotate: 0.5 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "sticker inline-flex h-[54px] items-center justify-center gap-2 rounded-full bg-ember px-7 text-[14px] font-bold text-white sm:text-[15px]",
        className
      )}
    >
      {children} <ArrowUpRight size={17} />
    </motion.a>
  );
}
