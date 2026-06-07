// Builds a single, self-contained aura.html: reads aura.template.html and
// inlines every image in public/catalog/ as a base64 data URI. The output
// needs no build step and no server — open it directly in a browser.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = join(root, "public", "catalog");

const images = {};
for (const file of readdirSync(catalog)) {
  const m = /\.(jpe?g|png|webp)$/i.exec(file);
  if (!m) continue;
  const id = file.replace(/\.[^.]+$/, "");
  const mime = /png/i.test(m[1]) ? "image/png" : /webp/i.test(m[1]) ? "image/webp" : "image/jpeg";
  const b64 = readFileSync(join(catalog, file)).toString("base64");
  images[id] = `data:${mime};base64,${b64}`;
}

const template = readFileSync(join(root, "aura.template.html"), "utf8");
const out = template.replace("/*__IMAGES_JSON__*/null", JSON.stringify(images));

writeFileSync(join(root, "aura.html"), out);
console.log(`wrote aura.html — ${(out.length / 1e6).toFixed(2)} MB, ${Object.keys(images).length} images inlined`);
