import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHead } from "./ui";
import { Bolt } from "./Doodles";
import { SERVICES, waLink } from "@/lib/data";

export default function Services() {
  return (
    <section id="services" className="relative scroll-mt-20 border-t-[1.5px] border-ink/10 bg-paper2/50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          index="02"
          kicker="What I do"
          doodle={<Bolt />}
          title={<>Six ways I make you <em className="font-display italic text-ember">more money.</em></>}
        />

        <div>
          {SERVICES.map((s, i) => (
            <Reveal key={s.n} delay={0.03 * i} y={20}>
              <div className="group border-t-[1.5px] border-ink/15 py-7 transition-colors duration-300 last:border-b-[1.5px] hover:bg-ink hover:text-paper sm:py-8">
                <div className="grid gap-3 px-1 sm:px-4 lg:grid-cols-[90px_1fr_auto] lg:items-center lg:gap-8">
                  <span className="text-[13px] font-bold tracking-[0.2em] opacity-50">({s.n})</span>
                  <div>
                    <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-none">
                      {s.title} <span className="text-ember">↗</span>
                    </h3>
                    <p className="mt-2 max-w-2xl text-[14px] leading-relaxed opacity-70 sm:text-[15px]">{s.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {s.points.map((p) => (
                        <span key={p} className="rounded-full border-[1.5px] border-current px-3 py-1 text-[11.5px] font-bold opacity-80">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={waLink(`Hi Mobpie! I need "${s.title}" for my brand. Please share a quote.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sticker inline-flex h-12 w-fit items-center gap-1.5 rounded-full bg-sun px-5 text-[13px] font-bold text-ink"
                  >
                    Get quote <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
