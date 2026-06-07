import { Heart, SlidersHorizontal } from "lucide-react";

export type Sort = "match" | "contrast" | "warmth" | "newest";

const LABELS: Record<Sort, string> = {
  match: "Best match",
  contrast: "Highest contrast",
  warmth: "Warmest palette",
  newest: "Newest",
};

export default function GridHeader({
  count,
  savedCount,
  sort,
  onSort,
}: {
  count: number;
  savedCount: number;
  sort: Sort;
  onSort: (s: Sort) => void;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 pb-5 sm:px-6">
      <h2 className="text-sm text-cream/70">
        <span className="text-display text-2xl font-semibold text-gold">{count}</span>{" "}
        {count === 1 ? "outfit" : "outfits"} matched for you
      </h2>

      <div className="flex items-center gap-3">
        <span className="chip gap-1.5 border-line text-cream/70">
          <Heart size={14} className={savedCount ? "fill-gold text-gold" : ""} />
          {savedCount} saved
        </span>

        <label className="flex items-center gap-2 rounded-full border border-line bg-brand-gray/60 px-3 py-1.5 text-sm text-cream/80">
          <SlidersHorizontal size={14} className="text-gold" />
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as Sort)}
            className="cursor-pointer bg-transparent pr-1 text-cream/90 outline-none [&>option]:bg-brand-gray"
          >
            {(Object.keys(LABELS) as Sort[]).map((s) => (
              <option key={s} value={s}>
                {LABELS[s]}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
