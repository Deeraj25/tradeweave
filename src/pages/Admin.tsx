import { useState } from "react";
import { motion } from "motion/react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Package, IndianRupee, ShoppingCart, TrendingUp, LayoutDashboard } from "lucide-react";
import KpiCard from "../components/KpiCard";
import { kpis, salesByType, salesOverTime, categorySplit, topSellers } from "../data/sales";
import { inr, compactInr } from "../lib/format";

type Channel = "all" | "retail" | "wholesale";

const GOLD = "#D4A537";
const GOLD_SOFT = "#E6C566";
const CREAM = "#F5EFE6";

const tooltipStyle = {
  background: "#161616",
  border: "1px solid #262626",
  borderRadius: 12,
  color: CREAM,
  fontSize: 12,
};

export default function Admin() {
  const [channel, setChannel] = useState<Channel>("all");
  const k = kpis(channel);
  const byType = salesByType(channel);
  const overTime = salesOverTime(channel);
  const split = categorySplit(channel);
  const top = topSellers(channel);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
            <LayoutDashboard size={14} /> Seller / developer console
          </p>
          <h1 className="text-display mt-1 text-4xl font-semibold">Sales analytics</h1>
          <p className="mt-1 text-sm text-cream/50">What sold, which type, and how revenue is trending.</p>
        </div>
        <div className="flex rounded-xl border border-line bg-brand-gray p-1">
          {(["all", "retail", "wholesale"] as Channel[]).map((c) => (
            <button
              key={c}
              onClick={() => setChannel(c)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                channel === c ? "bg-gold text-ink" : "text-cream/60 hover:text-cream"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Units sold" value={k.units} icon={Package} delta="▲ trending up" />
        <KpiCard label="Revenue" value={k.revenue} icon={IndianRupee} format={compactInr} delta="▲ this season" />
        <KpiCard label="Orders" value={k.orders} icon={ShoppingCart} />
        <KpiCard label="Avg order value" value={k.aov} icon={TrendingUp} format={inr} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Units sold by type */}
        <Panel title="Units sold by dress type" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byType} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="type" tick={{ fill: "#9a9a9a", fontSize: 12 }} angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fill: "#9a9a9a", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(212,165,55,0.08)" }} />
              <Bar dataKey="units" radius={[6, 6, 0, 0]} fill={GOLD} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        {/* Category split donut */}
        <Panel title="Traditional vs Western">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={split} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3} stroke="none">
                {split.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? GOLD : GOLD_SOFT} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, color: CREAM }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        {/* Revenue over time */}
        <Panel title="Sales over time" className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={overTime} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#9a9a9a", fontSize: 12 }} />
              <YAxis tickFormatter={(v) => compactInr(v)} tick={{ fill: "#9a9a9a", fontSize: 12 }} width={70} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [inr(Number(v)), "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke={GOLD} strokeWidth={2} fill="url(#goldFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* Top sellers table */}
      <Panel title="Top selling types" className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-cream/45">
                <th className="py-3 pr-4 font-medium">#</th>
                <th className="py-3 pr-4 font-medium">Dress type</th>
                <th className="py-3 pr-4 text-right font-medium">Units sold</th>
                <th className="py-3 pr-4 text-right font-medium">Revenue</th>
                <th className="py-3 font-medium">Share</th>
              </tr>
            </thead>
            <tbody>
              {top.map((row, i) => {
                const maxUnits = top[0].units || 1;
                return (
                  <motion.tr
                    key={row.type}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="border-b border-line/60"
                  >
                    <td className="py-3 pr-4 text-gold">{i + 1}</td>
                    <td className="py-3 pr-4 font-medium text-cream">{row.type}</td>
                    <td className="py-3 pr-4 text-right text-cream">{row.units}</td>
                    <td className="py-3 pr-4 text-right text-cream">{inr(row.revenue)}</td>
                    <td className="py-3">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-ink">
                        <div className="h-full rounded-full bg-gold" style={{ width: `${(row.units / maxUnits) * 100}%` }} />
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function Panel({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`card p-5 ${className ?? ""}`}>
      <h3 className="mb-4 text-sm font-semibold text-cream/80">{title}</h3>
      {children}
    </div>
  );
}
