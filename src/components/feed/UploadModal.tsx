import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Upload, X } from "lucide-react";
import { hashString } from "../../lib/hash";

type Tagged = { url: string; name: string; type: string; color: string; fit: string };

const TYPES = ["Top", "Dress", "Trouser", "Outerwear", "Saree", "Kurta", "Skirt"];
const COLORS = ["terracotta", "olive", "cream", "gold", "camel", "burgundy", "teal", "charcoal"];
const FITS = ["Slim", "Relaxed", "Tailored", "Flowy", "Oversized"];

// Deterministic "auto-tagging" stand-in for the vision model.
function tag(file: File): Tagged {
  const h = hashString(file.name + file.size);
  return {
    url: URL.createObjectURL(file),
    name: file.name.replace(/\.[^.]+$/, ""),
    type: TYPES[h % TYPES.length],
    color: COLORS[(h >> 3) % COLORS.length],
    fit: FITS[(h >> 6) % FITS.length],
  };
}

export default function UploadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Tagged[]>([]);

  function add(files: FileList | null) {
    if (!files) return;
    setItems((prev) => [...prev, ...Array.from(files).map(tag)]);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.95, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="card relative z-10 w-full max-w-lg p-6"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 text-cream/50 hover:text-cream"
            >
              <X size={20} />
            </button>

            <h3 className="text-display text-2xl font-semibold text-cream">Upload garments</h3>
            <p className="mt-1 text-sm text-cream/60">
              Add wardrobe pieces and we auto-tag type, colour &amp; fit, then weave them into your feed.
            </p>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => add(e.target.files)}
            />

            <button
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                add(e.dataTransfer.files);
              }}
              className="mt-5 flex w-full flex-col items-center gap-2 rounded-2xl border border-dashed border-line py-10 text-cream/60 transition-colors hover:border-gold/60 hover:text-cream"
            >
              <Upload size={26} className="text-gold" />
              <span className="text-sm">Click to choose photos, or drop them here</span>
            </button>

            {items.length > 0 && (
              <div className="mt-5 grid max-h-56 grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
                {items.map((it, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-line">
                    <img src={it.url} alt={it.name} className="h-24 w-full object-cover" />
                    <div className="space-y-0.5 p-2 text-[11px]">
                      <p className="truncate text-cream/80">{it.type}</p>
                      <p className="text-cream/50">
                        {it.color} · {it.fit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <button onClick={onClose} className="btn-gold mt-5 h-11 w-full">
                <Check size={16} /> Add {items.length} to wardrobe
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
