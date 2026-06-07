import type { Sale } from "./types";
import { products, getProduct } from "./products";

// Deterministic PRNG so charts are stable across reloads.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateSales(): Sale[] {
  const rand = mulberry32(20260607);
  const out: Sale[] = [];
  const now = new Date("2026-06-01T00:00:00Z");
  let n = 0;

  // ~6 months of history
  for (let monthsAgo = 5; monthsAgo >= 0; monthsAgo--) {
    const month = new Date(now);
    month.setMonth(month.getMonth() - monthsAgo);

    // a number of orders per month, trending upward over time
    const orders = 14 + Math.round((5 - monthsAgo) * 2 + rand() * 6);
    for (let i = 0; i < orders; i++) {
      const p = products[Math.floor(rand() * products.length)];
      const day = 1 + Math.floor(rand() * 27);
      const date = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), day));

      // wholesale-capable products sometimes sell in bulk
      const canWholesale = !!p.wholesaleTiers;
      const isWholesale = canWholesale && rand() < 0.42;

      let qty: number;
      let revenue: number;
      if (isWholesale) {
        const tier = p.wholesaleTiers![Math.floor(rand() * p.wholesaleTiers!.length)];
        qty = tier.minQty + Math.floor(rand() * tier.minQty);
        revenue = qty * tier.pricePerUnit;
      } else {
        qty = 1 + Math.floor(rand() * 3);
        revenue = qty * p.retailPrice;
      }

      out.push({
        id: `S${(++n).toString().padStart(4, "0")}`,
        productId: p.id,
        type: p.type,
        channel: isWholesale ? "wholesale" : "retail",
        qty,
        revenue,
        date: date.toISOString().slice(0, 10),
      });
    }
  }
  return out;
}

export const sales: Sale[] = generateSales();

type ChannelFilter = "all" | "retail" | "wholesale";
const pick = (channel: ChannelFilter) =>
  channel === "all" ? sales : sales.filter((s) => s.channel === channel);

export function kpis(channel: ChannelFilter = "all") {
  const rows = pick(channel);
  const units = rows.reduce((n, s) => n + s.qty, 0);
  const revenue = rows.reduce((n, s) => n + s.revenue, 0);
  const orders = rows.length;
  const aov = orders ? Math.round(revenue / orders) : 0;
  return { units, revenue, orders, aov };
}

export function salesByType(channel: ChannelFilter = "all") {
  const rows = pick(channel);
  const map = new Map<string, { type: string; units: number; revenue: number }>();
  for (const s of rows) {
    const e = map.get(s.type) ?? { type: s.type, units: 0, revenue: 0 };
    e.units += s.qty;
    e.revenue += s.revenue;
    map.set(s.type, e);
  }
  return [...map.values()].sort((a, b) => b.units - a.units);
}

export function salesOverTime(channel: ChannelFilter = "all") {
  const rows = pick(channel);
  const map = new Map<string, { month: string; units: number; revenue: number }>();
  for (const s of rows) {
    const month = s.date.slice(0, 7); // YYYY-MM
    const e = map.get(month) ?? { month, units: 0, revenue: 0 };
    e.units += s.qty;
    e.revenue += s.revenue;
    map.set(month, e);
  }
  return [...map.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((e) => ({
      ...e,
      label: new Date(e.month + "-01").toLocaleString("en-US", { month: "short" }),
    }));
}

export function categorySplit(channel: ChannelFilter = "all") {
  const rows = pick(channel);
  let traditional = 0;
  let western = 0;
  for (const s of rows) {
    const origin = getProduct(s.productId)?.origin ?? "western";
    if (origin === "traditional") traditional += s.qty;
    else western += s.qty;
  }
  return [
    { name: "Traditional", value: traditional },
    { name: "Western", value: western },
  ];
}

export function topSellers(channel: ChannelFilter = "all", limit = 5) {
  return salesByType(channel).slice(0, limit);
}
