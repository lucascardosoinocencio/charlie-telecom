import { readFileSync, writeFileSync } from "node:fs";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";

const [, , x0, y0, x1, y1, outName] = process.argv;
const src = "assents/foto-real1.jpeg";
const out = `assents/${outName || "badge-crop.png"}`;

const { width, height, data } = jpeg.decode(readFileSync(src), { useTArray: true });
const X0 = Number(x0), Y0 = Number(y0), X1 = Number(x1), Y1 = Number(y1);
const cropW = X1 - X0, cropH = Y1 - Y0;

const png = new PNG({ width: cropW, height: cropH });
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcIdx = ((y + Y0) * width + (x + X0)) * 4;
    const dstIdx = (y * cropW + x) * 4;
    png.data[dstIdx] = data[srcIdx];
    png.data[dstIdx + 1] = data[srcIdx + 1];
    png.data[dstIdx + 2] = data[srcIdx + 2];
    png.data[dstIdx + 3] = 255;
  }
}
writeFileSync(out, PNG.sync.write(png));
console.log(`Wrote ${out} (${cropW}x${cropH})`);
