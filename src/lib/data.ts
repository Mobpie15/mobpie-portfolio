export const WA_NUMBER = "918957420306";
export const WA_DISPLAY = "+91 89574 20306";
export const EMAIL = "mobpiexd@gmail.com";
export const INSTAGRAM = "mobpie_dev";
export const INSTAGRAM_URL = "https://instagram.com/mobpie_dev";

export const waLink = (text: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export const NAV = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export const SERVICES = [
  {
    n: "01",
    title: "Website Modernization",
    tag: "Cluttered to clean",
    desc: "Your slow, outdated site rebuilt from scratch into a sleek digital flagship — premium typography, clean layouts and aesthetics that justify luxury pricing.",
    points: ["Brand makeover", "High conversion", "Zero bloat"],
  },
  {
    n: "02",
    title: "Full-Stack Engineering",
    tag: "Frontend + backend",
    desc: "Complete end-to-end builds — world-class interfaces and 3D experiences plus secure APIs, resilient databases and headless CMS integrations.",
    points: ["Custom APIs", "Database & CMS", "3D experiences"],
  },
  {
    n: "03",
    title: "Speed Surgery",
    tag: "< 0.4s loads",
    desc: "Heavy scripts pruned, assets optimized, green Core Web Vitals. Sub-second first paint so mobile visitors never bounce.",
    points: ["99/100 vitals", "Sub-second FCP", "Zero bounce"],
  },
  {
    n: "04",
    title: "E-Commerce & Checkout",
    tag: "1-tap checkout",
    desc: "Frictionless stores with slideout carts, free-shipping bars, UPI intent and express checkout that cut cart abandonment.",
    points: ["Slideout cart", "Instant UPI", "Custom / Shopify"],
  },
  {
    n: "05",
    title: "SEO + AI-Search Ready",
    tag: "Google & AI suggest you",
    desc: "Every site ships SEO-friendly with structured data — plus AEO/GEO optimization so ChatGPT, Gemini and Google AI actually recommend your business.",
    points: ["Google ranking", "AI citations", "Schema setup"],
  },
  {
    n: "06",
    title: "Security & Protection",
    tag: "Bots blocked, data safe",
    desc: "Bot protection, rate limiting and a Cloudflare-secured data layer on every build — no spam, no scraping, no breached databases.",
    points: ["Bot protection", "Rate limits", "Cloudflare DB"],
  },
];

export const SKILLS: { group: string; items: { name: string; level: number }[] }[] = [
  {
    group: "Frontend",
    items: [
      { name: "Next.js / React", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 95 },
      { name: "Framer Motion / GSAP", level: 88 },
    ],
  },
  {
    group: "3D & Motion",
    items: [
      { name: "Three.js / WebGL", level: 85 },
      { name: "React Three Fiber", level: 88 },
      { name: "Scroll experiences", level: 92 },
      { name: "Lenis smooth scroll", level: 90 },
    ],
  },
  {
    group: "Backend",
    items: [
      { name: "Node.js APIs", level: 88 },
      { name: "REST / GraphQL", level: 85 },
      { name: "PostgreSQL / Prisma", level: 82 },
      { name: "Headless CMS", level: 86 },
    ],
  },
  {
    group: "Ship & Scale",
    items: [
      { name: "Vercel Edge Deploy", level: 94 },
      { name: "SEO + AEO/GEO", level: 90 },
      { name: "Core Web Vitals", level: 93 },
      { name: "Bot protection · WAF", level: 87 },
    ],
  },
];

export const PROJECTS = [
  {
    slug: "bloom-and-crumb",
    status: "Concept build",
    live: "https://bloom-and-crumb-demo.vercel.app",
    title: "Bloom & Crumb — Bakery Storefront",
    desc: "A fictional eggless-bakery storefront built as a portfolio concept: 24 products, category pages, cart, mock checkout with order confirmation, live order tracking and a WhatsApp-first order flow.",
    tags: ["Next.js", "24 products", "Cart + checkout"],
    image: "/images/bloom-and-crumb-preview.png",
  },
  {
    slug: "northwind",
    status: "Latest build",
    live: "https://northwind-demo-kb7spz3hh-mobpie.vercel.app",
    title: "Northwind — Minimal E-Commerce",
    desc: "A calm, minimal remake of the everything-store: 50 products, instant search, 3D-tilt galleries, slideout bag, full checkout and order tracking.",
    tags: ["Next.js", "50 products", "Full checkout"],
    image: null as string | null,
  },
  {
    slug: "ora",
    status: "Live 3D demo",
    live: "https://fashion-brand-dun.vercel.app",
    title: "Atelier Ora — 3D Apparel",
    desc: "Warm travertine flagship with a real-time 3D garment studio — 360° rotation, live fabric swatches and drape simulation.",
    tags: ["3D studio", "Travertine theme"],
    image: "/images/remake-fashion-preview.png",
  },
];

export const PROCESS = [
  { n: "01", title: "Book free", desc: "Share your website info on WhatsApp — no payment, no commitment. Just your goals, audience and references." },
  { n: "02", title: "Free demo", desc: "Within 1–3 days you get a working demo site. Like it? Pay only 40–50% advance. Don't like it? Walk away, zero cost." },
  { n: "03", title: "Milestone build", desc: "Design locked, then built in milestones — each stage approved by you before the next payment. Daily live preview links." },
  { n: "04", title: "Launch & Manage", desc: "Deployed on Vercel edge with analytics. Optional monthly management keeps it fast and secure forever." },
];

export const PLANS = [
  {
    name: "Starter",
    time: "3–5 days",
    desc: "A sharp single-page presence for new brands that need to look serious, fast.",
    features: ["Premium landing page", "Mobile-first build", "Contact + WhatsApp setup", "Basic SEO + analytics", "Launch on Vercel"],
    cta: "Start basic",
    featured: false,
  },
  {
    name: "Flagship",
    time: "7–10 days",
    desc: "A complete multi-page website with motion design that converts visitors into buyers.",
    features: ["Up to 8 custom pages", "Scroll animations + micro-interactions", "Blog / CMS integration", "99/100 vitals target", "1 month free support"],
    cta: "Start flagship",
    featured: true,
  },
  {
    name: "3D Atelier",
    time: "14–20 days",
    desc: "The full masterpiece — real-time 3D, WebGL scenes and e-commerce with express checkout.",
    features: ["Interactive 3D / WebGL", "E-commerce + 1-tap checkout", "Custom backend + APIs", "Headless CMS + training", "3 months priority support"],
    cta: "Start atelier",
    featured: false,
  },
];

export const TICKER = [
  "Next.js",
  "Three.js / WebGL",
  "Sub-0.4s loads",
  "1-tap checkout",
  "Framer Motion",
  "Headless CMS",
  "99/100 vitals",
  "SEO · AEO ready",
  "Bot protection",
  "Direct WhatsApp",
];
