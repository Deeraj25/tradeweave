import { hashString } from "../lib/hash";

const ORDER = ["S", "M", "L", "XL", "XXL"] as const;
export type BodyType = "slim" | "regular" | "plus";

export type FitInput = {
  fileName: string;
  fileSize: number;
  heightCm: number;
  weightKg: number;
  bodyType: BodyType;
  garmentSizes: readonly string[];
};

export type FitResult = {
  recommendedSize: string;
  suitability: number; // 0-100
  colorMatch: number; // 0-100
  fitNote: string;
};

/**
 * Deterministic fit prediction.
 * Recommended size is derived from BMI + height + body type (real inputs),
 * then mapped to the nearest size the garment actually offers.
 * The suitability / colour-match scores come from a stable hash of the inputs,
 * so the SAME photo + SAME measurements always produce the SAME result.
 * (No Math.random anywhere.)
 */
export function predictFit(i: FitInput): FitResult {
  const bmi = i.weightKg / Math.pow(i.heightCm / 100, 2);
  let idx = bmi < 18.5 ? 0 : bmi < 23 ? 1 : bmi < 27 ? 2 : bmi < 31 ? 3 : 4;
  if (i.heightCm >= 185) idx += 1;
  if (i.heightCm < 155) idx -= 1;
  idx += i.bodyType === "slim" ? -1 : i.bodyType === "plus" ? 1 : 0;
  idx = Math.max(0, Math.min(ORDER.length - 1, idx));

  // map to a size the garment actually offers (nearest available)
  const available = ORDER.filter((s) => i.garmentSizes.includes(s));
  const pool = available.length ? available : [...ORDER];
  const recommendedSize = pool.reduce(
    (best, s) =>
      Math.abs(ORDER.indexOf(s) - idx) < Math.abs(ORDER.indexOf(best) - idx) ? s : best,
    pool[0],
  );

  const seed = hashString(`${i.fileName}|${i.fileSize}|${i.heightCm}|${i.weightKg}|${i.bodyType}`);
  const suitability = 72 + (seed % 28); // 72-99, stable
  const colorMatch = 60 + ((seed >>> 8) % 40); // 60-99, stable (unsigned shift keeps it positive)

  const fitNote = `Best in ${recommendedSize} for your ${i.heightCm}cm / ${i.weightKg}kg ${i.bodyType} build.`;
  return { recommendedSize, suitability, colorMatch, fitNote };
}
