import { readFileSync, writeFileSync } from "node:fs";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";

const [, , src, outName] = process.argv;
const threshold = 235;
const pad = 10;

const { width, height, data } = jpeg.decode(readFileSync(src), { useTArray: true });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  if (r >= threshold && g >= threshold && b >= threshold) {
    data[i + 3] = 0;
  }
}

let minX = width, minY = height, maxX = 0, maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    if (data[idx + 3] !== 0) {
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

const png = new PNG({ width: cropW, height: cropH });
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcIdx = ((y + minY) * width + (x + minX)) * 4;
    const dstIdx = (y * cropW + x) * 4;
    png.data[dstIdx] = data[srcIdx];
    png.data[dstIdx + 1] = data[srcIdx + 1];
    png.data[dstIdx + 2] = data[srcIdx + 2];
    png.data[dstIdx + 3] = data[srcIdx + 3];
  }
}
writeFileSync(outName, PNG.sync.write(png));
console.log(`Wrote ${outName} (${cropW}x${cropH})`);
