import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const outDir = process.argv[2] || "scratch-shots";
mkdirSync(outDir, { recursive: true });

const viewports = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 820, height: 1180 },
  desktop: { width: 1440, height: 900 },
};

const sections = ["topo", "marcas", "servicos", "por-que", "sobre", "certificacoes"];

const browser = await chromium.launch();
for (const [name, viewport] of Object.entries(viewports)) {
  const page = await browser.newPage({ viewport });
  await page.goto("http://localhost:5500", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  // Scroll the whole page once, in steps, so every IntersectionObserver-based
  // reveal (they're one-shot) has already fired before we screenshot anything.
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = Math.round(viewport.height * 0.8);
  for (let y = 0; y < pageHeight; y += step) {
    await page.evaluate((yPos) => window.scrollTo(0, yPos), y);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2600); // let the last reveals + counters settle
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  for (const id of sections) {
    const el = page.locator(`#${id}`);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await el.screenshot({ path: `${outDir}/${name}-${id}.png` });
  }

  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.locator("footer").screenshot({ path: `${outDir}/${name}-footer.png` });

  await page.close();
  console.log(`Captured ${name}`);
}
await browser.close();
