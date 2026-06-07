import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, CheckCircle2, FileText } from "lucide-react";

export type QuotePrefill = {
  product?: string;
  qty?: number;
  moq?: number;
};

export default function QuoteModal({
  open,
  onClose,
  prefill,
}: {
  open: boolean;
  onClose: () => void;
  prefill?: QuotePrefill;
}) {
  const [business, setBusiness] = useState("");
  const [gst, setGst] = useState("");
  const [contact, setContact] = useState("");
  const [qty, setQty] = useState<string>(prefill?.qty ? String(prefill.qty) : "");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ref, setRef] = useState<string | null>(null);

  const reset = () => {
    setBusiness(""); setGst(""); setContact(""); setQty(""); setMessage(""); setErrors({}); setRef(null);
  };

  // sync prefill + clear stale state each time the modal opens
  useEffect(() => {
    if (open) {
      setQty(prefill?.qty ? String(prefill.qty) : "");
      setErrors({});
      setRef(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => { reset(); onClose(); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!business.trim()) errs.business = "Business name is required";
    if (!/^[0-9A-Z]{15}$/i.test(gst.trim())) errs.gst = "Enter a valid 15-character GST number";
    if (!/^\S+@\S+\.\S+$/.test(contact) && !/^\+?\d[\d\s]{8,}$/.test(contact)) errs.contact = "Enter a valid email or phone";
    const minQ = prefill?.moq ?? 1;
    if (!qty || Number(qty) < minQ) errs.qty = `Quantity must be at least ${minQ}`;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const code = "TW-Q-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setRef(code);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-ink/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-gold/30 bg-brand-gray shadow-2xl"
          >
            {ref ? (
              <div className="grid place-items-center gap-3 p-10 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14 }}>
                  <CheckCircle2 size={64} className="text-emerald-400" />
                </motion.div>
                <h3 className="text-display text-2xl font-semibold">Enquiry submitted</h3>
                <p className="text-cream/60">Our B2B team will respond within 24 hours.</p>
                <div className="mt-1 rounded-xl border border-gold/40 bg-ink px-5 py-3">
                  <p className="text-xs uppercase tracking-widest text-cream/50">Reference</p>
                  <p className="text-display text-xl font-semibold text-gold">{ref}</p>
                </div>
                <button onClick={close} className="btn-gold mt-3 h-11 px-8">Done</button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="flex items-center justify-between border-b border-line p-5">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-gold" />
                    <h3 className="text-display text-lg font-semibold">Catalog enquiry / quote</h3>
                  </div>
                  <button type="button" onClick={close} className="text-cream/40 hover:text-cream"><X size={20} /></button>
                </div>

                <div className="space-y-4 p-5">
                  {prefill?.product && (
                    <div className="rounded-lg border border-line bg-ink px-3 py-2 text-sm text-cream/70">
                      Product: <span className="text-gold">{prefill.product}</span>
                      {prefill.moq ? <span className="text-cream/40"> · MOQ {prefill.moq}</span> : null}
                    </div>
                  )}
                  <Field label="Business name" error={errors.business}>
                    <input value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Mehta Textiles Pvt Ltd" className={inputCls} />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="GST number" error={errors.gst}>
                      <input value={gst} onChange={(e) => setGst(e.target.value)} placeholder="22AAAAA0000A1Z5" className={inputCls} />
                    </Field>
                    <Field label="Quantity" error={errors.qty}>
                      <input value={qty} onChange={(e) => setQty(e.target.value.replace(/\D/g, ""))} placeholder={String(prefill?.moq ?? 50)} className={inputCls} />
                    </Field>
                  </div>
                  <Field label="Contact (email or phone)" error={errors.contact}>
                    <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="buyer@business.com" className={inputCls} />
                  </Field>
                  <Field label="Message (optional)">
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Tell us about colors, customization, timelines…" className={`${inputCls} resize-none py-2`} />
                  </Field>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-line p-5">
                  <button type="button" onClick={close} className="btn-ghost h-11 px-5">Cancel</button>
                  <button type="submit" className="btn-gold h-11 px-6">Submit enquiry</button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const inputCls =
  "h-11 w-full rounded-lg border border-line bg-ink px-3 text-sm text-cream placeholder:text-cream/30 focus:border-gold/60 focus:outline-none";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-cream">{label}</span>
      {children}
      {error && <span className="block text-xs text-red-400">{error}</span>}
    </label>
  );
}
