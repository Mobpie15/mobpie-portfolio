/* Shared consultation flow definitions. Client-safe (no server imports). */

export type Chip = { id: string; label: string; value: string };

export const LEAD_KEY = "mobi:consult:lead";
export const CHAT_KEY = "mobi:consult:v1";
export const SEEN_KEY = "mobi:consult:seen";

/** Fired when the visitor accepts a recommendation, so the contact form can re-read it. */
export const LEAD_EVENT = "mobi:consult-lead";

/** The 4 starters shown when the panel first opens. */
export const STARTERS: { id: string; label: string; send: string }[] = [
  {
    id: "benefits",
    label: "What can a website do for me?",
    send: "What can a website actually do for my business?",
  },
  {
    id: "which",
    label: "Which website do I need?",
    send: "I want to figure out which kind of website I need.",
  },
  {
    id: "cost",
    label: "How much does a website usually cost?",
    send: "How much does a website usually cost?",
  },
  {
    id: "plan",
    label: "Help me plan my website",
    send: "Help me plan my website step by step.",
  },
];

/** The 5-step guided consultation. */
export const FLOW: Record<string, { key: string; ask: string; chips: Chip[] }> = {
  goal: {
    key: "goal",
    ask: "First things first — what are you trying to achieve with the website?",
    chips: [
      { id: "goal_customers", label: "Get more customers", value: "Generate more customers and enquiries" },
      { id: "goal_work", label: "Showcase my work", value: "Showcase my work and build credibility" },
      { id: "goal_sell", label: "Sell products", value: "Sell products or services online" },
      { id: "goal_brand", label: "Build my brand", value: "Build a stronger personal or company brand" },
      { id: "goal_unsure", label: "I'm not sure yet", value: "Not sure yet — need guidance" },
    ],
  },
  business: {
    key: "business",
    ask: "Got it. What kind of business or project is this?",
    chips: [
      { id: "biz_local", label: "Local business", value: "A local business — a shop, clinic, salon or service" },
      { id: "biz_store", label: "Online store", value: "An online store or product brand" },
      { id: "biz_freelance", label: "Freelancer / creator", value: "A freelancer, creator or personal brand" },
      { id: "biz_agency", label: "Agency / studio", value: "An agency, design studio or consultancy" },
      { id: "biz_edu", label: "Coaching / education", value: "Coaching, education or a course" },
      { id: "biz_other", label: "Something else", value: "Something else" },
    ],
  },
  channel: {
    key: "channel",
    ask: "Makes sense. What are you using to get customers today?",
    chips: [
      { id: "ch_instagram", label: "Instagram", value: "Mostly Instagram" },
      { id: "ch_wa", label: "WhatsApp", value: "Mostly WhatsApp" },
      { id: "ch_google", label: "Google", value: "Mostly Google search" },
      { id: "ch_offline", label: "Offline / referrals", value: "Offline word of mouth and referrals" },
      { id: "ch_none", label: "Nothing yet", value: "Nothing yet — starting fresh" },
    ],
  },
  audience: {
    key: "audience",
    ask: "Nearly there. Who exactly are you trying to reach?",
    chips: [
      { id: "aud_local", label: "People near me", value: "People in my local area" },
      { id: "aud_online", label: "Online / worldwide", value: "An online or worldwide audience" },
      { id: "aud_both", label: "Both", value: "Both local and online" },
      { id: "aud_unsure", label: "Not sure yet", value: "Not sure yet" },
    ],
  },
  features: {
    key: "features",
    ask: "Last one — what should the site actually let people do?",
    chips: [
      { id: "ft_enquiry", label: "Send me enquiries", value: "Send me enquiries" },
      { id: "ft_sell", label: "Buy something", value: "Buy or order something" },
      { id: "ft_book", label: "Book / pay online", value: "Book appointments or pay online" },
      { id: "ft_portfolio", label: "Show my work", value: "Show a portfolio of my work" },
      { id: "ft_premium", label: "Just look premium", value: "Mostly I just want it to look premium and credible" },
      { id: "ft_unsure", label: "Recommend for me", value: "Not sure — recommend what makes sense" },
    ],
  },
};

export const FLOW_ORDER = ["goal", "business", "channel", "audience", "features"] as const;

export type Answers = Partial<Record<string, string>>;

export function nextStep(answers: Answers): string | null {
  for (const k of FLOW_ORDER) if (!answers[k]) return k;
  return null;
}

export const EMPTY_CHIPS: Chip[] = [
  { id: "more", label: "Tell me more", value: "Tell me more" },
  { id: "types", label: "Show website types", value: "What types of websites are there?" },
  { id: "talk", label: "Talk to MobPie", value: "I would like to talk to MobPie" },
];

/**
 * Context-aware follow-ups. The bot is mid-conversation, so the useful next
 * question depends on what the visitor has already told us.
 */
export function followUps(answers: Answers): Chip[] {
  const out: Chip[] = [];

  if (answers.goal && !answers.business) {
    out.push(
      { id: "f_local", label: "A local shop or service", value: "A local business — a shop, clinic, salon or service" },
      { id: "f_store", label: "An online store", value: "An online store or product brand" },
      { id: "f_freelance", label: "Freelance / my work", value: "A freelancer, creator or personal brand" },
    );
  } else if (answers.business && !answers.features) {
    out.push(
      { id: "f_enquiry", label: "Get me enquiries", value: "Send me enquiries" },
      { id: "f_sell", label: "Sell something", value: "Buy or order something" },
      { id: "f_book", label: "Bookings / payments", value: "Book appointments or pay online" },
      { id: "f_premium", label: "Just look premium", value: "Mostly I just want it to look premium and credible" },
    );
  } else if (answers.features && !answers.audience) {
    out.push(
      { id: "f_localaud", label: "People near me", value: "People in my local area" },
      { id: "f_onlineaud", label: "Online / worldwide", value: "An online or worldwide audience" },
    );
  } else if (answers.audience) {
    out.push(
      { id: "f_plan", label: "Which plan fits?", value: "Which of your sprint plans would fit this best?" },
      { id: "f_timeline", label: "How long will it take?", value: "How long would a project like this take?" },
      { id: "f_demo", label: "Can I get a free demo?", value: "Can I get a free demo site first?" },
    );
  } else {
    out.push(...EMPTY_CHIPS);
  }

  out.push({ id: "f_talk", label: "Talk to MobPie", value: "I would like to talk to MobPie" });
  return out;
}
