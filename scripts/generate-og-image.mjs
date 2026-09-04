import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const iconPath = path.join(root, "assents", "logo-charlie-telecom-icon-transparent.png");
const iconDataUri = `data:image/png;base64,${readFileSync(iconPath).toString("base64")}`;

let html = readFileSync(path.join(root, "scripts", "og-image-template.html"), "utf8");
html = html.replace("ICON_SRC", iconDataUri);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.waitForTimeout(300);

const outDir = path.join(root, "assets", "img");
mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "og-image.jpg");
await page.screenshot({ path: outPath, type: "jpeg", quality: 88 });

await browser.close();
console.log("Saved", outPath);
