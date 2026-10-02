"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, AtSign, Mail, MessageCircle, Send } from "lucide-react";
import { Reveal, SectionHead } from "./ui";
import { CurlyArrow, Squiggle } from "./Doodles";
import { EMAIL, INSTAGRAM, INSTAGRAM_URL, PLANS, WA_DISPLAY, waLink } from "@/lib/data";
import { readLead } from "@/lib/consult/session";
import { LEAD_EVENT } from "@/lib/consult/flows";

export default function Contact() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [plan, setPlan] = useState(PLANS[1].name);
  const [details, setDetails] = useState("");
  const [fromBot, setFromBot] = useState<string | null>(null);

  // The consultation runs after this section has already mounted, so the form
  // cannot rely on a mount effect. It re-reads whenever the consultant hands
  // over a plan. The form logic itself is untouched.
  useEffect(() => {
    const apply = () => {
      const lead = readLead();
      if (!lead) return;
      setFromBot(lead.type);
      if (PLANS.some((p) => p.name === lead.planHint)) setPlan(lead.planHint);
      setDetails(
        [
          `I'm looking for a ${lead.type.toLowerCase()}.`,
          `Goal: ${lead.goal}`,
          `Audience: ${lead.audience}`,
          `Sections I'd want: ${lead.sections.join(", ")}`,
          `Features I'd want: ${lead.features.join(", ")}`,
        ].join("\n"),
      );
    };

    // covers a reload with a saved plan, and the hand-off fired before mount
    const t = setTimeout(apply, 0);
    window.addEventListener(LEAD_EVENT, apply);
    return () => {
      clearTimeout(t);
      window.removeEventListener(LEAD_EVENT, apply);
    };
  }, []);

  const message = `Hi Mobpie! I'm ${name || "[name]"} from ${brand || "[brand]"}. Plan: ${plan}. Details: ${details || "—"}`;
  const input =
    "h-12 w-full rounded-xl border-[1.5px] border-ink/20 bg-paper px-4 text-[14px] font-medium text-ink outline-none transition-colors placeholder:font-normal placeholder:text-faint focus:border-ember";

  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden border-t-[1.5px] border-ink/10 py-20 sm:py-28">
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          index="09"
          kicker="Get in touch"
          doodle={<CurlyArrow className="w-10" />}
          title={<>Let&apos;s build something <em className="font-display italic text-ember">meaningful.↗</em></>}
          blurb="No advance needed — just share your info below and get a free demo site in 1–3 days."
        />

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <Reveal>
              <div className="relative overflow-hidden rounded-[1.75rem] border-[1.5px] border-ink">
                <Image
                  src="/images/mobpie-avatar.jpg"
                  alt="Contact Mobpie directly"
                  width={800}
                  height={600}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover object-top"
                />
                <span className="sticker absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-card px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse-dot" /> Free demo in 1–3 days
                </span>
              </div>
            </Reveal>
            <div className="mt-4 space-y-3">
              {[
                { icon: MessageCircle, label: "WhatsApp & call", value: WA_DISPLAY, href: waLink("Hi Mobpie! I want to discuss a website project with you.") },
                { icon: Mail, label: "Direct email", value: EMAIL, href: `mailto:${EMAIL}?subject=Website%20Commission%20Inquiry` },
                { icon: AtSign, label: "Instagram", value: `@${INSTAGRAM}`, href: INSTAGRAM_URL },
              ].map((c, i) => (
                <Reveal key={c.label} delay={0.05 * i}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-2xl border-[1.5px] border-ink bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#16130e]"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-colors group-hover:bg-ember">
                      <c.icon size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10.5px] font-bold uppercase tracking-[0.18em] text-faint">{c.label}</span>
                      <span className="block truncate text-[16px] font-bold sm:text-lg">{c.value}</span>
                    </span>
                    <ArrowUpRight size={18} className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-ember" />
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.08}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.open(waLink(message), "_blank");
              }}
              className="flex h-full flex-col rounded-[1.75rem] border-[1.5px] border-ink bg-card p-6 sm:p-8"
            >
              <h3 className="font-display text-2xl font-semibold">Send a project inquiry ✳</h3>
              <Squiggle className="mt-1 w-44 text-ember" />
              {fromBot && (
                <p className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border-[1.5px] border-ember bg-blush px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                  Filled in from your Mobi chat
                </p>
              )}
              <p className="mt-1.5 text-[13.5px] text-ink2">
                Fill this in — it opens WhatsApp with everything pre-written. No spam, ever.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-ink2">
                  Your name
                  <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Aarav Sharma" className={`${input} mt-2`} />
                </label>
                <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-ink2">
                  Brand / business
                  <input value={brand} onChange={(e) => setBrand(e.target.value)} required placeholder="Aarav Clothing Co." className={`${input} mt-2`} />
                </label>
              </div>
              <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-ink2">
                Sprint plan
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {PLANS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setPlan(p.name)}
                      className={`rounded-xl border-[1.5px] px-2 py-3 text-center transition-all ${
                        plan === p.name ? "border-ink bg-ink text-paper" : "border-ink/20 text-ink2 hover:border-ink"
                      }`}
                    >
                      <span className="block text-[13px] font-bold">{p.name}</span>
                      <span className="block text-[11px] opacity-70">{p.time}</span>
                    </button>
                  ))}
                </div>
              </div>
              <label className="mt-4 block flex-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink2">
                Project details
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                  placeholder="I need a premium website for my fashion brand with online ordering…"
                  className="mt-2 min-h-[104px] w-full resize-none rounded-xl border-[1.5px] border-ink/20 bg-paper px-4 py-3 text-[14px] font-medium normal-case tracking-normal text-ink outline-none transition-colors placeholder:font-normal placeholder:text-faint focus:border-ember"
                />
              </label>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="submit"
                  className="sticker flex h-[52px] flex-[1.4] items-center justify-center gap-2 rounded-full bg-leaf text-[14px] font-bold text-white"
                >
                  <Send size={16} /> Send via WhatsApp
                </button>
                <a
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Project inquiry from ${name || "website visitor"}`)}&body=${encodeURIComponent(message)}`}
                  className="sticker flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-ink text-[14px] font-bold text-paper"
                >
                  <Mail size={16} /> Email instead
                </a>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
