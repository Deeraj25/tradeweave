import { motion } from "motion/react";
import { Sparkles, Upload } from "lucide-react";
import { CATEGORIES } from "../../data/outfits";
import Avatar from "./Avatar";

type Category = (typeof CATEGORIES)[number];

export default function Nav({
  category,
  onCategory,
  onUpload,
}: {
  category: Category;
  onCategory: (c: Category) => void;
  onUpload: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="/" className="flex items-center gap-2">
          <Sparkles className="text-gold" size={22} />
          <span className="text-display text-xl font-semibold tracking-wide text-cream">Aura</span>
          <span className="hidden text-xs text-cream/40 sm:inline">· outfits in your colour</span>
        </a>

        <div className="flex items-center gap-3">
          <button onClick={onUpload} className="btn-gold h-10 text-sm">
            <Upload size={16} />
            <span className="hidden sm:inline">Upload Garments</span>
            <span className="sm:hidden">Upload</span>
          </button>
          <Avatar size={38} className="hidden sm:grid" />
        </div>
      </div>

      <nav className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex gap-1 overflow-x-auto pb-2">
          {CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                onClick={() => onCategory(c)}
                className={`relative whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors ${
                  active ? "text-gold" : "text-cream/60 hover:text-cream"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full border border-gold/40 bg-gold/10"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{c}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
