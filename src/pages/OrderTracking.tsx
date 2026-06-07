import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Package, PackageCheck, Truck, MapPin, Home, ShieldCheck, Clock, Copy,
  ChevronLeft, CheckCircle2, BadgeCheck, Boxes, Send, X,
} from "lucide-react";
import { useOrders, ORDER_STAGES, stageIndex, type OrderStatus } from "../store/orders";
import { useToast } from "../store/toast";
import { inr } from "../lib/format";

const STAGE_ICON: Record<OrderStatus, React.ReactNode> = {
  placed: <PackageCheck size={18} />,
  packing: <Boxes size={18} />,
  shipped: <Package size={18} />,
  out_for_delivery: <Truck size={18} />,
  delivered: <Home size={18} />,
};

export default function OrderTracking() {
  const { id } = useParams();
  const order = useOrders((s) => s.orders.find((o) => o.id === id));
  const advance = useOrders((s) => s.advance);
  const raiseClaim = useOrders((s) => s.raiseClaim);
  const push = useToast((s) => s.push);

  const [live, setLive] = useState(true);
  const [claimOpen, setClaimOpen] = useState(false);

  const status = order?.status;
  // Live auto-advance for the demo "real-time" feel.
  useEffect(() => {
    if (!order || !live || status === "delivered") return;
    const t = setInterval(() => advance(order.id), 4200);
    return () => clearInterval(t);
  }, [order, live, status, advance]);

  if (!order) {
    return (
      <div className="mx-auto grid max-w-md place-items-center gap-4 px-6 py-32 text-center">
        <h1 className="text-display text-3xl">Order not found</h1>
        <Link to="/orders" className="btn-gold h-11">View your orders</Link>
      </div>
    );
  }

  const idx = stageIndex(order.status);
  const progress = idx / (ORDER_STAGES.length - 1);
  const delivered = order.status === "delivered";
  const eta = new Date(order.placedAt + order.etaDays * 86400000);
  const warrantyEnd = new Date(order.placedAt + order.warrantyMonths * 30 * 86400000);
  const current = ORDER_STAGES[idx];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link to="/orders" className="mb-6 flex items-center gap-1 text-sm text-cream/50 hover:text-gold">
        <ChevronLeft size={16} /> All orders
      </Link>

      {/* header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">Live tracking</p>
          <h1 className="text-display mt-1 text-3xl font-semibold sm:text-4xl">Order {order.id}</h1>
          <p className="mt-1 text-sm text-cream/50">
            {order.items.reduce((n, i) => n + i.qty, 0)} item(s) · {inr(order.total)} · via {order.courier}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${delivered ? "bg-emerald-500/15 text-emerald-300" : "bg-gold/15 text-gold"}`}>
            <span className={`h-2 w-2 rounded-full ${delivered ? "bg-emerald-400" : "animate-pulse bg-gold"}`} />
            {current.label}
          </span>
        </div>
      </div>

      {/* route map */}
      <div className="card mt-6 overflow-hidden p-6">
        <div className="mb-2 flex items-center justify-between text-xs text-cream/50">
          <span className="flex items-center gap-1"><MapPin size={13} className="text-gold" /> {order.originCity}</span>
          <span className="flex items-center gap-1">{order.destCity} <Home size={13} className="text-gold" /></span>
        </div>
        <div className="relative h-16">
          {/* base track */}
          <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
          {/* progress track */}
          <motion.div
            className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-gold to-gold-soft"
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {/* moving vehicle */}
          <motion.div
            className="absolute top-1/2 z-10 -translate-y-1/2"
            initial={false}
            animate={{ left: `calc(${progress * 100}% - 16px)` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-ink shadow-lg shadow-gold/30">
              {delivered ? <CheckCircle2 size={18} /> : <Truck size={18} />}
            </span>
          </motion.div>
          {/* endpoints */}
          <span className="absolute left-0 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-line bg-brand-gray text-gold"><Boxes size={13} /></span>
          <span className={`absolute right-0 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full border ${delivered ? "border-emerald-500/50 text-emerald-300" : "border-line text-cream/40"} bg-brand-gray`}><Home size={13} /></span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-cream/60"><Clock size={14} className="text-gold" />
            {delivered ? "Delivered" : <>ETA {eta.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</>}
          </span>
          <button
            onClick={() => { navigator.clipboard?.writeText(order.trackingNo); push("Tracking number copied"); }}
            className="flex items-center gap-1.5 text-cream/50 hover:text-gold"
          >
            <Copy size={13} /> {order.trackingNo}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* vertical timeline */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-display text-lg font-semibold">Journey</h2>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-cream/50">
              <span className={`h-2 w-2 rounded-full ${live && !delivered ? "animate-pulse bg-emerald-400" : "bg-cream/30"}`} />
              <input type="checkbox" checked={live} onChange={(e) => setLive(e.target.checked)} className="accent-[var(--color-gold)]" />
              Live updates
            </label>
          </div>

          <ol className="relative">
            {ORDER_STAGES.map((stage, i) => {
              const reached = i <= idx;
              const isCurrent = i === idx;
              const time = order.stageTimes[stage.key];
              return (
                <li key={stage.key} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < ORDER_STAGES.length - 1 && (
                    <span className={`absolute left-[18px] top-9 h-[calc(100%-1.5rem)] w-0.5 ${i < idx ? "bg-gold" : "bg-line"}`} />
                  )}
                  <motion.span
                    initial={false}
                    animate={isCurrent && !delivered ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                    transition={isCurrent && !delivered ? { repeat: Infinity, duration: 1.8 } : {}}
                    className={`z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border ${
                      reached ? "border-gold bg-gold text-ink" : "border-line bg-brand-gray text-cream/40"
                    }`}
                  >
                    {STAGE_ICON[stage.key]}
                  </motion.span>
                  <div className="pt-1">
                    <p className={`font-medium ${reached ? "text-cream" : "text-cream/40"}`}>{stage.label}</p>
                    <p className="text-sm text-cream/45">{stage.blurb}</p>
                    {time && (
                      <p className="mt-0.5 text-xs text-gold/80">
                        {new Date(time).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {!delivered && (
            <button onClick={() => advance(order.id)} className="btn-ghost mt-2 h-10 text-sm">
              <Send size={14} /> Simulate next update
            </button>
          )}
        </div>

        {/* side: items + warranty */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="mb-3 text-sm font-semibold text-cream/80">In this order</h3>
            <div className="space-y-3">
              {order.items.map((it) => (
                <div key={it.key} className="flex items-center gap-3">
                  <img src={it.image} alt={it.name} className="h-14 w-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-cream">{it.name}</p>
                    <p className="text-xs text-cream/45">Size {it.size} · Qty {it.qty}</p>
                  </div>
                  <span className="text-sm font-medium text-gold">{inr(it.price * it.qty)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* warranty */}
          <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-brand-gray to-ink p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-gold" />
              <h3 className="text-display text-lg font-semibold">Warranty</h3>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-emerald-300">
              <BadgeCheck size={15} /> {order.warrantyMonths}-month cover active
            </div>
            <p className="mt-1 text-xs text-cream/50">
              Valid until {warrantyEnd.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.
              Covers stitching, fabric and colour defects.
            </p>

            {order.claim ? (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
                <p className="text-sm font-medium text-emerald-300">Claim raised · {order.claim.id}</p>
                <p className="text-xs text-cream/55">“{order.claim.reason}” — our team will reach out within 24h.</p>
              </div>
            ) : (
              <button
                onClick={() => setClaimOpen(true)}
                disabled={!delivered}
                className="btn-gold mt-4 h-11 w-full disabled:cursor-not-allowed disabled:opacity-40"
              >
                Raise a warranty / return claim
              </button>
            )}
            {!delivered && !order.claim && (
              <p className="mt-2 text-center text-[11px] text-cream/35">Available once delivered.</p>
            )}
          </div>
        </div>
      </div>

      <ClaimModal
        open={claimOpen}
        onClose={() => setClaimOpen(false)}
        onSubmit={(reason) => {
          const ref = raiseClaim(order.id, reason);
          setClaimOpen(false);
          push(`Warranty claim ${ref} submitted`, "success");
        }}
      />
    </div>
  );
}

const REASONS = ["Loose stitching", "Fabric defect", "Colour bleeding", "Wrong size delivered", "Damaged in transit"];

function ClaimModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (reason: string) => void }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [note, setNote] = useState("");
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-ink/80 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-gold/30 bg-brand-gray"
          >
            <div className="flex items-center justify-between border-b border-line p-5">
              <h3 className="text-display text-lg font-semibold">Warranty / return claim</h3>
              <button onClick={onClose} className="text-cream/40 hover:text-cream"><X size={20} /></button>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <p className="mb-2 text-sm font-medium">What went wrong?</p>
                <div className="flex flex-wrap gap-2">
                  {REASONS.map((r) => (
                    <button key={r} onClick={() => setReason(r)} className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${reason === r ? "border-gold bg-gold/10 text-gold" : "border-line text-cream/60 hover:border-gold/50"}`}>{r}</button>
                  ))}
                </div>
              </div>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Add any details (optional)…" className="w-full resize-none rounded-lg border border-line bg-ink px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold/60 focus:outline-none" />
            </div>
            <div className="flex justify-end gap-3 border-t border-line p-5">
              <button onClick={onClose} className="btn-ghost h-11 px-5">Cancel</button>
              <button onClick={() => onSubmit(note.trim() ? `${reason} — ${note.trim()}` : reason)} className="btn-gold h-11 px-6">Submit claim</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
