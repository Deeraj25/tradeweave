import { useEffect, useMemo, useState } from "react";
import Nav from "./components/feed/Nav";
import Hero from "./components/feed/Hero";
import GridHeader, { type Sort } from "./components/feed/GridHeader";
import OutfitGrid, { type ScoredOutfit } from "./components/feed/OutfitGrid";
import UploadModal from "./components/feed/UploadModal";
import DetailDrawer from "./components/feed/DetailDrawer";
import { CATEGORIES, SOURCES, outfits, type Source } from "./data/outfits";
import { profile } from "./data/profile";
import { analyseOutfit } from "./lib/colorTheory";

type Category = (typeof CATEGORIES)[number];
const SAVED_KEY = "aura.saved";

export default function App() {
  const [category, setCategory] = useState<Category>("All");
  const [sources, setSources] = useState<Set<Source>>(new Set(SOURCES));
  const [sort, setSort] = useState<Sort>("match");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [detail, setDetail] = useState<ScoredOutfit | null>(null);
  const [saved, setSaved] = useState<Set<string>>(() => {
    try {
      return new Set<string>(JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]"));
    } catch {
      return new Set<string>();
    }
  });

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify([...saved]));
  }, [saved]);

  // Score every outfit once — this is the deterministic "AI" pass.
  const scored = useMemo<ScoredOutfit[]>(
    () => outfits.map((outfit) => ({ outfit, analysis: analyseOutfit(outfit, profile) })),
    [],
  );

  const visible = useMemo(() => {
    const order = outfits.map((o) => o.id);
    const list = scored.filter(
      ({ outfit }) =>
        (category === "All" || outfit.category === category) && sources.has(outfit.source),
    );
    const sorters: Record<Sort, (a: ScoredOutfit, b: ScoredOutfit) => number> = {
      match: (a, b) => b.analysis.matchScore - a.analysis.matchScore,
      contrast: (a, b) => b.analysis.contrast - a.analysis.contrast,
      warmth: (a, b) => b.analysis.warmthAvg - a.analysis.warmthAvg,
      newest: (a, b) => order.indexOf(a.outfit.id) - order.indexOf(b.outfit.id),
    };
    return [...list].sort(sorters[sort]);
  }, [scored, category, sources, sort]);

  const toggleSource = (s: Source) =>
    setSources((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });

  const toggleSave = (id: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="min-h-screen">
      <Nav category={category} onCategory={setCategory} onUpload={() => setUploadOpen(true)} />
      <Hero active={sources} onToggle={toggleSource} />
      <GridHeader count={visible.length} savedCount={saved.size} sort={sort} onSort={setSort} />
      <OutfitGrid items={visible} saved={saved} onToggleSave={toggleSave} onOpen={setDetail} />

      <footer className="border-t border-line py-8 text-center text-xs text-cream/35">
        Aura · personalised outfit feed · deterministic colour-theory engine (AI swap-in ready)
      </footer>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <DetailDrawer item={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
