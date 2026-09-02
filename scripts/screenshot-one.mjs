import { chromium } from "playwright";

const [, , selector, outPath, width = 1440, height = 900] = process.argv;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(height) } });
await page.goto("http://localhost:5500", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const el = page.locator(selector);
await el.scrollIntoViewIfNeeded();
await page.waitForTimeout(2600);
await el.screenshot({ path: outPath });
await browser.close();
console.log(`Saved ${outPath}`);
