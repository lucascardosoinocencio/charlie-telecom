import { readFileSync, writeFileSync } from "node:fs";
import { PNG } from "pngjs";

const [, , src, outName, x0, y0, x1, y1] = process.argv;
const png = PNG.sync.read(readFileSync(src));
const { width, height, data } = png;
const X0 = Number(x0), Y0 = Number(y0), X1 = Number(x1), Y1 = Number(y1);
const cropW = X1 - X0, cropH = Y1 - Y0;

const rough = new PNG({ width: cropW, height: cropH });
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcIdx = ((y + Y0) * width + (x + X0)) * 4;
    const dstIdx = (y * cropW + x) * 4;
    rough.data[dstIdx] = data[srcIdx];
    rough.data[dstIdx + 1] = data[srcIdx + 1];
    rough.data[dstIdx + 2] = data[srcIdx + 2];
    rough.data[dstIdx + 3] = 255;
  }
}

// Auto-trim tight to non-black content within the rough crop.
const threshold = 14;
const pad = 8;
let minX = cropW, minY = cropH, maxX = 0, maxY = 0;
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const idx = (y * cropW + x) * 4;
    const r = rough.data[idx], g = rough.data[idx + 1], b = rough.data[idx + 2];
    if (Math.max(r, g, b) > threshold) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
minX = Math.max(0, minX - pad);
minY = Math.max(0, minY - pad);
maxX = Math.min(cropW - 1, maxX + pad);
maxY = Math.min(cropH - 1, maxY + pad);
const tightW = maxX - minX + 1;
const tightH = maxY - minY + 1;

const out = new PNG({ width: tightW, height: tightH });
for (let y = 0; y < tightH; y++) {
  for (let x = 0; x < tightW; x++) {
    const srcIdx = ((y + minY) * cropW + (x + minX)) * 4;
    const dstIdx = (y * tightW + x) * 4;
    out.data[dstIdx] = rough.data[srcIdx];
    out.data[dstIdx + 1] = rough.data[srcIdx + 1];
    out.data[dstIdx + 2] = rough.data[srcIdx + 2];
    out.data[dstIdx + 3] = rough.data[srcIdx + 3];
  }
}
writeFileSync(outName, PNG.sync.write(out));
console.log(`Wrote ${outName} (${tightW}x${tightH})`);
