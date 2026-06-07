import { motion } from "motion/react";
import { SOURCES, type Source } from "../../data/outfits";
import { profile } from "../../data/profile";
import { fadeUp, stagger } from "../../lib/motion";
import Avatar from "./Avatar";

export default function Hero({
  active,
  onToggle,
}: {
  active: Set<Source>;
  onToggle: (s: Source) => void;
}) {
  return (
    <motion.section
      variants={stagger(0.08, 0.05)}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 sm:pt-14"
    >
      <motion.p variants={fadeUp} className="mb-3 text-xs uppercase tracking-[0.3em] text-gold/80">
        Personalised feed
      </motion.p>
      <motion.h1
        variants={fadeUp}
        className="text-display max-w-3xl text-4xl font-semibold leading-[1.05] text-cream sm:text-5xl md:text-6xl"
      >
        Outfits curated for your <span className="shimmer-gold">colour &amp; structure</span>
      </motion.h1>

      <motion.div variants={fadeUp} className="mt-5 flex items-center gap-3 text-sm text-cream/70">
        <Avatar size={34} />
        <span>
          Tuned to <span className="text-cream">{profile.name}'s {profile.season}</span> palette ·{" "}
          {profile.faceShape} face · {profile.hair} hair
        </span>
      </motion.div>

      <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs uppercase tracking-widest text-cream/40">Sources</span>
        {SOURCES.map((s) => {
          const on = active.has(s);
          return (
            <button
              key={s}
              onClick={() => onToggle(s)}
              className={`rounded-full border px-3 py-1 text-sm transition-all ${
                on
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-line text-cream/50 hover:border-cream/40 hover:text-cream/80"
              }`}
            >
              {s}
            </button>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
