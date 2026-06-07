import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Package, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useOrders, ORDER_STAGES, stageIndex } from "../store/orders";
import { inr } from "../lib/format";

export default function Orders() {
  const orders = useOrders((s) => s.orders);

  if (orders.length === 0) {
    return (
      <div className="mx-auto grid max-w-lg place-items-center gap-4 px-6 py-28 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-gray text-cream/40"><Package size={32} /></span>
        <h1 className="text-display text-3xl font-semibold">No orders yet</h1>
        <p className="text-cream/55">Place an order and watch it travel from packing to your door in real time.</p>
        <Link to="/retail" className="btn-gold mt-2 h-11">Start shopping <ArrowRight size={16} /></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-display text-4xl font-semibold">Your orders</h1>
      <p className="mt-1 text-cream/50">{orders.length} order(s) · live tracking & warranty</p>

      <div className="mt-8 space-y-4">
        {orders.map((o, i) => {
          const idx = stageIndex(o.status);
          const progress = idx / (ORDER_STAGES.length - 1);
          const delivered = o.status === "delivered";
          return (
            <motion.div key={o.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/orders/${o.id}`} className="card block p-5 transition-colors hover:border-gold/40">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex -space-x-3">
                      {o.items.slice(0, 3).map((it) => (
                        <img key={it.key} src={it.image} alt="" className="h-12 w-10 rounded-md border border-ink object-cover" />
                      ))}
                    </span>
                    <div>
                      <p className="font-semibold text-cream">{o.id}</p>
                      <p className="text-xs text-cream/45">{o.items.reduce((n, x) => n + x.qty, 0)} item(s) · {inr(o.total)}</p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${delivered ? "bg-emerald-500/15 text-emerald-300" : "bg-gold/15 text-gold"}`}>
                    {delivered ? <ShieldCheck size={14} /> : <Truck size={14} />}
                    {ORDER_STAGES[idx].label}
                  </span>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-line">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-gold to-gold-soft" />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-cream/45">
                  <span>via {o.courier} · {o.trackingNo}</span>
                  <span className="flex items-center gap-1 text-gold">Track <ArrowRight size={12} /></span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
