import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Search, SlidersHorizontal, Camera, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";
import { retailProducts, productTypes } from "../data/products";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

export default function Retail() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("All");
  const [origin, setOrigin] = useState<"All" | "traditional" | "western">("All");
  const [sort, setSort] = useState<Sort>("featured");

  const types = ["All", ...productTypes.filter((t) => retailProducts.some((p) => p.type === t))];

  const filtered = useMemo(() => {
    let list = retailProducts.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchesQ = !q || p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q));
      const matchesType = type === "All" || p.type === type;
      const matchesOrigin = origin === "All" || p.origin === origin;
      return matchesQ && matchesType && matchesOrigin;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.retailPrice - b.retailPrice);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.retailPrice - a.retailPrice);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, type, origin, sort]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* header */}
      <Reveal>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">Retail store</p>
            <h1 className="text-display mt-1 text-4xl font-semibold">Shop the collection</h1>
            <p className="mt-2 max-w-md text-cream/50">
              Hover any piece to pick a size and add it instantly — or open it for the full story.
            </p>
          </div>
          <Link to="/try-on" className="btn-gold h-11 self-start sm:self-auto">
            <Camera size={18} /> Try it on you
          </Link>
        </div>
      </Reveal>

      {/* controls */}
      <div className="card mt-8 flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sarees, dresses, kurtas…"
            className="h-10 w-full rounded-lg border border-line bg-ink pl-9 pr-3 text-sm text-cream placeholder:text-cream/30 focus:border-gold/50 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["All", "traditional", "western"] as const).map((o) => (
            <button
              key={o}
              onClick={() => setOrigin(o)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                origin === o ? "bg-gold text-ink" : "border border-line text-cream/60 hover:text-cream"
              }`}
            >
              {o}
            </button>
          ))}
          <div className="flex items-center gap-2 text-cream/50">
            <SlidersHorizontal size={15} />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-lg border border-line bg-ink px-2 py-1.5 text-xs text-cream focus:border-gold/50 focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* type chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              type === t ? "border border-gold bg-gold/10 text-gold" : "border border-line text-cream/60 hover:border-gold/50"
            }`}
          >
            {t}
          </button>
        ))}
        {(query || type !== "All" || origin !== "All") && (
          <button
            onClick={() => { setQuery(""); setType("All"); setOrigin("All"); }}
            className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-sm text-cream/50 hover:text-gold"
          >
            <X size={13} /> Clear
          </button>
        )}
      </div>

      <p className="mt-5 text-sm text-cream/40">{filtered.length} pieces</p>

      {/* grid */}
      <motion.div layout className="mt-4 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <ProductCard product={p} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="card mt-6 grid place-items-center gap-2 p-16 text-center">
          <p className="text-cream/60">No pieces match your filters.</p>
          <button onClick={() => { setQuery(""); setType("All"); setOrigin("All"); }} className="btn-ghost h-10 text-sm">Reset filters</button>
        </div>
      )}
    </div>
  );
}
