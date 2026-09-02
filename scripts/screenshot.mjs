import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const outDir = process.argv[2] || "scratch-shots";
mkdirSync(outDir, { recursive: true });

const viewports = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 820, height: 1180 },
  desktop: { width: 1440, height: 900 },
};

const browser = await chromium.launch();
for (const [name, viewport] of Object.entries(viewports)) {
  const page = await browser.newPage({ viewport });
  await page.goto("http://localhost:5500", { waitUntil: "networkidle" });
  await page.waitForTimeout(800); // let entrance animations settle
  await page.screenshot({ path: `${outDir}/${name}-top.png` });

  const height = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewportSize({ width: viewport.width, height });
  await page.waitForTimeout(1500); // let scroll-triggered reveals fire as layout expands
  await page.screenshot({ path: `${outDir}/${name}-full.png`, fullPage: true });

  await page.close();
  console.log(`Captured ${name}`);
}
await browser.close();
