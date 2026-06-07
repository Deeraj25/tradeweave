import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Upload, Sparkles, Ruler, ShoppingBag, RefreshCw, Info, ImageUp } from "lucide-react";
import { retailProducts } from "../data/products";
import { predictFit, type BodyType, type FitResult } from "../data/tryon";
import { useCart } from "../store/cart";
import { useToast } from "../store/toast";
import { inr } from "../lib/format";

export default function TryOn() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const [garmentId, setGarmentId] = useState(retailProducts[0].id);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [bodyType, setBodyType] = useState<BodyType>("regular");
  const [result, setResult] = useState<FitResult | null>(null);

  const add = useCart((s) => s.add);
  const push = useToast((s) => s.push);
  const garment = retailProducts.find((p) => p.id === garmentId)!;

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const onFile = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      push("Please choose an image file", "error");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setFileMeta({ name: file.name, size: file.size });
    setResult(null);
  };

  const analyze = () => {
    if (!fileMeta) {
      push("Upload a photo of yourself first", "error");
      return;
    }
    setResult(
      predictFit({
        fileName: fileMeta.name,
        fileSize: fileMeta.size,
        heightCm: height,
        weightKg: weight,
        bodyType,
        garmentSizes: garment.sizes,
      }),
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
        <Sparkles size={14} /> Retail · AI fitting room
      </div>
      <h1 className="text-display mt-1 text-4xl font-semibold sm:text-5xl">Try it on you</h1>
      <p className="mt-2 max-w-xl text-cream/55">
        Upload a full-body photo and your measurements — we’ll estimate your best size, fit suitability and
        colour match for any piece.
      </p>
      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs text-gold">
        <Info size={13} /> Simulated preview — on-device generative try-on arrives in a future phase.
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* LEFT: inputs */}
        <div className="space-y-5">
          {/* dropzone */}
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); onFile(e.dataTransfer.files?.[0]); }}
            className={`grid cursor-pointer place-items-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
              dragging ? "border-gold bg-gold/10" : "border-line hover:border-gold/50 hover:bg-white/5"
            }`}
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/15 text-gold"><ImageUp size={22} /></span>
            <p className="font-medium text-cream">Click to upload your photo</p>
            <p className="text-xs text-cream/45">or drag & drop · JPG/PNG · we never store it</p>
          </div>

          {/* measurements */}
          <div className="card space-y-4 p-5">
            <div className="flex items-center gap-2 text-sm font-medium"><Ruler size={16} className="text-gold" /> Your measurements</div>
            <Slider label="Height" value={height} min={140} max={200} unit="cm" onChange={setHeight} />
            <Slider label="Weight" value={weight} min={40} max={120} unit="kg" onChange={setWeight} />
            <div>
              <p className="mb-2 text-sm text-cream/70">Body type</p>
              <div className="grid grid-cols-3 gap-2">
                {(["slim", "regular", "plus"] as BodyType[]).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBodyType(b)}
                    className={`h-10 rounded-lg border text-sm capitalize transition-all ${
                      bodyType === b ? "border-gold bg-gold text-ink" : "border-line text-cream/70 hover:border-gold/50"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm text-cream/70">Garment to try</p>
              <select
                value={garmentId}
                onChange={(e) => { setGarmentId(e.target.value); setResult(null); }}
                className="h-11 w-full rounded-lg border border-line bg-ink px-3 text-sm text-cream focus:border-gold/50 focus:outline-none"
              >
                {retailProducts.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — {inr(p.retailPrice)}</option>
                ))}
              </select>
            </div>
            <button onClick={analyze} className="btn-gold h-12 w-full"><Sparkles size={18} /> Analyze fit</button>
          </div>
        </div>

        {/* RIGHT: preview + result */}
        <div className="space-y-5">
          <div className="card relative overflow-hidden p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-line bg-ink">
                {preview ? (
                  <img src={preview} alt="you" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-center text-xs text-cream/35">
                    <span><Upload size={20} className="mx-auto mb-1" /> Your photo</span>
                  </div>
                )}
                <span className="absolute bottom-2 left-2 rounded bg-ink/70 px-2 py-0.5 text-[10px] text-cream/70 backdrop-blur">You</span>
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-line">
                <img src={garment.image} alt={garment.name} className="h-full w-full object-cover" />
                <span className="absolute bottom-2 left-2 rounded bg-ink/70 px-2 py-0.5 text-[10px] text-gold backdrop-blur">{garment.name}</span>
              </div>
            </div>
          </div>

          {result ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card space-y-5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-cream/45">Recommended size</p>
                  <p className="text-display text-4xl font-semibold text-gold">{result.recommendedSize}</p>
                </div>
                <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-gold/40 text-center">
                  <span className="text-lg font-bold text-gold">{result.suitability}%</span>
                </div>
              </div>
              <p className="text-sm text-cream/60">{result.fitNote}</p>
              <Meter label="Fit suitability" value={result.suitability} />
              <Meter label="Colour match" value={result.colorMatch} />
              <div className="flex gap-2">
                <button
                  onClick={() => { add({ id: garment.id, name: garment.name, image: garment.image, size: result.recommendedSize, price: garment.retailPrice }); push(`Added ${garment.name} (${result.recommendedSize}) to cart`, "success"); }}
                  className="btn-gold h-11 flex-1"
                >
                  <ShoppingBag size={16} /> Add {result.recommendedSize} to cart
                </button>
                <button onClick={analyze} className="btn-ghost h-11 px-3" aria-label="Re-run"><RefreshCw size={16} /></button>
              </div>
              <p className="text-center text-[11px] text-cream/35">Same photo + measurements always give the same result.</p>
            </motion.div>
          ) : (
            <div className="card grid place-items-center gap-2 p-10 text-center text-sm text-cream/45">
              <Sparkles className="text-gold/50" />
              Upload a photo, set your measurements, then hit <span className="text-gold">Analyze fit</span>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, unit, onChange }: { label: string; value: number; min: number; max: number; unit: string; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-cream/70">{label}</span>
        <span className="font-medium text-gold">{value} {unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[var(--color-gold)]" />
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-cream/55">{label}</span>
        <span className="font-medium text-cream">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-gold to-gold-soft" />
      </div>
    </div>
  );
}
