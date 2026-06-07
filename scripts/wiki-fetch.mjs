// Replace specific catalog images using Wikimedia Commons (real, freely-licensed
// photographs). Picks the first JPEG search result of reasonable size per query.
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "catalog");
const UA = { "User-Agent": "TradeweaveDemo/0.1 (prototype; kdeeraj727@gmail.com)" };

// slug -> [search terms in priority order]
const JOBS = [
  ["bridal-lehenga", ["Lehenga", "Indian bride lehenga", "Ghagra choli"]],
  ["silk-kurta", ["Kurta men", "Kurta", "Sherwani"]],
  ["cotton-kurta-set", ["Kurta pajama", "Cotton kurta", "Indian man kurta"]],
  ["knit-sweater", ["Sweater", "Knitted pullover", "Woman sweater"]],
  ["linen-coord-set", ["Linen shirt", "Linen clothing", "Summer outfit woman"]],
  ["classic-white-shirt", ["Dress shirt", "White shirt man", "Formal shirt"]],
  ["festive-lehenga", ["Ghagra choli", "Lehenga dance", "Indian woman lehenga"]],
];

async function searchImage(term) {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search" +
    "&gsrnamespace=6&gsrlimit=10&gsrsearch=" +
    encodeURIComponent(term) +
    "&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=800";
  const r = await fetch(api, { headers: UA });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  const pages = j.query ? Object.values(j.query.pages) : [];
  // prefer real photos: jpeg, wide enough, not obviously a diagram/painting
  const candidates = pages
    .map((p) => p.imageinfo && p.imageinfo[0])
    .filter(Boolean)
    .filter((ii) => ii.mime === "image/jpeg" && (ii.width || 0) >= 600)
    .filter((ii) => !/draw|paint|sketch|map|diagram|logo|icon/i.test(ii.url));
  return candidates[0]?.thumburl || candidates[0]?.url || null;
}

async function download(url) {
  const r = await fetch(url, { headers: UA, redirect: "follow" });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 5000) throw new Error("too small");
  return buf;
}

for (const [slug, terms] of JOBS) {
  let done = false;
  for (const term of terms) {
    try {
      const url = await searchImage(term);
      if (!url) {
        console.log(`  …no result for "${term}"`);
        continue;
      }
      const buf = await download(url);
      await writeFile(join(OUT, `${slug}.jpg`), buf);
      console.log(`✓ ${slug}.jpg (${(buf.length / 1024) | 0}kb) <- "${term}"`);
      done = true;
      break;
    } catch (e) {
      console.log(`  …retry ${slug} "${term}": ${e.message}`);
    }
  }
  if (!done) console.log(`✗ ${slug} failed`);
}
console.log("wiki-fetch done");
