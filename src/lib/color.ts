// Pure colour math used by the (deterministic) colour-theory engine.
// No randomness: every helper is a pure function of its hex input.

export type RGB = { r: number; g: number; b: number };
export type HSL = { h: number; s: number; l: number };

export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B);
  const l = (max + min) / 2;
  const d = max - min;
  let s = 0;
  let h = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case R: h = ((G - B) / d) % 6; break;
      case G: h = (B - R) / d + 2; break;
      default: h = (R - G) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, l };
}

/** Perceptual lightness 0..1 of a hex colour. */
export function lightness(hex: string): number {
  return rgbToHsl(hexToRgb(hex)).l;
}

/**
 * Warmth on a -1 (cool) .. +1 (warm) scale.
 * Peaks warm at orange (~45°) and cool at blue (~225°), scaled by chroma so
 * near-grey / near-black / near-white colours read as roughly neutral.
 */
export function warmth(hex: string): number {
  const { h, s, l } = rgbToHsl(hexToRgb(hex));
  const chroma = s * (1 - Math.abs(2 * l - 1));
  return Math.cos(((h - 45) * Math.PI) / 180) * chroma;
}

// A compact dictionary of fashion colour names with anchor hexes.
const NAMES: { name: string; rgb: RGB }[] = [
  ["terracotta", "#c66b3d"], ["rust", "#a6492b"], ["brick", "#8c3b2b"],
  ["camel", "#c19a6b"], ["gold", "#d4a537"], ["mustard", "#c9a227"],
  ["olive", "#6b7536"], ["sage", "#9caf88"], ["forest", "#2f4a33"],
  ["emerald", "#1e5c3a"], ["teal", "#1f6f6b"], ["cream", "#f5efe6"],
  ["ivory", "#f3e9d2"], ["chocolate", "#5a3a2e"], ["espresso", "#3a2a22"],
  ["burgundy", "#6e2230"], ["plum", "#5c3a5c"], ["mauve", "#9e7b8e"],
  ["blush", "#e6b7a9"], ["stone", "#b8ac9c"], ["navy", "#1e2a4a"],
  ["denim", "#3e5c76"], ["slate", "#50607a"], ["silver", "#c4c8cc"],
  ["ice blue", "#bcd4e6"], ["fuchsia", "#c2247f"], ["charcoal", "#2b2b2b"],
  ["black", "#0a0a0a"], ["white", "#ffffff"],
].map(([name, hex]) => ({ name, rgb: hexToRgb(hex) }));

/** Nearest named colour (Euclidean distance in RGB) — deterministic. */
export function nearestName(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  let best = NAMES[0];
  let bestD = Infinity;
  for (const c of NAMES) {
    const d = (c.rgb.r - r) ** 2 + (c.rgb.g - g) ** 2 + (c.rgb.b - b) ** 2;
    if (d < bestD) { bestD = d; best = c; }
  }
  return best.name;
}
