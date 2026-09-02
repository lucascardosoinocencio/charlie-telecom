import { readFileSync, writeFileSync } from "node:fs";
import { PNG } from "pngjs";

const [, , src, outName, padArg] = process.argv;
const pad = padArg ? Number(padArg) : 6;
const png = PNG.sync.read(readFileSync(src));
const { width, height, data } = png;

let minX = width, minY = height, maxX = 0, maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    if (data[idx + 3] > 8) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
minX = Math.max(0, minX - pad);
minY = Math.max(0, minY - pad);
maxX = Math.min(width - 1, maxX + pad);
maxY = Math.min(height - 1, maxY + pad);
const cropW = maxX - minX + 1;
const cropH = maxY - minY + 1;

const out = new PNG({ width: cropW, height: cropH });
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcIdx = ((y + minY) * width + (x + minX)) * 4;
    const dstIdx = (y * cropW + x) * 4;
    out.data[dstIdx] = data[srcIdx];
    out.data[dstIdx + 1] = data[srcIdx + 1];
    out.data[dstIdx + 2] = data[srcIdx + 2];
    out.data[dstIdx + 3] = data[srcIdx + 3];
  }
}
writeFileSync(outName, PNG.sync.write(out));
console.log(`Wrote ${outName} (${cropW}x${cropH})`);
