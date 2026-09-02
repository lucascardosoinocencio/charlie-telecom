import { readFileSync, writeFileSync } from "node:fs";
import { PNG } from "pngjs";

const [, , src, x0, y0, x1, y1, outName] = process.argv;
const png = PNG.sync.read(readFileSync(src));
const { width, height, data } = png;
const X0 = Number(x0), Y0 = Number(y0), X1 = Number(x1), Y1 = Number(y1);
const cropW = X1 - X0, cropH = Y1 - Y0;

const out = new PNG({ width: cropW, height: cropH });
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcIdx = ((y + Y0) * width + (x + X0)) * 4;
    const dstIdx = (y * cropW + x) * 4;
    out.data[dstIdx] = data[srcIdx];
    out.data[dstIdx + 1] = data[srcIdx + 1];
    out.data[dstIdx + 2] = data[srcIdx + 2];
    out.data[dstIdx + 3] = data[srcIdx + 3];
  }
}
writeFileSync(outName, PNG.sync.write(out));
console.log(`Wrote ${outName} (${cropW}x${cropH})`);
