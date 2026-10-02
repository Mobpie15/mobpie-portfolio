"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { Sparkle, Squiggle } from "@/components/Doodles";
import { PLANS } from "@/lib/data";
import type { Lead } from "@/lib/consult/session";

/** The consultation payoff: a concrete, reviewable website plan. */
export default function RecommendationCard({ lead, onStart }: { lead: Lead; onStart: () => void }) {
  const plan = PLANS.find((p) => p.name === lead.planHint) ?? PLANS[1];

  return (
    <div className="animate-bubble-in overflow-hidden rounded-3xl border-[1.5px] border-ink bg-card">
      <div className="border-b-[1.5px] border-ink bg-ink px-5 py-3.5 text-paper">
        <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.22em] text-ember">
          <Sparkle className="w-3.5" /> Your website plan
        </p>
        <h3 className="font-display mt-1.5 text-2xl font-semibold leading-tight">{lead.type}</h3>
        <Squiggle className="mt-1 w-32 text-ember" />
      </div>

      <div className="space-y-4 px-5 py-4">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-faint">Main goal</p>
          <p className="mt-1 text-[14px] font-medium leading-snug">{lead.goal}</p>
        </div>

        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-faint">Who it&apos;s for</p>
          <p className="mt-1 text-[14px] font-medium leading-snug">{lead.audience}</p>
        </div>

        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-faint">Recommended sections</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {lead.sections.map((s) => (
              <span
                key={s}
                className="rounded-full border-[1.5px] border-ink/25 px-2.5 py-1 text-[11.5px] font-bold text-ink2"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-faint">Useful features</p>
          <ul className="mt-2 space-y-1.5">
            {lead.features.map((f) => (
              <li key={f} className="flex gap-2 text-[13.5px] leading-snug text-ink2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-leaf text-white">
                  <Check size={10} strokeWidth={4} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border-[1.5px] border-dashed border-ink/30 bg-paper px-4 py-3">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-faint">Closest sprint plan</p>
          <p className="mt-1 text-[14px] font-bold">
            {plan.name} <span className="text-ember">· {plan.time}</span>
          </p>
          <p className="mt-1 text-[12.5px] leading-snug text-ink2">
            Final quote is fixed after a free chat and depends on the exact scope — nothing to pay to start.
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="sticker flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-ember text-[14px] font-bold text-white"
        >
          Build something like this <ArrowUpRight size={16} />
        </button>
        <p className="text-center text-[11.5px] text-faint">
          Takes you to the project form with this plan already filled in.
        </p>
      </div>
    </div>
  );
}
