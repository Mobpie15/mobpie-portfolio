import type { Answers } from "./flows";

/**
 * Server-only structured knowledge about Mobpie, built on top of src/lib/data.ts
 * (the single source of truth). Never import this from a client component.
 */

export const WEBSITE_TYPES = [
  "Portfolio website — your best work, front and centre",
  "Business website — a real local business with services, trust and enquiries",
  "Service website — focused on one service, deep and persuasive",
  "Landing page — one page, one goal, built to convert",
  "E-commerce website — catalogue, cart, checkout, payments",
  "Restaurant website — menu, photos, location, table enquiries",
  "Personal brand website — you are the product",
  "Creator website — content hub, links, newsletter, sponsors",
  "Agency website — what you do, who you do it for, proof, contact",
  "Booking website — availability, appointments, reminders",
  "Product website — one product explained properly, with a way to buy or join",
  "SaaS / app landing page — the pitch, the proof, the signup",
  "Custom web application — when the site needs to actually do a job",
] as const;

export const SECTIONS_BY_INTENT: Record<string, string[]> = {
  portfolio: ["Hero", "Selected work", "About", "Testimonials", "Contact"],
  business: ["Hero", "Services", "About", "Proof / work", "Testimonials", "FAQ", "Contact"],
  service: ["Hero", "The service", "How it works", "Pricing", "Proof", "FAQ", "Contact"],
  landing: ["Hero", "Problem", "Solution", "Proof", "Offer", "Contact"],
  ecommerce: ["Hero", "Catalogue", "Product page", "Cart", "Checkout", "Shipping & returns", "Contact"],
  restaurant: ["Hero", "Menu", "Photos", "Reservations", "Location & hours", "Contact"],
  personal: ["Hero", "Who I am", "What I believe", "Work", "Writing / links", "Contact"],
  creator: ["Hero", "Latest content", "Platform links", "Newsletter", "Brand deals", "Contact"],
  agency: ["Hero", "Services", "Case studies", "Process", "Team", "Testimonials", "Contact"],
  booking: ["Hero", "Services", "Availability", "Booking form", "Confirmation", "Contact"],
  product: ["Hero", "The problem", "How it works", "Proof", "Pricing", "Signup", "FAQ"],
  saas: ["Hero", "Problem", "Solution", "Screens", "Pricing", "Testimonials", "Signup"],
  app: ["Hero", "What it does", "Screens", "How it works", "Pricing", "Signup", "Support"],
};

export const FEATURE_LIBRARY = [
  "Mobile-first build that feels native on a phone",
  "WhatsApp and call buttons that actually get tapped",
  "Contact form that reaches you instantly",
  "Google Maps so people can actually find you",
  "Photo gallery and real work samples",
  "Payments, cart and checkout",
  "Appointment booking with reminders",
  "Menu, catalogue or price list",
  "Fast loading and strong Core Web Vitals",
  "SEO so Google can find you",
  "AI-search readiness so assistants recommend you",


  "Basic protection against bots and spam",
  "Simple analytics so you know what works",
  "Easy to update yourself, no code needed",
] as const;

/**
 * The deterministic recommendation engine.
 * Mirrors the AI's decision so the consultant still works with no API key.
 */
