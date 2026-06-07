import { motion } from "motion/react";
import { ArrowUpRight, Check, Heart, Sparkles } from "lucide-react";
import type { Outfit } from "../../data/outfits";
import type { OutfitAnalysis } from "../../lib/colorTheory";
import { profile } from "../../data/profile";
import Avatar from "./Avatar";

function Verdict({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${
        ok ? "border-gold/50 bg-gold/10 text-gold" : "border-line text-cream/45"
      }`}
    >
      {ok ? <Check size={11} /> : <span className="text-cream/40">~</span>}
      {label}
    </span>
  );
}

export default function OutfitCard({
  outfit,
  analysis,
  saved,
  onToggleSave,
  onOpen,
  index,
}: {
  outfit: Outfit;
  analysis: OutfitAnalysis;
  saved: boolean;
  onToggleSave: () => void;
  onOpen: () => void;
  index: number;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      onClick={onOpen}
      className="card group relative cursor-pointer overflow-hidden hover:border-gold/40 hover:shadow-[0_20px_60px_-20px_rgba(212,165,55,0.35)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={outfit.image}
          alt={outfit.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent" />

        {/* Save / heart */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          aria-label={saved ? "Remove from saved" : "Save outfit"}
          className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-ink/50 backdrop-blur transition-colors hover:border-gold/60"
        >
          <Heart size={16} className={saved ? "fill-gold text-gold" : "text-cream/90"} />
        </motion.button>

        {/* Match badge */}
        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-gold/40 bg-ink/55 px-2.5 py-1 text-xs font-semibold text-gold backdrop-blur">
          <Sparkles size={12} />
          {analysis.matchScore}% match
        </div>

        {/* Title (always visible) */}
        <div className="absolute inset-x-0 bottom-0 p-4 transition-opacity duration-300 group-hover:opacity-0">
          <p className="text-[11px] uppercase tracking-widest text-gold/80">{outfit.source}</p>
          <h3 className="text-display text-lg font-semibold leading-tight text-cream">{outfit.title}</h3>
        </div>

        {/* Hover overlay — why it suits YOU */}
        <div className="absolute inset-0 flex flex-col gap-3 bg-ink/90 p-4 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex items-center gap-2">
            <Avatar size={32} />
            <div className="leading-tight">
              <p className="text-xs font-medium text-cream">You · {profile.season}</p>
              <p className="text-[11px] text-cream/50">{outfit.title}</p>
            </div>
          </div>

          <p className="line-clamp-5 text-[13px] leading-relaxed text-cream/80">{analysis.why}</p>

          <div className="mt-auto flex flex-wrap gap-1.5">
            <Verdict ok={analysis.undertoneMatch} label="Undertone" />
            <Verdict ok={analysis.contrastMatch} label="Contrast" />
            <Verdict ok={analysis.seasonMatch} label={profile.season} />
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-medium text-gold">
            View styling <ArrowUpRight size={13} />
          </span>
        </div>
      </div>

      {/* Palette swatches */}
      <div className="flex items-center gap-2 px-3 py-3">
        {outfit.palette.map((c, i) => (
          <span
            key={c + i}
            title={analysis.swatchNames[i]}
            className="h-5 w-5 rounded-md border border-white/10 shadow-inner"
            style={{ background: c }}
          />
        ))}
        <span className="ml-auto text-[11px] uppercase tracking-wider text-cream/35">{outfit.category}</span>
      </div>
    </motion.article>
  );
}
