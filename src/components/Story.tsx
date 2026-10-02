import Mascot from "./Mascot";
import { Reveal, SectionHead } from "./ui";
import { HeartDoodle } from "./Doodles";
import { cn } from "@/lib/utils";

const CARDS = [
  {
    bg: "bg-sun",
    sticker: "01 · Speed",
    title: "0.4 seconds, or they bounce.",
    desc: "53% of mobile visitors leave if a page takes over 3 seconds. Mine load in under half a second — clean code, optimized assets, zero bloat. Speed isn't a feature, it's the whole game.",
  },
  {
    bg: "bg-card",
    sticker: "02 · Mobile-first",
    title: "Your customers live on phones.",
    desc: "Every layout is designed thumb-first: 52px touch targets, readable type, checkout flows that work one-handed on a crowded train. Desktop gets the same love, automatically.",
  },
  {
    bg: "bg-blush",
    sticker: "03 · Direct line",
    title: "You talk to ME. Nobody else.",
    desc: "No account managers, no juniors practicing on your budget. One WhatsApp chat with the person designing and writing every single line — direct answers, daily updates.",
  },
  {
    bg: "bg-ink",
    sticker: "04 · Ownership",
    title: "You own 100% of everything.",
    desc: "Complete source code, assets and repository — yours forever. No monthly traps, no hostage fees, no proprietary lock-in. If we part ways, your site keeps running.",
    dark: true,
  },
];

export default function Story() {
  return (
    <section id="why" className="relative scroll-mt-20 border-t-[1.5px] border-ink/10 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          index="03"
          kicker="Why it works"
          doodle={<HeartDoodle />}
          title={<>Four reasons visitors become <em className="font-display italic text-ember">buyers.</em></>}
        />

        <div className="space-y-5">
          {CARDS.map((c, i) => (
            <div key={c.sticker} className="sticky" style={{ top: `${88 + i * 16}px` }}>
              <Reveal y={36}>
                <article
                  className={cn(
                    "overflow-hidden rounded-[1.75rem] border-[1.5px] border-ink p-6 sm:p-10",
                    c.bg,
                    c.dark ? "text-paper" : "text-ink"
                  )}
                >
                  <div className="grid items-center gap-6 md:grid-cols-[1fr_220px]">
                    <div>
                      <p
                        className={cn(
                          "inline-block rounded-full border-[1.5px] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]",
                          c.dark ? "border-paper bg-paper text-ink" : "border-ink bg-ink text-paper"
                        )}
                      >
                        {c.sticker}
                      </p>
                      <h3 className="font-display mt-4 max-w-xl text-3xl font-semibold leading-[1.02] tracking-tight sm:text-5xl">
                        {c.title}
                      </h3>
                      <p className={cn("mt-4 max-w-xl text-[14.5px] leading-relaxed sm:text-[16px]", c.dark ? "text-paper/70" : "text-ink2")}>
                        {c.desc}
                      </p>
                    </div>
                    <div className="hidden justify-center md:flex">
                      <div className="w-40 animate-floaty" style={{ animationDelay: `${i * 0.8}s` }}>
                        <Mascot body={c.dark ? "#f5f0e4" : i % 2 ? "#f04a1d" : "#ffc53d"} />
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-[13px] font-bold uppercase tracking-[0.2em] text-faint">
          ↓ keep scrolling — the plans are next ↓
        </p>
      </div>
    </section>
  );
}
