import { ArrowUpRight, Check } from "lucide-react";
import { Reveal, SectionHead } from "./ui";
import { StarDoodle } from "./Doodles";
import { PLANS, waLink } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Pricing() {
  return (
    <section id="pricing" className="relative scroll-mt-20 border-t-[1.5px] border-ink/10 bg-paper2/50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          index="06"
          kicker="Sprint plans"
          doodle={<StarDoodle />}
          title={<>Fixed timelines. Fixed quotes. <em className="font-display italic text-ember">Zero surprises.</em></>}
        />

        <div className="grid items-stretch gap-5 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.07} className="h-full">
              <article
                className={cn(
                  "card-lift relative flex h-full flex-col rounded-[1.75rem] border-[1.5px] p-7 sm:p-8",
                  p.featured ? "border-ink bg-ink text-paper" : "border-ink bg-card"
                )}
              >
                {p.featured && (
                  <span className="sticker absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-sun px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
                    ✳ Most popular
                  </span>
                )}
                <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-ember">{p.time}</p>
                <h3 className="font-display mt-2 text-3xl font-semibold">{p.name}</h3>
                <p className={cn("mt-2 text-[14px] leading-relaxed", p.featured ? "text-paper/70" : "text-ink2")}>{p.desc}</p>
                <ul className={cn("mt-6 flex-1 space-y-3 border-t-[1.5px] pt-6", p.featured ? "border-paper/15" : "border-ink/10")}>
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-[14px] font-medium">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf text-white">
                        <Check size={12} strokeWidth={4} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={waLink(`Hi Mobpie! I want the "${p.name}" plan (${p.time}) for my brand. Please share the quote.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "sticker mt-7 flex h-[52px] items-center justify-center gap-2 rounded-full text-[14px] font-bold",
                    p.featured ? "bg-ember text-white" : "bg-ink text-paper"
                  )}
                >
                  {p.cta} <ArrowUpRight size={16} />
                </a>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-xl text-center text-[14px] leading-relaxed text-ink2">
            Every plan starts with a free consultation and a free demo site — and ends with you owning 100% of the code.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
