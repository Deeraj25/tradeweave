// One-off: replace specific catalog images that came back irrelevant.
// Uses broad, fashion-populated keywords that reliably return people in clothing.
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "catalog");
const UA = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) TradeweaveDemo/0.1" };

// slug -> [keyword, lock]; keywords chosen to be common on Flickr so they return clothing
const FIX = [
  ["silk-kurta", "menswear,model", 41],
  ["cotton-kurta-set", "mensfashion", 42],
  ["royal-sherwani", "wedding,suit", 43],
  ["knit-sweater", "sweater,woman", 44],
  ["bridal-lehenga", "bride,fashion", 45],
  ["denim-jacket", "denimjacket", 46],
  ["linen-coord-set", "summerfashion", 47],
];

async function get(url) {
  const r = await fetch(url, { redirect: "follow", headers: UA });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const ct = r.headers.get("content-type") || "";
  if (!ct.startsWith("image/")) throw new Error(`not image (${ct})`);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 4000) throw new Error(`too small`);
  return buf;
}

for (const [slug, keyword, lock] of FIX) {
  const sources = [
    `https://loremflickr.com/800/1000/${encodeURIComponent(keyword)}?lock=${lock}`,
    `https://loremflickr.com/800/1000/${encodeURIComponent(keyword.split(",")[0])}?lock=${lock + 100}`,
    `https://picsum.photos/seed/${slug}-${lock}/800/1000`,
  ];
  let done = false;
  for (const url of sources) {
    try {
      const buf = await get(url);
      await writeFile(join(OUT, `${slug}.jpg`), buf);
      console.log(`✓ ${slug}.jpg (${(buf.length / 1024) | 0}kb) <- ${url.split("?")[0]}`);
      done = true;
      break;
    } catch (e) {
      console.log(`  …retry ${slug}: ${e.message}`);
    }
  }
  if (!done) console.log(`✗ ${slug} failed`);
}
console.log("refetch done");
