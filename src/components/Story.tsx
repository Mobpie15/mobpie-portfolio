import Mascot, { type MascotMood } from "./Mascot";
import { Reveal, SectionHead } from "./ui";
import { HeartDoodle } from "./Doodles";
import { cn } from "@/lib/utils";

function StoryMascotStage({
  index,
  body,
  mood,
  dark,
}: {
  index: number;
  body: string;
  mood: MascotMood;
  dark?: boolean;
}) {
  if (index === 0) {
    // 01 · Speed (<0.4s loads) -> Speed streaks + aerodynamic dash + lightning badge
    return (
      <div className="relative flex items-center justify-center">
        {/* Speed wind streaks */}
        <svg
          className="pointer-events-none absolute -left-7 top-1/2 -translate-y-1/2 h-20 w-28 text-ink/40"
          viewBox="0 0 100 60"
          fill="none"
        >
          <path
            d="M 5 14 L 75 14"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="16 12"
            className="animate-speed-dash"
          />
          <path
            d="M 14 30 L 92 30"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="22 14"
            className="animate-speed-dash"
            style={{ animationDelay: "0.2s" }}
          />
          <path
            d="M 2 46 L 70 46"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="14 10"
            className="animate-speed-dash"
            style={{ animationDelay: "0.4s" }}
          />
        </svg>

        {/* Mascot */}
        <div className="w-36 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:translate-x-2">
          <Mascot body={body} mood={mood} />
        </div>

        {/* Lightning Speed Badge */}
        <span className="absolute -top-3 -right-2 flex items-center gap-1 rounded-full border-[1.5px] border-ink bg-card px-2.5 py-1 text-[10.5px] font-bold text-ink shadow-[2px_2px_0_#16130e]">
          <span className="text-ember font-black">⚡</span> &lt;0.4s
        </span>
      </div>
    );
  }

  if (index === 1) {
    // 02 · Mobile-first -> Mascot alongside a mini smartphone with live touch pulse & wifi
    return (
      <div className="relative flex items-center justify-center gap-3">
        {/* Mascot looking at phone */}
        <div className="w-32 transition-transform duration-500 ease-out group-hover:scale-105">
          <Mascot body={body} mood={mood} />
        </div>

        {/* Mini Smartphone */}
        <div className="relative transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-3">
          {/* Signal waves */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-ember">
            <svg viewBox="0 0 24 16" className="w-5 h-3.5 fill-none stroke-current stroke-[2] animate-pulse">
              <path d="M 3 13 A 10 10 0 0 1 21 13" strokeLinecap="round" />
              <path d="M 7 14 A 5 5 0 0 1 17 14" strokeLinecap="round" />
            </svg>
          </div>

          <div className="relative h-28 w-16 rounded-[14px] border-[2px] border-ink bg-card p-1.5 shadow-[3px_3px_0_#16130e]">
            {/* phone speaker */}
            <div className="mx-auto h-1 w-4 rounded-full bg-ink/40 mb-1" />
            {/* screen */}
            <div className="flex h-[82px] flex-col justify-between rounded-[8px] border-[1px] border-ink/20 bg-paper p-1 overflow-hidden">
              <div className="h-6 w-full rounded bg-ember/25" />
              <div className="space-y-1">
                <div className="h-1.5 w-3/4 rounded bg-ink/30" />
                <div className="h-1.5 w-1/2 rounded bg-ink/20" />
              </div>
              {/* 52px thumb target button with touch ripple */}
              <div className="relative flex h-5 w-full items-center justify-center rounded bg-leaf text-[7.5px] font-bold text-white">
                <span>TAP</span>
                <span className="absolute inset-0 rounded bg-leaf animate-ping opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (index === 2) {
    // 03 · Direct line -> Floating WhatsApp speech bubble with typing indicator & online beacon
    return (
      <div className="relative flex items-center justify-center">
        {/* Floating WhatsApp typing bubble */}
        <div className="absolute -top-6 -right-3 z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
          <div className="flex items-center gap-1.5 rounded-2xl border-[1.5px] border-ink bg-leaf px-3 py-1.5 text-white shadow-[2px_2px_0_#16130e]">
            <span className="flex gap-1 items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "160ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "320ms" }} />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider ml-0.5">Online</span>
          </div>
          <span className="absolute -bottom-1 left-4 h-2 w-2 rotate-45 border-b-[1.5px] border-r-[1.5px] border-ink bg-leaf" />
        </div>

        {/* Mascot */}
        <div className="w-36 transition-transform duration-500 ease-out group-hover:scale-105">
          <Mascot body={body} mood={mood} />
        </div>

        {/* Direct line badge */}
        <span className="absolute -bottom-2 -left-2 flex items-center gap-1.5 rounded-full border-[1.5px] border-ink bg-card px-2.5 py-0.5 text-[10px] font-bold text-ink shadow-[2px_2px_0_#16130e]">
          <span className="h-2 w-2 rounded-full bg-leaf animate-pulse" />
          Direct Line
        </span>
      </div>
    );
  }

  // 04 · Ownership -> Golden key with sparkles & 100% yours badge
  return (
    <div className="relative flex items-center justify-center gap-3">
      {/* Mascot in happy mood on dark card */}
      <div className="w-32 transition-transform duration-500 ease-out group-hover:scale-105">
        <Mascot body={body} mood={mood} />
      </div>

      {/* Golden Key */}
      <div className="relative flex flex-col items-center animate-key-glow">
        <svg viewBox="0 0 40 70" className="w-10 h-auto filter drop-shadow-[0_0_10px_rgba(255,197,61,0.6)]">
          <circle cx="20" cy="18" r="14" fill="#ffc53d" stroke="#16130e" strokeWidth="2.5" />
          <circle cx="20" cy="18" r="5" fill="#16130e" />
          <rect x="17.5" y="30" width="5" height="34" rx="1.5" fill="#ffc53d" stroke="#16130e" strokeWidth="2.5" />
          <rect x="22.5" y="48" width="9" height="4" rx="1" fill="#ffc53d" stroke="#16130e" strokeWidth="2" />
          <rect x="22.5" y="56" width="7" height="4" rx="1" fill="#ffc53d" stroke="#16130e" strokeWidth="2" />
          <path d="M 6 30 Q 11 30 11 25 Q 11 30 16 30 Q 11 30 11 35 Q 11 30 6 30" fill="#fffdf7" className="animate-pulse" />
          <path d="M 28 8 Q 32 8 32 4 Q 32 8 36 8 Q 32 8 32 12 Q 32 8 28 8" fill="#ffc53d" className="animate-pulse" style={{ animationDelay: "0.5s" }} />
        </svg>

        <span className="mt-1 whitespace-nowrap rounded-full border-[1.5px] border-paper/40 bg-card/25 px-2.5 py-0.5 text-[10px] font-bold text-paper backdrop-blur-sm">
          100% Yours
        </span>
      </div>
    </div>
  );
}

