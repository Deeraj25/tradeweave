import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import type { LucideIcon } from "lucide-react";

export default function KpiCard({
  label,
  value,
  icon: Icon,
  format = (n) => n.toLocaleString("en-IN"),
  delta,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  format?: (n: number) => string;
  delta?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1100;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="card relative overflow-hidden p-5"
    >
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gold/10 blur-2xl" />
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-cream/50">{label}</span>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold/15 text-gold">
          <Icon size={16} />
        </span>
      </div>
      <div className="mt-3 text-display text-3xl font-semibold text-cream">{format(display)}</div>
      {delta && <div className="mt-1 text-xs text-emerald-400">{delta}</div>}
    </motion.div>
  );
}
