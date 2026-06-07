// The user's style profile. In production this is produced by the onboarding
// face/wardrobe analysis; here it's a fixed mock that drives all personalisation.

export type Season = "Warm Autumn" | "Soft Summer" | "Bright Winter" | "Light Spring";
export type Undertone = "warm" | "cool" | "neutral";
export type Contrast = "low" | "medium" | "high";

export type StyleProfile = {
  name: string;
  initials: string;
  season: Season;
  undertone: Undertone;
  /** Personal contrast between hair / skin / eyes. */
  contrast: Contrast;
  faceShape: "oval" | "round" | "square" | "heart" | "oblong";
  hair: string;
  skin: string;
  /** Colour names the user loves / avoids (matched against swatch names). */
  loved: string[];
  avoided: string[];
  /** Engine targets derived from the season (see colorTheory). */
  targetWarmth: number;   // -1..1
  targetLightness: number; // 0..1
  targetContrast: number;  // 0..1
};

export const profile: StyleProfile = {
  name: "Maya",
  initials: "M",
  season: "Warm Autumn",
  undertone: "warm",
  contrast: "medium",
  faceShape: "oval",
  hair: "deep espresso brown",
  skin: "warm golden-tan",
  loved: ["terracotta", "olive", "gold", "cream", "rust", "camel", "burgundy"],
  avoided: ["ice blue", "fuchsia", "silver", "slate"],
  targetWarmth: 0.5,
  targetLightness: 0.44,
  targetContrast: 0.46,
};
