import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  ShoppingBag,
  Briefcase,
  Sparkles,
  Truck,
  ShieldCheck,
  Store,
  Camera,
} from "lucide-react";
import Reveal from "../components/Reveal";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { compactInr } from "../lib/format";

const featured = products.slice(0, 8);
const collage = [
  "/catalog/bridal-lehenga.jpg",
  "/catalog/kanjeevaram-saree.jpg",
  "/catalog/royal-sherwani.jpg",
  "/catalog/evening-gown.jpg",
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const yArt1 = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const yArt2 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div>
      {/* ───────────────────── HERO ───────────────────── */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-24 pt-16 lg:grid-cols-2 lg:pb-32 lg:pt-24">
          <motion.div style={{ y: yText, opacity: heroOpacity }} className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-medium text-gold"
            >
              <Sparkles size={14} /> Direct B2B & Retail — no middlemen
            </motion.div>

            <h1 className="text-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Where trade <br />
              <span className="shimmer-gold">weaves together.</span>
            </h1>

            <p className="mt-6 max-w-md text-cream/60">
              From handloom heritage to modern essentials — Tradeweave connects makers and buyers
              directly. Shop retail with an AI fitting room, or buy wholesale at true factory prices.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/retail" className="btn-gold h-12">
                <ShoppingBag size={18} /> Shop Retail
              </Link>
              <Link to="/wholesale" className="btn-ghost h-12">
                <Briefcase size={18} /> Buy Wholesale <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-10 flex gap-8">
              {[
                ["12K+", "Products"],
                ["850+", "Verified sellers"],
                ["0%", "Middlemen"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="text-display text-2xl font-semibold text-gold">{n}</div>
                  <div className="text-xs text-cream/50">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* parallax collage */}
          <div className="relative hidden h-[520px] lg:block">
            <motion.img
              style={{ y: yArt1 }}
              src={collage[0]}
              alt=""
              className="absolute left-4 top-0 h-72 w-56 rounded-2xl border border-line object-cover shadow-2xl"
            />
            <motion.img
              style={{ y: yArt2 }}
              src={collage[1]}
              alt=""
              className="absolute right-6 top-12 h-80 w-60 rounded-2xl border border-gold/30 object-cover shadow-2xl"
            />
            <motion.img
              style={{ y: yArt2 }}
              src={collage[2]}
              alt=""
              className="absolute bottom-0 left-16 h-56 w-44 rounded-2xl border border-line object-cover shadow-2xl"
            />
            <motion.img
              style={{ y: yArt1 }}
              src={collage[3]}
              alt=""
              className="absolute bottom-6 right-0 h-48 w-40 rounded-2xl border border-line object-cover shadow-2xl"
            />
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl" />
          </div>
        </div>
      </section>

      {/* ──────────────── RETAIL vs WHOLESALE ──────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <h2 className="text-display text-3xl font-semibold sm:text-4xl">Two ways to weave.</h2>
          <p className="mt-2 max-w-lg text-cream/50">Pick your lane — both run on the same trusted network.</p>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <SplitPanel
            to="/retail"
            icon={<ShoppingBag size={20} />}
            title="Retail"
            blurb="Shop single pieces with fast checkout, an AI Try-On fitting room, and doorstep delivery."
            points={["AI Try-On Me", "Quick add by size", "Secure checkout"]}
            cta="Enter retail store"
          />
          <SplitPanel
            to="/wholesale"
            icon={<Briefcase size={20} />}
            title="Wholesale"
            blurb="Buy in bulk at tiered factory pricing. Request quotes and place orders — direct, no middlemen."
            points={["Tiered bulk pricing", "Low MOQs", "Instant quote requests"]}
            cta="Enter wholesale"
            gold
          />
        </div>
      </section>

      {/* ──────────────── FEATURED ──────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-display text-3xl font-semibold sm:text-4xl">Featured weaves</h2>
              <p className="mt-2 text-cream/50">Hover a piece to pick a size instantly.</p>
            </div>
            <Link to="/retail" className="hidden items-center gap-1 text-sm text-gold hover:underline sm:flex">
              View all <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* ──────────────── VALUE PROPS ──────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <h2 className="text-display text-3xl font-semibold sm:text-4xl">Built for the whole journey.</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ValueCard icon={<Sparkles size={20} />} title="No middlemen" body="Buy direct from makers — fairer prices for you, better margins for them." live />
          <ValueCard icon={<Camera size={20} />} title="AI Try-On Me" body="Upload a photo and get a size & suitability read before you buy." live />
          <ValueCard icon={<Truck size={20} />} title="Real-time tracking" body="Follow every order from packing to shipping to your door." soon />
          <ValueCard icon={<ShieldCheck size={20} />} title="Warranty support" body="Coverage and easy returns on eligible products." soon />
        </div>
        <Reveal delay={0.1}>
          <div className="card mt-6 flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <Store className="text-gold" />
              <p className="text-sm text-cream/70">
                <span className="font-semibold text-cream">Coming soon:</span> in-built POS billing for offline stores, delivery-partner network & seller payouts.
              </p>
            </div>
            <Link to="/admin" className="btn-ghost h-10 text-sm">Peek the seller dashboard</Link>
          </div>
        </Reveal>
      </section>

      {/* ──────────────── CTA STRIP ──────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-brand-gray to-ink p-10 text-center">
            <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
            <h3 className="text-display text-3xl font-semibold sm:text-4xl">Join the weave.</h3>
            <p className="mx-auto mt-3 max-w-md text-cream/60">
              Create your account in three quick steps and start trading today.
            </p>
            <Link to="/signup" className="btn-gold mt-6 h-12">
              Create your account <ArrowRight size={16} />
            </Link>
            <p className="mt-3 text-xs text-cream/40">{compactInr(12840000)}+ traded this season</p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function SplitPanel({
  to, icon, title, blurb, points, cta, gold,
}: {
  to: string; icon: React.ReactNode; title: string; blurb: string; points: string[]; cta: string; gold?: boolean;
}) {
  return (
    <Reveal>
      <Link
        to={to}
        className={`group relative block overflow-hidden rounded-3xl border p-8 transition-all hover:-translate-y-1 ${
          gold ? "border-gold/40 bg-gradient-to-br from-gold/10 to-transparent" : "border-line bg-brand-gray/60"
        }`}
      >
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/15 text-gold">{icon}</span>
        <h3 className="mt-5 text-display text-2xl font-semibold">{title}</h3>
        <p className="mt-2 max-w-sm text-sm text-cream/60">{blurb}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {points.map((p) => (
            <li key={p} className="rounded-full border border-line px-3 py-1 text-xs text-cream/70">{p}</li>
          ))}
        </ul>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-gold">
          {cta} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </Reveal>
  );
}

function ValueCard({
  icon, title, body, live, soon,
}: {
  icon: React.ReactNode; title: string; body: string; live?: boolean; soon?: boolean;
}) {
  return (
    <Reveal className="h-full">
      <div className="card h-full p-6">
        <div className="flex items-center justify-between">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/15 text-gold">{icon}</span>
          {live && <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">LIVE</span>}
          {soon && <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold">SOON</span>}
        </div>
        <h3 className="mt-4 font-semibold text-cream">{title}</h3>
        <p className="mt-1.5 text-sm text-cream/55">{body}</p>
      </div>
    </Reveal>
  );
}
