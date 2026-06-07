import { AnimatePresence, motion } from "motion/react";
import { Check, Info, X } from "lucide-react";
import { useToast } from "../store/toast";

const tones = {
  gold: "border-gold/40 bg-brand-gray text-cream",
  success: "border-emerald-500/40 bg-emerald-950/60 text-emerald-100",
  error: "border-red-500/40 bg-red-950/60 text-red-100",
};

export default function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur ${tones[t.tone]}`}
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gold/20 text-gold">
              {t.tone === "error" ? <Info size={14} /> : <Check size={14} />}
            </span>
            <span className="text-sm font-medium">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="ml-1 text-cream/40 hover:text-cream">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
