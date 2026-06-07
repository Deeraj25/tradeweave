import { AnimatePresence, motion } from "motion/react";
import { SearchX } from "lucide-react";
import type { Outfit } from "../../data/outfits";
import type { OutfitAnalysis } from "../../lib/colorTheory";
import OutfitCard from "./OutfitCard";

export type ScoredOutfit = { outfit: Outfit; analysis: OutfitAnalysis };

export default function OutfitGrid({
  items,
  saved,
  onToggleSave,
  onOpen,
}: {
  items: ScoredOutfit[];
  saved: Set<string>;
  onToggleSave: (id: string) => void;
  onOpen: (o: ScoredOutfit) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-24 text-center text-cream/50">
        <SearchX size={36} className="text-gold/60" />
        <p className="text-lg text-cream/80">No outfits match those filters</p>
        <p className="text-sm">Try turning a source back on or switching category.</p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="mx-auto grid max-w-7xl gap-5 px-4 pb-24 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 xl:grid-cols-4"
    >
      <AnimatePresence mode="popLayout">
        {items.map((it, i) => (
          <OutfitCard
            key={it.outfit.id}
            outfit={it.outfit}
            analysis={it.analysis}
            index={i}
            saved={saved.has(it.outfit.id)}
            onToggleSave={() => onToggleSave(it.outfit.id)}
            onOpen={() => onOpen(it)}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
