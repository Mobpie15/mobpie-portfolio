import { Reveal, SectionHead } from "./ui";
import { Sparkle } from "./Doodles";
import { SKILLS } from "@/lib/data";

function Dots({ level }: { level: number }) {
  const full = Math.round(level / 20);
  return (
    <span className="flex gap-1" aria-label={`${level} percent`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-2.5 w-2.5 rounded-full border-[1.5px] border-ink ${i < full ? "bg-ember" : "bg-transparent"}`}
        />
      ))}
    </span>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative scroll-mt-20 border-t-[1.5px] border-ink/10 bg-paper2/50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          index="04"
          kicker="The arsenal"
          doodle={<Sparkle />}
          title={<>The exact stack behind <em className="font-display italic text-ember">sub-second</em> sites.</>}
          blurb="Sixteen tools, zero filler. Everything below is running in production on the live demos above."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SKILLS.map((g, gi) => (
            <Reveal key={g.group} delay={gi * 0.06}>
              <div className="card-lift h-full rounded-3xl border-[1.5px] border-ink bg-card p-6">
                <p className="flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.2em]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink font-display text-[13px] text-paper">
                    {gi + 1}
                  </span>
                  {g.group}
                </p>
                <ul className="mt-5 space-y-4">
                  {g.items.map((s) => (
                    <li key={s.name} className="flex items-center justify-between gap-3">
                      <span className="text-[13.5px] font-bold">{s.name}</span>
                      <Dots level={s.level} />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
