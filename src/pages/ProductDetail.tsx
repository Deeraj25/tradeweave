import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Star, Minus, Plus, ShoppingBag, Camera, ChevronLeft, Check, Truck, ShieldCheck, Briefcase } from "lucide-react";
import { getProduct, relatedProducts } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useCart } from "../store/cart";
import { useToast } from "../store/toast";
import { inr } from "../lib/format";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = id ? getProduct(id) : undefined;
  const add = useCart((s) => s.add);
  const push = useToast((s) => s.push);

  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>(product?.colors[0] ?? "");
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="mx-auto grid max-w-md place-items-center gap-4 px-6 py-32 text-center">
        <h1 className="text-display text-3xl">Piece not found</h1>
        <Link to="/retail" className="btn-gold h-11">Back to store</Link>
      </div>
    );
  }

  const addToCart = () => {
    if (!size) {
      push("Please select a size first", "error");
      return;
    }
    add({ id: product.id, name: product.name, image: product.image, size, price: product.retailPrice }, qty);
    push(`Added ${qty} × ${product.name} (${size})`, "success");
  };

  const related = relatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm text-cream/50 hover:text-gold">
        <ChevronLeft size={16} /> Back
      </button>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="group relative overflow-hidden rounded-3xl border border-line bg-brand-gray"
        >
          <img src={product.image} alt={product.name} className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gold backdrop-blur">
            {product.type}
          </span>
        </motion.div>

        {/* info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6">
          <div>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-gold"><Star size={14} className="fill-gold" /> {product.rating}</span>
              <span className="text-cream/40">·</span>
              <span className="capitalize text-cream/50">{product.origin} wear</span>
            </div>
            <h1 className="text-display mt-2 text-4xl font-semibold">{product.name}</h1>
            <p className="mt-3 text-cream/60">{product.description}</p>
          </div>

          <div className="text-3xl font-semibold text-gold">{inr(product.retailPrice)}</div>

          {/* colors */}
          <div>
            <p className="mb-2 text-sm font-medium">Color: <span className="text-cream/60">{color}</span></p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${color === c ? "border-gold bg-gold/10 text-gold" : "border-line text-cream/60 hover:border-gold/50"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* sizes */}
          <div>
            <p className="mb-2 text-sm font-medium">Select size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`grid h-11 min-w-11 place-items-center rounded-lg border px-3 text-sm font-medium transition-all ${
                    size === s ? "border-gold bg-gold text-ink" : "border-line text-cream hover:border-gold"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* qty + add */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-xl border border-line">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center text-cream/70 hover:text-gold"><Minus size={16} /></button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="grid h-12 w-12 place-items-center text-cream/70 hover:text-gold"><Plus size={16} /></button>
            </div>
            <button onClick={addToCart} className="btn-gold h-12 flex-1 min-w-44">
              <ShoppingBag size={18} /> Add to cart · {inr(product.retailPrice * qty)}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/try-on" className="btn-ghost h-11 text-sm"><Camera size={16} /> Try on me</Link>
            {product.wholesaleTiers && (
              <Link to="/wholesale" className="btn-ghost h-11 text-sm"><Briefcase size={16} /> Buy wholesale</Link>
            )}
          </div>

          {/* trust row */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Feature icon={<Truck size={16} />} title="Tracked delivery" note="Packing → shipping → door (soon)" />
            <Feature icon={<ShieldCheck size={16} />} title="Warranty support" note="Easy returns on eligible items (soon)" />
          </div>
        </motion.div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-display text-2xl font-semibold">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Feature({ icon, title, note }: { icon: React.ReactNode; title: string; note: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-line p-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">{icon}</span>
      <div>
        <p className="flex items-center gap-1 text-sm font-medium"><Check size={12} className="text-emerald-400" /> {title}</p>
        <p className="text-xs text-cream/45">{note}</p>
      </div>
    </div>
  );
}
