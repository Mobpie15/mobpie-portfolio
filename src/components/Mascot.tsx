"use client";

import { useEffect, useRef } from "react";
import { trackEyes } from "@/lib/mobiEyes";
import { cn } from "@/lib/utils";

export type MascotMood = "idle" | "thinking" | "happy";

/** A framed, slightly larger Mobi for the chat header — reads better at 36px than the bare robot. */
export function MobiAvatar({ mood = "idle", className }: { mood?: MascotMood; className?: string }) {
  return (
    <span
      className={cn(
        "relative flex items-center justify-center rounded-full border-[1.5px] border-ink bg-sun",
        className,
      )}
    >
      <Mascot mood={mood} className="h-[78%] w-[78%]" />
      {mood === "thinking" && (
        <span className="absolute -right-0.5 -top-0.5 flex gap-[2px] rounded-full border-[1.5px] border-ink bg-card px-1 py-[3px]">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="animate-dot-bounce h-1 w-1 rounded-full bg-ink"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </span>
      )}
      {mood === "idle" && (
        <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-[1.5px] border-ink bg-leaf" />
      )}
    </span>
  );
}

/**
 * Mobi — the studio mascot, and the face of the website consultant.
 * Pure SVG, zero dependencies, mobile-safe (static pose on touch).
 *
 * Every prop is optional: with no props passed this renders exactly what it
 * always has, so existing call sites (Hero, Preloader, Footer, About, Story)
 * are unaffected.
 */
export default function Mascot({
  className,
  body = "#ffc53d",
  mood = "idle",
  onClick,
  peek = false,
  title,
}: {
  className?: string;
  body?: string;
  mood?: MascotMood;
  onClick?: () => void;
  peek?: boolean;
  title?: string;
}) {
  const pupilL = useRef<SVGGElement>(null);
  const pupilR = useRef<SVGGElement>(null);
  const rootRef = useRef<SVGSVGElement>(null);

  // While thinking, Mobi looks up and away and stops following the cursor.
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const thinking = mood === "thinking";
    return trackEyes({
      root: rootRef.current,
      pupils: { x: pupilL.current, y: pupilR.current },
      baseX: thinking ? -3 : 0,
      baseY: thinking ? -3 : 0,
      travelX: thinking ? 0 : 4.6,
      travelY: thinking ? 0 : 3.4,
    });
  }, [mood]);

  const art = (
    <svg
      ref={rootRef}
      viewBox="0 0 120 132"
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label={title ?? "Mobi, the studio mascot"}
    >
      {/* antenna */}
      <g className="origin-[60px_34px] transition-transform duration-300 group-hover:rotate-6">
        <line x1="60" y1="18" x2="60" y2="34" stroke="#16130e" strokeWidth="5" strokeLinecap="round" />
        <circle cx="60" cy="13" r="7" fill="#f04a1d" stroke="#16130e" strokeWidth="3.5">
          {mood === "thinking" && (
            <animate attributeName="opacity" values="1;0.35;1" dur="1.1s" repeatCount="indefinite" />
          )}
        </circle>
      </g>
      {/* body */}
      <rect x="14" y="32" width="92" height="88" rx="30" fill={body} stroke="#16130e" strokeWidth="4" />
      {/* cheek blush */}
      <ellipse cx="32" cy="82" rx="8" ry="5" fill="#f04a1d" opacity="0.35" />
      <ellipse cx="88" cy="82" rx="8" ry="5" fill="#f04a1d" opacity="0.35" />

      {/* thinking dots */}
      {mood === "thinking" && (
        <g fill="#16130e">
          <circle cx="96" cy="44" r="2.6">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="104" cy="36" r="2.6">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" begin="0.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="110" cy="26" r="2.6">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* eyes */}
      {mood === "happy" ? (
        <g stroke="#16130e" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M36 70 Q43 61 50 70" />
          <path d="M70 70 Q77 61 84 70" />
        </g>
      ) : (
        <g className="animate-blink">
          {/* whites stay put; only the pupils travel, which reads far more
              naturally than sliding the whole eye around */}
          <ellipse cx="43" cy="68" rx="10" ry="12" fill="#fffdf7" stroke="#16130e" strokeWidth="3.5" />
          <g ref={pupilL}>
            <circle cx="45" cy="70" r="4.5" fill="#16130e" />
            <circle cx="46.5" cy="68.5" r="1.5" fill="#fffdf7" />
          </g>
          <ellipse cx="77" cy="68" rx="10" ry="12" fill="#fffdf7" stroke="#16130e" strokeWidth="3.5" />
          <g ref={pupilR}>
            <circle cx="79" cy="70" r="4.5" fill="#16130e" />
            <circle cx="80.5" cy="68.5" r="1.5" fill="#fffdf7" />
          </g>
        </g>
      )}

      {/* mouth */}
      {mood === "thinking" ? (
        <ellipse cx="60" cy="95" rx="5" ry="6.5" fill="none" stroke="#16130e" strokeWidth="3.5" />
      ) : mood === "happy" ? (
        <path d="M42 90 Q60 108 78 90 Z" fill="#16130e" />
      ) : (
        <path d="M48 92 Q60 102 72 92" fill="none" stroke="#16130e" strokeWidth="4" strokeLinecap="round" />
      )}

      {/* feet */}
      <ellipse cx="42" cy="122" rx="12" ry="6" fill="#16130e" />
      <ellipse cx="78" cy="122" rx="12" ry="6" fill="#16130e" />
    </svg>
  );

  if (!onClick) return art;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={title ?? "Open Mobi, the website consultant"}
      className={cn(
        "block rounded-full transition-transform duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember",
        peek && "animate-robot-peek",
      )}
    >
      {art}
    </button>
  );
}


/** Rotating circular text badge */
export function OrbitBadge({ text, className }: { text: string; className?: string }) {
  const words = `${text} · ${text} · `;
  return (
    <div className={cn("relative h-28 w-28 sm:h-32 sm:w-32", className)}>
      <svg viewBox="0 0 100 100" className="animate-spin-slower h-full w-full">
        <defs>
          <path id="orbit-circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-ink text-[10.5px] font-bold uppercase" style={{ letterSpacing: "2.5px" }}>
          <textPath href="#orbit-circle">{words}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ember text-xl font-bold text-white">
          ↗
        </span>
      </span>
    </div>
  );
}