const CARDS: {
  bg: string;
  sticker: string;
  title: string;
  desc: string;
  mood: MascotMood;
  dark?: boolean;
}[] = [
  {
    bg: "bg-sun",
    sticker: "01 · Speed",
    title: "0.4 seconds, or they bounce.",
    desc: "53% of mobile visitors leave if a page takes over 3 seconds. Mine load in under half a second — clean code, optimized assets, zero bloat. Speed isn't a feature, it's the whole game.",
    mood: "happy",
  },
  {
    bg: "bg-card",
    sticker: "02 · Mobile-first",
    title: "Your customers live on phones.",
    desc: "Every layout is designed thumb-first: 52px touch targets, readable type, checkout flows that work one-handed on a crowded train. Desktop gets the same love, automatically.",
    mood: "idle",
  },
  {
    bg: "bg-blush",
    sticker: "03 · Direct line",
    title: "You talk to ME. Nobody else.",
    desc: "No account managers, no juniors practicing on your budget. One WhatsApp chat with the person designing and writing every single line — direct answers, daily updates.",
    mood: "thinking",
  },
  {
    bg: "bg-ink",
    sticker: "04 · Ownership",
    title: "You own 100% of everything.",
    desc: "Complete source code, assets and repository — yours forever. No monthly traps, no hostage fees, no proprietary lock-in. If we part ways, your site keeps running.",
    mood: "happy",
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
                    "group overflow-hidden rounded-[1.75rem] border-[1.5px] border-ink p-6 sm:p-10 transition-shadow duration-300 hover:shadow-[6px_6px_0_#16130e]",
                    c.bg,
                    c.dark ? "text-paper" : "text-ink"
                  )}
                >
                  <div className="grid items-center gap-6 md:grid-cols-[1fr_240px]">
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
                      <div
                        className="animate-floaty"
                        style={{
                          animationDuration: "3.5s",
                          animationDelay: `${i * 0.7}s`,
                          "--fl-rot": `${i % 2 === 0 ? "2.5deg" : "-2.5deg"}`,
                        } as React.CSSProperties}
                      >
                        <StoryMascotStage
                          index={i}
                          body={c.dark ? "#f5f0e4" : i % 2 ? "#f04a1d" : "#ffc53d"}
                          mood={c.mood}
                          dark={c.dark}
                        />
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
