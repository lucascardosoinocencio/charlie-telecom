import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const iconPath = path.join(root, "assents", "logo-charlie-telecom-icon-dark.png");
const iconDataUri = `data:image/png;base64,${readFileSync(iconPath).toString("base64")}`;

const html = (size) => `<!doctype html>
<html><head><style>
  * { margin: 0; padding: 0; }
  html, body { width: ${size}px; height: ${size}px; background: #0a0b0d; }
  .wrap { width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; }
  img { width: ${size * 0.96}px; height: auto; }
</style></head>
<body><div class="wrap"><img src="${iconDataUri}" /></div></body></html>`;

const outDir = path.join(root, "assets", "img");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const targets = [
  { size: 16, file: "favicon-16.png" },
  { size: 32, file: "favicon-32.png" },
  { size: 48, file: "favicon-48.png" },
  { size: 180, file: "apple-touch-icon.png" },
  { size: 192, file: "icon-192.png" },
  { size: 512, file: "icon-512.png" },
];

for (const { size, file } of targets) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await page.setContent(html(size), { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, file) });
  await page.close();
  console.log("Saved", file);
}

await browser.close();
