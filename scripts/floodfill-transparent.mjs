import { readFileSync, writeFileSync } from "node:fs";
import { PNG } from "pngjs";

// Removes only the background by flood-filling from the image border across
// near-identical pixels, so it can safely handle a dark icon on a dark bg
// without eating into legitimately dark (but different) icon shading.
const [, , src, outName, thresholdArg] = process.argv;
const threshold = thresholdArg ? Number(thresholdArg) : 6;

const png = PNG.sync.read(readFileSync(src));
const { width, height, data } = png;

const visited = new Uint8Array(width * height);
const queue = [];

function seedAt(x, y) {
  const idx = y * width + x;
  if (visited[idx]) return;
  const i = idx * 4;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  if (Math.max(r, g, b) <= threshold) {
    visited[idx] = 1;
    queue.push(idx);
  }
}

for (let x = 0; x < width; x++) {
  seedAt(x, 0);
  seedAt(x, height - 1);
}
for (let y = 0; y < height; y++) {
  seedAt(0, y);
  seedAt(width - 1, y);
}

let head = 0;
while (head < queue.length) {
  const idx = queue[head++];
  const x = idx % width, y = (idx / width) | 0;
  const neighbors = [
    [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
  ];
  for (const [nx, ny] of neighbors) {
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
    const nIdx = ny * width + nx;
    if (visited[nIdx]) continue;
    const i = nIdx * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (Math.max(r, g, b) <= threshold) {
      visited[nIdx] = 1;
      queue.push(nIdx);
    }
  }
}

let removed = 0;
for (let idx = 0; idx < width * height; idx++) {
  if (visited[idx]) {
    data[idx * 4 + 3] = 0;
    removed++;
  }
}

writeFileSync(outName, PNG.sync.write(png));
console.log(`Wrote ${outName} (${width}x${height}), removed ${removed} bg pixels`);
