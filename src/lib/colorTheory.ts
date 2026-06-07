// The deterministic "colour-theory" engine. This stands in for the multimodal
// AI layer: given a user's style profile and an outfit's palette it returns a
// match score, harmony verdicts, and a human-readable rationale.
//
// It is PURE and DETERMINISTIC: the same outfit + profile always yields the
// same result (no Math.random). Swap this module for real model calls later —
// the public shape (analyseOutfit -> OutfitAnalysis) is the seam.

import type { Outfit } from "../data/outfits";
import type { StyleProfile } from "../data/profile";
import { hashString } from "./hash";
import { lightness, nearestName, warmth } from "./color";

export type OutfitAnalysis = {
  matchScore: number;        // 0..100
  warmthAvg: number;         // -1..1
  contrast: number;          // 0..1
  undertoneMatch: boolean;
  contrastMatch: boolean;
  seasonMatch: boolean;
  swatchNames: string[];
  dominant: string;          // dominant colour name
  accent: string;            // secondary colour name
  why: string;               // 1–2 sentence rationale referencing the user
  tips: string[];            // "how to wear it" deterministic styling steps
};

const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));

export function analyseOutfit(outfit: Outfit, p: StyleProfile): OutfitAnalysis {
  const swatchNames = outfit.palette.map(nearestName);
  const warmths = outfit.palette.map(warmth);
  const lights = outfit.palette.map(lightness);

  const warmthAvg = warmths.reduce((a, b) => a + b, 0) / warmths.length;
  const lightAvg = lights.reduce((a, b) => a + b, 0) / lights.length;
  const contrast = Math.max(...lights) - Math.min(...lights);

  // Component scores (0..1).
  const undertoneScore = clamp(1 - Math.abs(warmthAvg - p.targetWarmth) / 1.2);
  const depthScore = clamp(1 - Math.abs(lightAvg - p.targetLightness) / 0.6);
  const contrastScore = clamp(1 - Math.abs(contrast - p.targetContrast) / 0.7);

  // Loved / avoided colour adjustments.
  let pref = 0;
  for (const name of swatchNames) {
    if (p.loved.includes(name)) pref += 2;
    if (p.avoided.includes(name)) pref -= 4;
  }
  pref = Math.max(-10, Math.min(8, pref));

  // Stable per-outfit jitter so scores don't look suspiciously round.
  const jitter = (hashString(outfit.id + "|" + p.season) % 7) - 3;

  const raw = 0.5 * undertoneScore + 0.2 * depthScore + 0.2 * contrastScore;
  const matchScore = Math.max(
    62,
    Math.min(98, Math.round(58 + raw * 40 + pref + jitter)),
  );

  const undertoneMatch = Math.sign(warmthAvg || 0) === (p.undertone === "cool" ? -1 : 1) || p.undertone === "neutral";
  const contrastMatch = Math.abs(contrast - p.targetContrast) < 0.2;
  const seasonMatch = undertoneScore > 0.66;

  const dominant = swatchNames[0];
  const accent = swatchNames[1] ?? swatchNames[0];

  return {
    matchScore,
    warmthAvg,
    contrast,
    undertoneMatch,
    contrastMatch,
    seasonMatch,
    swatchNames,
    dominant,
    accent,
    why: buildWhy(p, { warmthAvg, contrast, undertoneScore, contrastScore, dominant, accent }),
    tips: buildTips(outfit, p, contrast),
  };
}

function buildWhy(
  p: StyleProfile,
  m: { warmthAvg: number; contrast: number; undertoneScore: number; contrastScore: number; dominant: string; accent: string },
): string {
  const parts: string[] = [];

  if (m.warmthAvg > 0.15) {
    parts.push(
      `The ${m.dominant} and ${m.accent} carry the same golden warmth as your ${p.skin} skin and ${p.hair} hair — pure ${p.season} territory, so the colour lifts your complexion instead of draining it.`,
    );
  } else if (m.warmthAvg < -0.15) {
    parts.push(
      `These ${m.dominant} tones run cooler than your warm undertone, so keep them away from the face — anchor the look with a ${p.loved[0]} or ${p.loved[2]} layer near your collar to bridge it.`,
    );
  } else {
    parts.push(
      `This near-neutral ${m.dominant} palette plays safely against your warm undertone and reads polished without competing with your ${p.hair} hair.`,
    );
  }

  if (m.contrastScore > 0.7) {
    parts.push(
      `Its medium contrast mirrors the soft depth between your skin and hair, and the unbroken vertical line flatters your ${p.faceShape} face.`,
    );
  } else if (m.contrast > 0.6) {
    parts.push(
      `The high contrast is bold for your ${p.contrast}-contrast colouring — let the lighter piece sit up top to keep it from overpowering your features.`,
    );
  } else {
    parts.push(
      `The low, tonal contrast suits your ${p.contrast}-contrast colouring and keeps the eye on your ${p.faceShape} face.`,
    );
  }

  return parts.join(" ");
}

function buildTips(outfit: Outfit, p: StyleProfile, contrast: number): string[] {
  const tips: string[] = [];
  tips.push(`Build from the base up: start with the ${outfit.items[0].name.toLowerCase()}, then layer outward.`);
  tips.push(
    contrast > 0.55
      ? `Keep the lighter colour above the waist to draw the eye upward toward your face.`
      : `Define the waist with a ${p.loved[0]} belt to add structure to the tonal palette.`,
  );
  tips.push(`Repeat your ${p.season} accent — a ${p.loved[1]} or ${p.loved[3]} note in the accessories — to tie the whole look to your palette.`);
  return tips;
}
