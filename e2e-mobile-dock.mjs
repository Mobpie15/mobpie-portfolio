import { chromium } from "playwright";

const problems = [];
const log = (...a) => console.log(...a);
const browser = await chromium.launch();

// A real phone: no hover, touch input. This is where the old design failed.
const phone = await browser.newContext({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});
const page = await phone.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error" && !/429|Too Many Requests/.test(m.text())) errs.push(m.text());
});

await page.goto("http://localhost:3002/", { waitUntil: "networkidle", timeout: 60000 });

// 1. nothing should be on screen yet (preloader runs ~1.7s)
const early = await page.locator("text=Need help figuring out").isVisible().catch(() => false);
log(`nudge visible immediately: ${early}`);
if (early) problems.push("nudge appeared before the preloader finished");

// the nudge shows 3.2s after ready and hides again after 6s, so poll for it
// instead of guessing a single moment
let nudgeShown = false;
for (let i = 0; i < 24 && !nudgeShown; i++) {
  await page.waitForTimeout(500);
  nudgeShown = await page
    .locator('[aria-label="Dismiss hint"]')
    .isVisible()
    .catch(() => false);
}
log(`AUTO-NUDGE appeared without interaction: ${nudgeShown}`);
if (!nudgeShown) problems.push("auto-nudge did not appear on mobile");

// 3. robot / back-to-top / WhatsApp must be one tidy column, no overlap
const robot = page.locator('button[aria-label="Ask Mobi what kind of website you need"]').last();
const top = page.locator('button[aria-label="Back to top"]');
const wa = page.locator('a[aria-label="Chat on WhatsApp"]');
await page.evaluate(() => window.scrollTo(0, 900));
await page.waitForTimeout(700);

const [rb, tb, wb] = await Promise.all([
  robot.boundingBox().catch(() => null),
  top.boundingBox().catch(() => null),
  wa.boundingBox().catch(() => null),
]);
log(`robot: ${JSON.stringify(rb)}\nbacktop: ${JSON.stringify(tb)}\nwa: ${JSON.stringify(wb)}`);

if (rb && wb) {
  if (rb.y + rb.height > wb.y) problems.push("robot overlaps WhatsApp button");
  log(`robot bottom -> wa top: ${Math.round(wb.y - (rb.y + rb.height))}px`);
  // robot -> back-to-top and back-to-top -> whatsapp are the two real gaps
  if (rb && tb) {
    const g1 = Math.round(tb.y - (rb.y + rb.height));
    log(`gap robot->backtop: ${g1}px`);
    if (g1 < 4 || g1 > 16) problems.push(`uneven gap robot->backtop = ${g1}px`);
  }
  if (tb) {
    const g2 = Math.round(wb.y - (tb.y + tb.height));
    log(`gap backtop->wa: ${g2}px`);
    if (g2 < 4 || g2 > 16) problems.push(`uneven gap backtop->wa = ${g2}px`);
  }
}
if (tb && wb && tb.y + tb.height > wb.y) problems.push("back-to-top overlaps WhatsApp");
if (rb && rb.x + rb.width > 390) problems.push("robot off-screen right");

if (rb && tb && wb) {
  const rights = [rb.x + rb.width, tb.x + tb.width, wb.x + wb.width].map((v) => Math.round(v));
  log(`right edges: ${JSON.stringify(rights)}`);
  const spread = Math.max(...rights) - Math.min(...rights);
  if (spread > 2) problems.push(`buttons not aligned, spread = ${spread}px`);
}

const sw = await page.evaluate(() => ({
  doc: document.documentElement.scrollWidth,
  win: window.innerWidth,
}));
if (sw.doc > sw.win + 1) problems.push(`horizontal scroll ${sw.doc} > ${sw.win}`);

await page.screenshot({ path: "e2e-shots/mobile-dock.png" });

// 6. tapping the robot opens the chat (touch, not hover)
await robot.tap();
await page.waitForTimeout(1100);
if (!(await page.locator('[role="dialog"]').isVisible()))
  problems.push("tapping the robot did not open the chat");
else log("tap on robot opened the chat");

// 7. after the chat closes, the nudge must NOT be stuck on screen
await page.locator('[role="dialog"] button[aria-label="Close chat"]').click().catch(() => {});
await page.waitForTimeout(1500);
const stillThere = await page
  .locator('[aria-label="Dismiss hint"]')
  .isVisible()
  .catch(() => false);
log(`nudge still visible after closing chat: ${stillThere}`);
if (stillThere) problems.push("nudge stuck on screen after chat closed");

await page.screenshot({ path: "e2e-shots/mobile-after-close.png" });

// 8. the nudge must come back on its own. Detect it by the dismiss button
// rather than a fixed sentence, because the wording rotates.
let cameBack = false;
const t0 = Date.now();
let wasGone = false;
while (Date.now() - t0 < 32000) {
  await page.waitForTimeout(400);
  const shown = await page
    .locator('[aria-label="Dismiss hint"]')
    .isVisible()
    .catch(() => false);
  if (!shown) wasGone = true;
  if (wasGone && shown) {
    cameBack = true;
    break;
  }
}
log(`nudge came back on its own: ${cameBack}`);
if (!cameBack) problems.push("nudge never came back on its own");

if (cameBack) {
  await page.locator('[aria-label="Dismiss hint"]').click({ force: true });
  log("dismissed with X");
}

const realErrs = errs.filter((e) => !/429|Too Many Requests/.test(e));
if (realErrs.length) problems.push(`page errors -> ${realErrs.slice(0, 2).join(" | ")}`);

await browser.close();
log("\n============ MOBILE RESULT =============");
problems.length ? problems.forEach((p) => log("FAIL: " + p)) : log("ALL MOBILE CHECKS PASSED");
log("=======================================");
