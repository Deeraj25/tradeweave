import { describe, it, expect } from "vitest";
import { predictFit, type FitInput } from "../data/tryon";

const input: FitInput = {
  fileName: "me.jpg",
  fileSize: 12345,
  heightCm: 170,
  weightKg: 65,
  bodyType: "regular",
  garmentSizes: ["S", "M", "L", "XL"],
};

describe("predictFit (deterministic)", () => {
  it("returns identical result for identical input", () => {
    expect(predictFit(input)).toEqual(predictFit({ ...input }));
  });

  it("recommends a size from the garment's available sizes", () => {
    expect(input.garmentSizes).toContain(predictFit(input).recommendedSize);
  });

  it("suitability is stable and within 0-100", () => {
    const r = predictFit(input);
    expect(r.suitability).toBeGreaterThanOrEqual(0);
    expect(r.suitability).toBeLessThanOrEqual(100);
    expect(predictFit(input).suitability).toBe(r.suitability);
  });

  it("colorMatch is stable and within the intended 60-99 range", () => {
    // checked across many inputs to catch signed-shift regressions
    for (let n = 0; n < 200; n++) {
      const r = predictFit({ ...input, fileName: `f${n}.jpg`, fileSize: n * 7919 + 1 });
      expect(r.colorMatch).toBeGreaterThanOrEqual(60);
      expect(r.colorMatch).toBeLessThanOrEqual(99);
      expect(r.suitability).toBeGreaterThanOrEqual(72);
      expect(r.suitability).toBeLessThanOrEqual(99);
    }
  });

  it("taller/heavier shifts recommended size up sensibly", () => {
    const small = predictFit({ ...input, heightCm: 155, weightKg: 48, garmentSizes: ["S", "M", "L", "XL", "XXL"] });
    const large = predictFit({ ...input, heightCm: 190, weightKg: 95, garmentSizes: ["S", "M", "L", "XL", "XXL"] });
    const order = ["S", "M", "L", "XL", "XXL"];
    expect(order.indexOf(large.recommendedSize)).toBeGreaterThan(order.indexOf(small.recommendedSize));
  });

  it("different photo (filename/size) changes the suitability score", () => {
    const a = predictFit(input);
    const b = predictFit({ ...input, fileName: "other.png", fileSize: 99999 });
    // deterministic but input-driven: scores should not be hard-coded identical
    expect(a.suitability === b.suitability && a.colorMatch === b.colorMatch).toBe(false);
  });
});
