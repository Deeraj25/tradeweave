import { describe, expect, it } from "vitest";
import { analyseOutfit } from "../lib/colorTheory";
import { outfits } from "../data/outfits";
import { profile } from "../data/profile";

const byId = (id: string) => outfits.find((o) => o.id === id)!;

describe("colour-theory engine", () => {
  it("is deterministic — same input yields identical output", () => {
    for (const o of outfits) {
      expect(analyseOutfit(o, profile)).toEqual(analyseOutfit(o, profile));
    }
  });

  it("keeps every match score within a believable range", () => {
    for (const o of outfits) {
      const { matchScore } = analyseOutfit(o, profile);
      expect(matchScore).toBeGreaterThanOrEqual(62);
      expect(matchScore).toBeLessThanOrEqual(98);
    }
  });

  it("scores a warm-autumn palette above a cool one for a warm-autumn user", () => {
    const warm = analyseOutfit(byId("kanjeevaram-saree"), profile).matchScore;
    const cool = analyseOutfit(byId("evening-gown"), profile).matchScore;
    expect(warm).toBeGreaterThan(cool);
  });

  it("rationale references the user's own features", () => {
    const { why } = analyseOutfit(byId("kanjeevaram-saree"), profile);
    expect(why.toLowerCase()).toContain("warm autumn");
    expect(why).toContain(profile.faceShape);
  });
});
