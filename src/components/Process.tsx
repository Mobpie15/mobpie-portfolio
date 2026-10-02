import { Reveal, SectionHead } from "./ui";
import { CurlyArrow } from "./Doodles";
import { PROCESS } from "@/lib/data";

export default function Process() {
  return (
    <section id="process" className="relative scroll-mt-20 border-t-[1.5px] border-ink/10 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          index="05"
          kicker="How we work"
          doodle={<CurlyArrow className="w-10" />}
          title={<>First message to launch in <em className="font-display italic text-ember">four steps.</em></>}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div className="card-lift group relative h-full overflow-hidden rounded-3xl border-[1.5px] border-ink bg-card p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="font-display text-5xl font-semibold text-ink/10 transition-colors group-hover:text-ember/25">
                    {s.n}
                  </span>
                  <span className="text-2xl font-bold text-ember">{i < 3 ? "→" : "✳"}</span>
                </div>
                <h3 className="font-display mt-4 text-2xl font-semibold">{s.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink2">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
