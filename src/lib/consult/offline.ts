/**
 * Canned but genuinely useful replies, used when Groq is unreachable or unconfigured.
 * The consultant should never look broken — it degrades into a helpful guide.
 */
export function offlineReply(input: string): string {
  const q = input.toLowerCase();

  if (/cost|price|budget|charge|rate|quote|how much|paisa/.test(q)) {
    return "There's no fixed price list — the quote gets agreed after a free chat, because it depends entirely on how many pages and features you actually need.\n\nWhat I can tell you is the shape of it:\n- Starter, 3-5 days: a sharp single-page presence\n- Flagship, 7-10 days: a full multi-page site with motion\n- 3D Atelier, 14-20 days: real 3D plus e-commerce and checkout\n\nTell me what your site needs to do and I'll point you at the right one.";
  }

  if (/instagram|social|facebook|why not|tiktok|youtube/.test(q)) {
    return "Social is good at reach and bad at explaining. A post scrolls away in a day, the text ends up buried under the app interface, and there's nowhere to put your full menu, your pricing, your work or your contact details in one place.\n\nA social profile brings people in. A website is what they land on and trust.";
  }

  if (/benefit|why do i need|trust|seo|google|more customer|what can|help my business|why.*website/.test(q)) {
    return "A few honest reasons:\n- You look findable and legitimate to someone who's never heard of you\n- Everything you offer sits in one place instead of scattered across posts\n- People reach you in one tap instead of hunting for a number\n- It shows up in Google and in AI answers, which social posts basically don't\n\nIt won't magically multiply your sales, but it makes it much easier for the right people to understand what you do and contact you.";
  }

  if (/type|which|what kind|kind of website|recommend|need.*website/.test(q)) {
    return "It depends on what the site has to do, and that's worth getting right before anything gets built.\n\nRoughly: a portfolio when the work is the proof, a business site when you need enquiries, an online store when you need to sell, a booking site when you need appointments, and a landing page when you need one thing done really well.\n\nTell me what you're building and I'll narrow it down.";
  }

  if (/^(hi|hello|hey|yo|namaste)\b/.test(q)) {
    return "Hey. Tell me what you're building and what you want the site to actually do — get customers, show your work, sell products, take bookings — and I'll tell you what kind of website fits.";
  }

  return "Let me be useful rather than clever.\n\nIf you tell me what you're building and what you want the site to do — get customers, show your work, sell products, take bookings — I'll tell you what kind of website fits and what it should contain.\n\nYou can also message Mobpie directly and you'll get a free demo site within 1-3 days.";
}
