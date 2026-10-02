"use client";

import Link from "next/link";
import { AtSign, Mail, MessageCircle } from "lucide-react";
import Mascot from "./Mascot";
import { Sparkle } from "./Doodles";
import { EMAIL, INSTAGRAM, INSTAGRAM_URL, NAV, WA_DISPLAY, waLink } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t-[1.5px] border-ink bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="flex items-center gap-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Mobpie<span className="text-ember">®</span>
              <span className="hidden w-12 sm:block"><Mascot body="#ffc53d" /></span>
              <span className="w-6 animate-wiggle text-sun"><Sparkle /></span>
            </p>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-paper/60">
              Independent web engineer & designer from India — websites people remember, built mobile-first and blazing fast.
            </p>
            <div className="mt-5 space-y-2 text-[13.5px] font-bold">
              <a href={waLink("Hi Mobpie!")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors hover:text-sun">
                <MessageCircle size={15} className="text-ember" /> {WA_DISPLAY}
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 transition-colors hover:text-sun">
                <Mail size={15} className="text-ember" /> {EMAIL}
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors hover:text-sun">
                <AtSign size={15} className="text-ember" /> @{INSTAGRAM}
              </a>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-paper/40">Sitemap</p>
            <ul className="mt-4 grid grid-cols-2 gap-2.5 md:grid-cols-1">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="font-display text-xl transition-colors hover:text-sun sm:text-2xl">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-paper/40">Live demos</p>
            <ul className="mt-4 space-y-2.5">
              {[
                ["Northwind E-Commerce", "https://northwind-demo-kb7spz3hh-mobpie.vercel.app"],
                ["Atelier Ora 3D", "https://fashion-brand-dun.vercel.app"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-[14px] text-paper/70 transition-colors hover:text-sun">
                    {label} ↗
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="sticker mt-6 inline-flex h-12 items-center rounded-full bg-ember px-6 text-[13.5px] font-bold text-white"
            >
              Start your project ↗
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-paper/15 pt-6 text-[12px] text-paper/40">
          <p>© 2026 Mobpie · Designed & engineered solo, with obsession.</p>
          <p>India · Working worldwide ✳</p>
        </div>
      </div>
    </footer>
  );
}
