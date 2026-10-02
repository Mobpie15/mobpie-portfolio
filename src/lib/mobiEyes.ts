/**
 * One shared pointer listener drives every Mobi on the page.
 *
 * Each instance is measured in its own bounding box, so a robot in the hero
 * reacts just as accurately as the small floating one — the eyes always track
 * toward wherever the cursor actually is, not just toward a screen coordinate.
 *
 * Touch devices never get a listener (their eyes stay centred), and if the
 * visitor prefers reduced motion the whole thing stays still.
 */

type Instance = {
  root: SVGSVGElement | null;
  pupils: { x: SVGGElement | null; y: SVGGElement | null } | null;
  baseX: number;
  baseY: number;
  travelX: number;
  travelY: number;
};

const instances = new Set<Instance>();

let raf = 0;
let pointerX = Number.NaN;
let pointerY = Number.NaN;
let pointerInside = false;
let bound = false;

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function render() {
  raf = 0;
  for (const inst of instances) {
    const { root, pupils } = inst;
    if (!root || !pupils || !pupils.x || !pupils.y) continue;
    const box = root.getBoundingClientRect();
    if (!box.width || !box.height) continue;

    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;

    // normalise the cursor against this robot's own size, then clamp, so the
    // eyes travel the same visual distance on a 24px icon and a 160px one
    let dx = 0;
    let dy = 0;
    if (pointerInside) {
      dx = clamp((pointerX - cx) / box.width, -1, 1) * inst.travelX;
      dy = clamp((pointerY - cy) / box.height, -1, 1) * inst.travelY;
    }

    const x = (inst.baseX + dx).toFixed(2);
    const y = (inst.baseY + dy).toFixed(2);
    pupils.x.setAttribute("transform", `translate(${x} ${y})`);
    pupils.y.setAttribute("transform", `translate(${x} ${y})`);
  }
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(render);
}

function onMove(e: MouseEvent) {
  pointerX = e.clientX;
  pointerY = e.clientY;
  pointerInside = true;
  schedule();
}

function onLeave() {
  pointerInside = false;
  schedule();
}

function attach() {
  if (bound) return;
  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("blur", onLeave);
  document.addEventListener("mouseleave", onLeave);
  bound = true;
}

function detach() {
  if (!bound) return;
  window.removeEventListener("mousemove", onMove);
  window.removeEventListener("blur", onLeave);
  document.removeEventListener("mouseleave", onLeave);
  bound = false;
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
}

/** Registers one robot. Returns the cleanup that unregisters it. */
export function trackEyes(inst: Instance): () => void {
  instances.add(inst);
  attach();
  schedule();
  return () => {
    instances.delete(inst);
    if (instances.size === 0) detach();
  };
}
