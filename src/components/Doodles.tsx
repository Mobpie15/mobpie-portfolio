import { cn } from "@/lib/utils";

type P = { className?: string };

function Base({ className, children, view = "0 0 100 100" }: P & { children: React.ReactNode; view?: string }) {
  return (
    <svg
      viewBox={view}
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-auto", className)}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** four-point sparkle */
export function Sparkle({ className }: P) {
  return (
    <Base className={className}>
      <path d="M50 8 C53 32 66 44 92 50 C66 56 53 68 50 92 C47 68 34 56 8 50 C34 44 47 32 50 8 Z" fill="currentColor" stroke="none" />
    </Base>
  );
}

/** chunky five-point star */
export function StarDoodle({ className }: P) {
  return (
    <Base className={className}>
      <path d="M50 10 L61 38 L90 38 L67 55 L75 84 L50 66 L25 84 L33 55 L10 38 L39 38 Z" />
    </Base>
  );
}

/** curved arrow pointing down-right */
export function CurlyArrow({ className, flip }: P & { flip?: boolean }) {
  return (
    <Base className={cn(flip && "-scale-x-100", className)} view="0 0 120 90">
      <path d="M10 12 C 45 15, 85 25, 92 68" />
      <path d="M76 56 L93 70 L78 84" />
    </Base>
  );
}

/** hand-drawn underline squiggle */
export function Squiggle({ className }: P) {
  return (
    <Base className={className} view="0 0 220 24">
      <path d="M6 14 C 40 6, 70 20, 104 12 S 170 6, 214 14" />
    </Base>
  );
}

/** scribble circle (open, energetic) */
export function Scribble({ className }: P) {
  return (
    <Base className={className} view="0 0 120 100">
      <path d="M102 46 C100 20 66 6 40 14 C16 21 8 48 18 68 C28 88 60 96 84 84 C96 78 102 66 100 54" />
    </Base>
  );
}

/** chunky plus */
export function PlusDoodle({ className }: P) {
  return (
    <Base className={className}>
      <path d="M50 14 L50 86 M14 50 L86 50" />
    </Base>
  );
}

/** lightning bolt */
export function Bolt({ className }: P) {
  return (
    <Base className={className}>
      <path d="M58 8 L26 56 L48 56 L42 92 L74 42 L52 42 Z" />
    </Base>
  );
}

/** small heart */
export function HeartDoodle({ className }: P) {
  return (
    <Base className={className}>
      <path d="M50 82 C30 64 14 50 14 34 C14 22 23 14 33 14 C41 14 47 19 50 25 C53 19 59 14 67 14 C77 14 86 22 86 34 C86 50 70 64 50 82 Z" />
    </Base>
  );
}

/** smiley face */
export function Smile({ className }: P) {
  return (
    <Base className={className}>
      <circle cx="50" cy="50" r="38" />
      <circle cx="38" cy="42" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="62" cy="42" r="2.5" fill="currentColor" stroke="none" />
      <path d="M34 60 Q50 74 66 60" />
    </Base>
  );
}
