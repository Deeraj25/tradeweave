import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Star, Plus, RotateCcw, Eye } from "lucide-react";
import type { Product } from "../data/types";
import { useCart } from "../store/cart";
import { useToast } from "../store/toast";
import { inr } from "../lib/format";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [flipped, setFlipped] = useState(false);
  const add = useCart((s) => s.add);
  const push = useToast((s) => s.push);
  const navigate = useNavigate();

  const quickAdd = (size: string) => {
    add({ id: product.id, name: product.name, image: product.image, size, price: product.retailPrice });
    push(`Added ${product.name} (${size}) to cart`, "success");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="group perspective-1200"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        className="relative preserve-3d"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ── FRONT ───────────────────────────────────────────── */}
        <div className={`backface-hidden ${flipped ? "pointer-events-none" : ""}`}>
          <div className="overflow-hidden rounded-2xl border border-line bg-brand-gray">
            <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-gold backdrop-blur">
                {product.type}
              </span>
              {product.origin === "traditional" && (
                <span className="absolute right-3 top-3 rounded-full border border-gold/40 bg-ink/60 px-2 py-1 text-[10px] font-medium text-cream/80 backdrop-blur">
                  Heritage
                </span>
              )}
            </Link>
            <div className="space-y-1 p-4">
              <div className="flex items-center justify-between">
                <h3 className="truncate pr-2 text-sm font-semibold text-cream">{product.name}</h3>
                <span className="flex shrink-0 items-center gap-1 text-xs text-gold">
                  <Star size={12} className="fill-gold" /> {product.rating}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gold">{inr(product.retailPrice)}</span>
                <span className="flex items-center gap-1 text-[11px] text-cream/40">
                  <RotateCcw size={11} /> hover for sizes
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── BACK ────────────────────────────────────────────── */}
        <div
          className="rotate-y-180 backface-hidden absolute inset-0"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="flex h-full flex-col justify-between rounded-2xl border border-gold/30 bg-gradient-to-b from-brand-gray to-ink p-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-gold/80">Quick add</p>
              <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-cream">{product.name}</h3>
              <p className="mt-0.5 text-base font-semibold text-gold">{inr(product.retailPrice)}</p>
            </div>

            <div>
              <p className="mb-2 text-[11px] text-cream/50">Select a size — adds to cart instantly</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => quickAdd(size)}
                    className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-line bg-ink px-2 text-sm font-medium text-cream transition-all hover:border-gold hover:bg-gold hover:text-ink active:scale-95"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => quickAdd(product.sizes[Math.floor(product.sizes.length / 2)])}
                className="btn-gold h-9 flex-1 text-xs"
              >
                <Plus size={14} /> Add ({product.sizes[Math.floor(product.sizes.length / 2)]})
              </button>
              <button
                onClick={() => navigate(`/product/${product.id}`)}
                className="btn-ghost h-9 px-3 text-xs"
                aria-label="View details"
              >
                <Eye size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* touch / no-hover fallback: tap to flip */}
      <button
        onClick={() => setFlipped((f) => !f)}
        className="mt-2 w-full rounded-lg border border-line py-1.5 text-xs text-cream/50 hover:text-gold md:hidden"
      >
        {flipped ? "Show photo" : "Quick add sizes"}
      </button>
    </motion.div>
  );
}
