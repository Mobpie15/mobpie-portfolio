import { chromium } from "playwright";
import fs from "fs";

const OUT = "e2e-shots";
fs.mkdirSync(OUT, { recursive: true });

const SIZES = [
  { name: "320", w: 320, h: 720 },
  { name: "360", w: 360, h: 780 },
  { name: "1280", w: 1280, h: 800 },
];

const problems = [];
const log = (...a) => console.log(...a);
const browser = await chromium.launch();

for (const s of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errs.push(m.text());
  });

  await page.goto("http://localhost:3002/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(3400);

  // 1. no horizontal scroll
  const sw = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth,
    win: window.innerWidth,
  }));
  log(`[${s.name}] scrollWidth=${sw.doc} innerWidth=${sw.win}`);
  if (sw.doc > sw.win + 1) problems.push(`${s.name}: horizontal scroll ${sw.doc} > ${sw.win}`);

  // 2. colour theme + typography untouched
  const theme = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const cs = h1 ? getComputedStyle(h1) : null;
    return {
      bodyFont: getComputedStyle(document.body).fontFamily,
      h1Font: cs?.fontFamily ?? "",
      bg: getComputedStyle(document.body).backgroundColor,
      ink: cs?.color ?? "",
      display: getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim(),
      ember: getComputedStyle(document.documentElement).getPropertyValue("--color-ember").trim(),
    };
  });
  log(`[${s.name}] theme: ${JSON.stringify(theme)}`);
  if (!/Space Grotesk/i.test(theme.bodyFont)) problems.push(`${s.name}: body font changed`);
  if (!/Fraunces/i.test(theme.display)) problems.push(`${s.name}: display font changed`);
  if (theme.bg !== "rgb(245, 240, 228)") problems.push(`${s.name}: paper bg changed -> ${theme.bg}`);
  if (theme.ink !== "rgb(22, 19, 14)") problems.push(`${s.name}: ink changed -> ${theme.ink}`);
  if (theme.ember.trim() !== "#f04a1d") problems.push(`${s.name}: ember changed -> ${theme.ember}`);

  // 3. all 9 sections still present
  const ids = ["top", "work", "services", "why", "skills", "process", "pricing", "about", "contact"];
  const missing = [];
  for (const id of ids) {
    if (!(await page.evaluate((i) => !!document.getElementById(i), id))) missing.push(id);
  }
  if (missing.length) problems.push(`${s.name}: missing sections ${missing.join(",")}`);

  // 4. robot launcher visible and on screen
  const launcher = page.locator('button[aria-label="Ask Mobi what kind of website you need"]');
  if (!(await launcher.isVisible())) problems.push(`${s.name}: robot launcher not visible`);
  const lbox = await launcher.boundingBox();
  log(`[${s.name}] robot: ${JSON.stringify(lbox)}`);
  if (lbox && lbox.y + lbox.height > s.h + 2) problems.push(`${s.name}: robot below viewport`);

  // 5. robot must not cover the WhatsApp float
  const wa = page.locator('a[aria-label="Chat on WhatsApp"]');
  if (await wa.isVisible()) {
    const wbox = await wa.boundingBox();
    if (lbox && wbox) {
      const overlap =
        lbox.x < wbox.x + wbox.width &&
        lbox.x + lbox.width > wbox.x &&
        lbox.y < wbox.y + wbox.height &&
        lbox.y + lbox.height > wbox.y;
      log(`[${s.name}] robot/wa vertical gap: ${Math.round(wbox.y - (lbox.y + lbox.height))}px`);
      if (overlap) problems.push(`${s.name}: robot overlaps WhatsApp float`);
    }
  }

  await page.screenshot({ path: `${OUT}/landing-${s.name}.png` });

  // 6. open the consultant
  await launcher.click();
  await page.waitForTimeout(1000);
  const dialog = page.locator('[role="dialog"]');
  if (!(await dialog.isVisible())) {
    problems.push(`${s.name}: consultant did not open`);
  } else {
    const dbox = await dialog.boundingBox();
    log(`[${s.name}] panel: ${JSON.stringify(dbox)}`);
    if (dbox && dbox.width > s.w + 1) problems.push(`${s.name}: panel wider than viewport`);
    if (dbox && dbox.x < -1) problems.push(`${s.name}: panel off-screen`);
  }

  // 7. not an empty chat: intro + 4 starter chips
  const chipTexts = await page.locator("[role=dialog] .animate-chip-in").allInnerTexts();
  log(`[${s.name}] starter chips: ${JSON.stringify(chipTexts)}`);
  if (chipTexts.length < 4) problems.push(`${s.name}: expected 4 starter chips, got ${chipTexts.length}`);
  const body = await dialog.innerText();
  if (!/website consultant/i.test(body)) problems.push(`${s.name}: header missing`);
  if (!/tell me what you're building/i.test(body)) problems.push(`${s.name}: intro message missing`);

  await page.screenshot({ path: `${OUT}/panel-open-${s.name}.png` });

  // 8. walk the guided flow, always taking the first chip
  const steps = [];
  for (let i = 0; i < 6; i++) {
    const c = page.locator("[role=dialog] .animate-chip-in").first();
    if (!(await c.isVisible().catch(() => false))) break;
    steps.push((await c.innerText()).trim());
    await c.click();
    await page.waitForTimeout(2400);
  }
  log(`[${s.name}] flow steps: ${JSON.stringify(steps)}`);

  // 9. recommendation card appears
  const hasRec = await page
    .locator("[role=dialog]")
    .getByText("Your website plan")
    .first()
    .isVisible()
    .catch(() => false);
  log(`[${s.name}] recommendation shown: ${hasRec}`);
  if (!hasRec) problems.push(`${s.name}: recommendation card never appeared`);

  if (hasRec) {
    await page.screenshot({ path: `${OUT}/recommendation-${s.name}.png` });
    const recText = await dialog.innerText();
    if (/[₹$]\s?\d|\bINR\b|\d+\s?rupees/i.test(recText))
      problems.push(`${s.name}: price figure leaked into recommendation`);

    // 10. CTA -> contact form prefill
    await page.locator('[role="dialog"] button:has-text("Build something like this")').click();
    await page.waitForTimeout(2000);
    const details = await page.locator("#contact textarea").inputValue();
    const planTxt = await page.locator("#contact button.bg-ink").first().innerText();
    log(`[${s.name}] prefill len=${details.length} plan=${JSON.stringify(planTxt)}`);
    if (details.length < 40) problems.push(`${s.name}: contact details not prefilled`);
    if (!/looking for a/i.test(details)) problems.push(`${s.name}: prefill text missing`);
    await page.screenshot({ path: `${OUT}/contact-prefilled-${s.name}.png` });

    // 11. the existing WhatsApp submit must still work
    // (name and brand are `required` in the existing form, so fill them like a real visitor)
    await page.fill('#contact input[placeholder="Aarav Sharma"]', "Test Visitor");
    await page.fill('#contact input[placeholder="Aarav Clothing Co."]', "Test Brand");
    const [popup] = await Promise.all([
      ctx.waitForEvent("page", { timeout: 9000 }).catch(() => null),
      page.locator('#contact button:has-text("Send via WhatsApp")').click(),
    ]);
    if (popup) {
      const u = popup.url();
      log(`[${s.name}] wa ok: ${u.slice(0, 60)}...`);
      if (!/wa\.me|api\.whatsapp\.com/.test(u)) problems.push(`${s.name}: bad wa link`);
      // the message text is url-encoded into `text=`, so check the encoded word
      if (!/text=.*details/i.test(u)) problems.push(`${s.name}: wa link missing details`);
      await popup.close();
    } else {
      problems.push(`${s.name}: WhatsApp submit did not open a tab`);
    }
  }

  // 429 from our own rate limiter is expected during a fast automated run
  const realErrs = errs.filter((e) => !/429|Too Many Requests/.test(e));
  if (realErrs.length) problems.push(`${s.name}: page errors -> ${realErrs.slice(0, 3).join(" | ")}`);

  await ctx.close();
  log(`[${s.name}] part 2 done`);
}

await browser.close();
log("\n================ RESULT ================");
problems.length ? problems.forEach((p) => log("FAIL: " + p)) : log("ALL E2E CHECKS PASSED");
log("========================================");
