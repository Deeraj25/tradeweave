import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Briefcase, Plus, Minus, Trash2, FileText, Boxes, ShieldCheck, BadgePercent } from "lucide-react";
import Reveal from "../components/Reveal";
import QuoteModal, { type QuotePrefill } from "../components/QuoteModal";
import { wholesaleProducts } from "../data/products";
import { useWholesale } from "../store/wholesale";
import { useToast } from "../store/toast";
import { inr } from "../lib/format";
import type { Product } from "../data/types";

export default function Wholesale() {
  const { items, addOrder, setQty, remove, total } = useWholesale();
  const push = useToast((s) => s.push);
  const [quote, setQuote] = useState<{ open: boolean; prefill?: QuotePrefill }>({ open: false });

  const addToOrder = (p: Product) => {
    if (items.find((i) => i.id === p.id)) {
      push(`${p.name} is already in your order`, "error");
      return;
    }
    addOrder({ id: p.id, name: p.name, image: p.image, moq: p.moq!, tiers: p.wholesaleTiers! });
    push(`Added ${p.name} to wholesale order (MOQ ${p.moq})`, "success");
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Reveal>
        <p className="text-xs uppercase tracking-widest text-gold">Wholesale · B2B</p>
        <h1 className="text-display mt-1 text-4xl font-semibold sm:text-5xl">Direct B2B. No middlemen.</h1>
        <p className="mt-3 max-w-xl text-cream/55">
          Factory-direct pricing that drops as your quantity grows. Add items to a bulk order and adjust
          quantities live, or send a catalog enquiry for custom requirements.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Feature icon={<BadgePercent size={16} />} text="Tiered bulk pricing" />
          <Feature icon={<Boxes size={16} />} text="Low MOQs" />
          <Feature icon={<ShieldCheck size={16} />} text="Verified makers" />
        </div>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* product grid */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {wholesaleProducts.map((p, i) => (
            <WholesaleCard
              key={p.id}
              product={p}
              index={i}
              inOrder={!!items.find((it) => it.id === p.id)}
              onAdd={() => addToOrder(p)}
              onEnquire={() => setQuote({ open: true, prefill: { product: p.name, moq: p.moq, qty: p.moq } })}
            />
          ))}
        </div>

        {/* order panel */}
        <div className="h-fit space-y-4 rounded-2xl border border-gold/30 bg-gradient-to-b from-brand-gray to-ink p-5 lg:sticky lg:top-24">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-gold" />
            <h2 className="text-display text-lg font-semibold">Your bulk order</h2>
          </div>

          {items.length === 0 ? (
            <p className="py-8 text-center text-sm text-cream/45">
              No items yet. Click <span className="text-gold">Add to order</span> on any product to start building a bulk order.
            </p>
          ) : (
            <>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.map((it) => (
                    <motion.div key={it.key} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="rounded-xl border border-line bg-ink p-3">
                      <div className="flex items-center gap-3">
                        <img src={it.image} alt={it.name} className="h-12 w-12 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{it.name}</p>
                          <p className="text-xs text-cream/45">{inr(it.unitPrice)}/unit · MOQ {it.moq}</p>
                        </div>
                        <button onClick={() => { remove(it.key); push("Removed from order"); }} className="text-cream/40 hover:text-red-400"><Trash2 size={15} /></button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-line">
                          <button onClick={() => setQty(it.key, it.qty - 10)} className="grid h-8 w-8 place-items-center text-cream/70 hover:text-gold"><Minus size={13} /></button>
                          <input
                            value={it.qty}
                            onChange={(e) => setQty(it.key, Number(e.target.value.replace(/\D/g, "")) || it.moq)}
                            className="w-12 bg-transparent text-center text-sm font-medium focus:outline-none"
                          />
                          <button onClick={() => setQty(it.key, it.qty + 10)} className="grid h-8 w-8 place-items-center text-cream/70 hover:text-gold"><Plus size={13} /></button>
                        </div>
                        <span className="text-sm font-semibold text-gold">{inr(it.qty * it.unitPrice)}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="h-px bg-line" />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Order total</span>
                <span className="text-display text-2xl font-semibold text-gold">{inr(total())}</span>
              </div>
              <button
                onClick={() => setQuote({ open: true, prefill: { product: `Bulk order (${items.length} items)`, qty: items.reduce((n, i) => n + i.qty, 0), moq: 1 } })}
                className="btn-gold h-12 w-full"
              >
                <FileText size={16} /> Request quote for order
              </button>
              <p className="text-center text-xs text-cream/40">Prices update automatically by quantity tier.</p>
            </>
          )}
        </div>
      </div>

      <QuoteModal open={quote.open} prefill={quote.prefill} onClose={() => setQuote({ open: false })} />
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-cream/70">
      <span className="text-gold">{icon}</span> {text}
    </span>
  );
}

function WholesaleCard({
  product, index, inOrder, onAdd, onEnquire,
}: {
  product: Product; index: number; inOrder: boolean; onAdd: () => void; onEnquire: () => void;
}) {
  const tiers = product.wholesaleTiers!;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.05 }}
      className="card flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-gold backdrop-blur">{product.type}</span>
        <span className="absolute right-3 top-3 rounded-full bg-gold px-2 py-1 text-[10px] font-bold text-ink">MOQ {product.moq}</span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-cream">{product.name}</h3>
        <p className="text-xs text-cream/45">Retail {inr(product.retailPrice)}</p>

        {/* tier table */}
        <div className="mt-3 overflow-hidden rounded-lg border border-line">
          <div className="grid grid-cols-2 bg-ink/60 px-3 py-1.5 text-[11px] uppercase tracking-wide text-cream/45">
            <span>Qty</span><span className="text-right">Per unit</span>
          </div>
          {tiers.map((t, i) => (
            <div key={i} className="grid grid-cols-2 px-3 py-1.5 text-sm odd:bg-ink/30">
              <span className="text-cream/70">{t.minQty}+</span>
              <span className="text-right font-medium text-gold">{inr(t.pricePerUnit)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={onAdd} className={`h-10 flex-1 rounded-xl text-sm font-semibold transition-all ${inOrder ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "btn-gold"}`}>
            {inOrder ? "✓ In order" : "Add to order"}
          </button>
          <button onClick={onEnquire} className="btn-ghost h-10 px-3 text-sm">Enquiry</button>
        </div>
      </div>
    </motion.div>
  );
}
