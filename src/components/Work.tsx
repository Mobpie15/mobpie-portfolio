import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHead } from "./ui";
import { StarDoodle } from "./Doodles";
import { PROJECTS } from "@/lib/data";

const META: Record<string, { type: string; stack: string; year: string }> = {
  "bloom-and-crumb": { type: "Bakery e-commerce", stack: "Next.js · Cart · Checkout · Tracking", year: "2026" },
  northwind: { type: "E-commerce", stack: "Next.js · Search · Checkout", year: "2026" },
  ora: { type: "3D apparel demo", stack: "WebGL studio · Travertine", year: "2025" },
};

export default function Work() {
  return (
    <section id="work" className="relative scroll-mt-20 border-t-[1.5px] border-ink/10 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          index="01"
          kicker="Selected work"
          doodle={<StarDoodle />}
          title={<>Real sites. Real links. <em className="font-display italic text-ember">Go click them.</em></>}
          blurb="No mockups, no Behance renders — every project below is a live deployment. Open them on your phone too."
        />

        <div className="overflow-hidden rounded-3xl border-[1.5px] border-ink">
          {PROJECTS.map((p, i) => {
            const m = META[p.slug];
            return (
              <Reveal key={p.slug} delay={0.04 * i} y={20}>
                <a
                  href={p.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group grid gap-5 bg-card p-5 transition-colors duration-300 hover:bg-ink hover:text-paper sm:p-8 lg:grid-cols-[80px_1fr_320px_180px] lg:items-center lg:gap-8 ${i > 0 ? "border-t-[1.5px] border-ink/15" : ""}`}
                >
                  <span className="font-display text-5xl font-semibold text-ink/15 transition-colors group-hover:text-paper/25 sm:text-6xl">
                    0{i + 1}
                  </span>
                  <span>
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/15 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-leaf">
                        <span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse-dot" /> Live
                      </span>
                      <span className="text-[11.5px] font-bold uppercase tracking-[0.14em] opacity-60">
                        {m.type} · {m.year}
                      </span>
                    </span>
                    <span className="mt-2 block font-display text-3xl font-semibold leading-none tracking-tight sm:text-4xl">
                      {p.title}
                    </span>
                    <span className="mt-2 block max-w-lg text-[13.5px] leading-relaxed opacity-70">{p.desc}</span>
                    <span className="mt-3 block text-[12px] font-bold uppercase tracking-[0.12em] opacity-50">
                      {m.stack}
                    </span>
                  </span>
                  <span className="overflow-hidden rounded-2xl border-[1.5px] border-ink/15">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.title}
                        width={640}
                        height={400}
                        sizes="(max-width: 1024px) 100vw, 320px"
                        loading="lazy"
                        className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105 group-hover:rotate-[0.5deg]"
                      />
                    ) : (
                      <span className="dotgrid flex aspect-[16/10] w-full flex-col justify-between bg-paper2 p-4">
                        <span className="flex gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-ink/30" />
                          <span className="h-2 w-2 rounded-full bg-ink/30" />
                          <span className="h-2 w-2 rounded-full bg-ember" />
                        </span>
                        <span className="text-2xl font-bold tracking-tight">
                          northwind<span className="text-ember">.</span>
                        </span>
                        <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] opacity-60">
                          50 products · search · checkout
                        </span>
                      </span>
                    )}
                  </span>
                  <span className="flex lg:justify-end">
                    <span className="sticker inline-flex h-12 items-center gap-1.5 rounded-full bg-ember px-5 text-[13px] font-bold text-white">
                      Launch <ArrowUpRight size={16} />
                    </span>
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