export function recommend(answers: Answers) {
  const biz = answers.business ?? "";
  const goal = answers.goal ?? "";
  const feat = answers.features ?? "";
  const audience = answers.audience ?? "";
  const channel = answers.channel ?? "";

  const isStore = /store|product brand|ecommerce|retail brand/i.test(biz) || /buy|order/i.test(feat) || /sell products/i.test(goal);
  const isLocalBusiness = /local business|shop|clinic|salon|service|bakery|cafe|restaurant|diner|store front/i.test(biz);
  const isPortfolio = /freelancer|creator|personal/i.test(biz) || /portfolio|show my work/i.test(feat) || /showcase my work/i.test(goal);
  // "studio" only means an agency when it is not part of a local-business description.
  const isAgency = /agency|consultancy|creative studio|design studio/i.test(biz) || (/studio/i.test(biz) && !isLocalBusiness);
  const isEdu = /coaching|education|course|academy|tuition/i.test(biz);
  const isFood = /restaurant|cafe|food|diner|bakery|food business/i.test(biz);
  const isProduct = /saas|app|software|startup|product/i.test(biz);
  const wantsBooking = /book|appointment|pay online/i.test(feat);
  const wantsBrand = /brand/i.test(goal);

  let type = "Business website";
  let intent = "business";
  let why = "A clear online home that explains what you do and makes contacting you effortless.";

  if (isFood) {
    type = "Restaurant website";
    intent = "restaurant";
    why = "A menu, photos and a way to reserve or order — the three things guests look for first.";
  } else if (isStore) {
    type = "E-commerce website";
    intent = "ecommerce";
    why = "A proper shop where people can browse, add to cart and check out on their phone.";
  } else if (wantsBooking) {
    type = "Booking website";
    intent = "booking";
    why = "Let people see your availability and book or pay without a single phone call.";
  } else if (isAgency) {
    type = "Agency website";
    intent = "agency";
    why = "Show what you do, who you do it for, and the proof that makes an enquiry feel safe.";
  } else if (isPortfolio) {
    type = wantsBrand ? "Personal brand website" : "Portfolio website";
    intent = wantsBrand ? "personal" : "portfolio";
    why = "Put your best work and your point of view in one place you fully control.";
  } else if (isEdu) {
    type = wantsBooking ? "Booking website" : "Business website";
    intent = wantsBooking ? "booking" : "business";
    why = "Explain what you teach clearly, then make signing up or booking a two-tap action.";
  } else if (isProduct) {
    type = "Product landing page";
    intent = "saas";
    why = "Explain one thing very well and get people to sign up or start a trial.";
  }

  const sections = SECTIONS_BY_INTENT[intent] ?? SECTIONS_BY_INTENT.business;

  const features: string[] = ["Mobile-first build that feels native on a phone"];
  if (isStore) features.push("Cart and express checkout", "Product photos and clear pricing");
  else if (wantsBooking) features.push("Booking with automatic reminders");
  else features.push("WhatsApp and call buttons that actually get tapped", "Contact form that reaches you instantly");
  if (/local/i.test(audience) || /local/i.test(biz)) features.push("Google Maps so people can find you");
  features.push("Fast loading and strong Core Web Vitals");
  features.push("SEO basics so Google can find you");
  features.push("Simple analytics so you know what works");
  if (isStore || isAgency) features.push("Basic protection against bots and spam");

  const planHint =
    intent === "ecommerce"
      ? "3D Atelier"
      : intent === "business" || intent === "agency" || intent === "booking" || intent === "restaurant"
        ? "Flagship"
        : "Starter";

  const audienceLine = /worldwide|online/i.test(audience)
    ? "People finding you online, wherever they are"
    : /local/i.test(audience)
      ? "People in your area looking right now"
      : /both/i.test(audience)
        ? "Local customers and an online audience"
        : "Your customers, whoever they are";

  const channelLine = /instagram/i.test(channel)
    ? "You are already reaching people on Instagram — a site gives them somewhere real to go."
    : /whatsapp/i.test(channel)
      ? "WhatsApp closes the deal. A site does the explaining before they message you."
      : /google/i.test(channel)
        ? "Search brings ready customers — a fast, clear site is what keeps them."
        : /offline/i.test(channel)
          ? "Word of mouth is powerful. A site makes every referral land somewhere real."
          : "Starting fresh, a site gives you one home that works around the clock.";

  return {
    type,
    goal: goal || "Generate more customers and enquiries",
    audience: audienceLine,
    channelNote: channelLine,
    why,
    sections,
    features: features.slice(0, 7),
    planHint,
  };
}
