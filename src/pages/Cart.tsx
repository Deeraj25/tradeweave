import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react";
import { useCart } from "../store/cart";
import { useToast } from "../store/toast";
import { inr } from "../lib/format";

export default function Cart() {
  const { items, updateQty, remove, clear, subtotal } = useCart();
  const push = useToast((s) => s.push);
  const [placed, setPlaced] = useState(false);

  const sub = subtotal();
  const shipping = sub === 0 || sub >= 4999 ? 0 : 99;
  const total = sub + shipping;

  if (placed) {
    return (
      <div className="mx-auto grid max-w-lg place-items-center gap-4 px-6 py-28 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
          <CheckCircle2 size={72} className="text-emerald-400" />
        </motion.div>
        <h1 className="text-display text-3xl font-semibold">Order placed!</h1>
        <p className="text-cream/60">Your order is confirmed. Real-time tracking (packing → shipping → delivery) is coming in a future phase.</p>
        <div className="mt-2 flex gap-3">
          <Link to="/retail" className="btn-gold h-11">Continue shopping</Link>
          <Link to="/" className="btn-ghost h-11">Home</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto grid max-w-lg place-items-center gap-4 px-6 py-28 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-gray text-cream/40"><ShoppingBag size={32} /></span>
        <h1 className="text-display text-3xl font-semibold">Your cart is empty</h1>
        <p className="text-cream/55">Add a few pieces — hover any product and pick a size to quick-add.</p>
        <Link to="/retail" className="btn-gold mt-2 h-11">Browse the store <ArrowRight size={16} /></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-display text-4xl font-semibold">Your cart</h1>
      <p className="mt-1 text-cream/50">{items.reduce((n, i) => n + i.qty, 0)} item(s)</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* line items */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((it) => (
              <motion.div
                key={it.key}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="card flex items-center gap-4 p-3"
              >
                <img src={it.image} alt={it.name} className="h-24 w-20 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-cream">{it.name}</h3>
                  <p className="text-sm text-cream/50">Size {it.size}</p>
                  <p className="mt-1 text-sm font-medium text-gold">{inr(it.price)}</p>
                </div>
                <div className="flex items-center rounded-lg border border-line">
                  <button onClick={() => updateQty(it.key, it.qty - 1)} className="grid h-9 w-9 place-items-center text-cream/70 hover:text-gold"><Minus size={14} /></button>
                  <span className="w-8 text-center text-sm font-medium">{it.qty}</span>
                  <button onClick={() => updateQty(it.key, it.qty + 1)} className="grid h-9 w-9 place-items-center text-cream/70 hover:text-gold"><Plus size={14} /></button>
                </div>
                <div className="w-24 text-right font-semibold text-cream">{inr(it.price * it.qty)}</div>
                <button onClick={() => { remove(it.key); push("Removed from cart"); }} className="grid h-9 w-9 place-items-center rounded-lg text-cream/40 hover:bg-red-500/10 hover:text-red-400">
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <button onClick={() => { clear(); push("Cart cleared"); }} className="text-sm text-cream/40 hover:text-red-400">
            Clear cart
          </button>
        </div>

        {/* summary */}
        <div className="h-fit space-y-4 rounded-2xl border border-gold/30 bg-gradient-to-b from-brand-gray to-ink p-6 lg:sticky lg:top-24">
          <h2 className="text-display text-xl font-semibold">Order summary</h2>
          <Row label="Subtotal" value={inr(sub)} />
          <Row label="Shipping" value={shipping === 0 ? "Free" : inr(shipping)} />
          {shipping > 0 && <p className="text-xs text-cream/40">Add {inr(4999 - sub)} more for free shipping.</p>}
          <div className="h-px bg-line" />
          <Row label="Total" value={inr(total)} big />
          <button onClick={() => { setPlaced(true); clear(); }} className="btn-gold h-13 w-full py-3.5 text-base">
            Proceed to checkout
          </button>
          <p className="text-center text-xs text-cream/40">Secure mock checkout · no real payment</p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={big ? "font-semibold text-cream" : "text-sm text-cream/60"}>{label}</span>
      <span className={big ? "text-display text-2xl font-semibold text-gold" : "font-medium text-cream"}>{value}</span>
    </div>
  );
}
