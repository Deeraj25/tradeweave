// Downloads catalog images into public/catalog/.
// Primary source: LoremFlickr (real, CC-licensed Flickr photos by keyword, stable via ?lock).
// Fallback: Picsum (so the catalog always ends with a valid local image).
import { mkdir, writeFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "catalog");

// slug, keyword(s) for the photo tag, and a stable lock id for a distinct image
const CATALOG = [
  // Traditional Indian
  ["kanjeevaram-saree", "saree", 11],
  ["banarasi-saree", "saree,silk", 12],
  ["bridal-lehenga", "lehenga", 13],
  ["festive-lehenga", "lehenga,wedding", 14],
  ["anarkali-gown", "anarkali,gown", 15],
  ["salwar-kameez", "salwar,kameez", 16],
  ["silk-kurta", "kurta", 17],
  ["cotton-kurta-set", "kurta,cotton", 18],
  ["royal-sherwani", "sherwani,groom", 19],
  // Western / casual
  ["floral-summer-dress", "dress,floral", 20],
  ["evening-gown", "gown,evening", 21],
  ["denim-jacket", "denim,jacket", 22],
  ["classic-white-shirt", "shirt,fashion", 23],
  ["linen-coord-set", "linen,outfit", 24],
  ["knit-sweater", "sweater,knit", 25],
  ["tailored-blazer", "blazer,suit", 26],
];

const UA = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) TradeweaveDemo/0.1" };

async function tryFetch(url) {
  const r = await fetch(url, { redirect: "follow", headers: UA });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const ct = r.headers.get("content-type") || "";
  if (!ct.startsWith("image/")) throw new Error(`not an image (${ct})`);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 3000) throw new Error(`too small (${buf.length}b)`);
  return buf;
}

async function download(slug, keyword, lock) {
  const file = join(OUT, `${slug}.jpg`);
  try {
    await stat(file);
    console.log(`✓ ${slug}.jpg (exists, skip)`);
    return true;
  } catch { /* not present, download */ }

  const sources = [
    `https://loremflickr.com/800/1000/${encodeURIComponent(keyword)}?lock=${lock}`,
    `https://loremflickr.com/800/1000/${encodeURIComponent(keyword.split(",")[0])}?lock=${lock}`,
    `https://picsum.photos/seed/${slug}/800/1000`,
  ];
  for (const url of sources) {
    try {
      const buf = await tryFetch(url);
      await writeFile(file, buf);
      console.log(`✓ ${slug}.jpg  (${(buf.length / 1024) | 0}kb)  <- ${url.split("?")[0]}`);
      return true;
    } catch (e) {
      console.log(`  …retry ${slug}: ${e.message}`);
    }
  }
  console.log(`✗ ${slug}.jpg FAILED from all sources`);
  return false;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  let ok = 0;
  for (const [slug, keyword, lock] of CATALOG) {
    // sequential to be polite to the source
    // eslint-disable-next-line no-await-in-loop
    if (await download(slug, keyword, lock)) ok++;
  }
  console.log(`\nDone: ${ok}/${CATALOG.length} images in public/catalog/`);
  if (ok < CATALOG.length) process.exitCode = 1;
}

main();
