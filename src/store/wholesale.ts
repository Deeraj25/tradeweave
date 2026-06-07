import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WholesaleTier } from "../data/types";
import { safeStorage } from "./storage";

export const tierPrice = (tiers: WholesaleTier[], qty: number): number => {
  let price = tiers[0].pricePerUnit;
  for (const t of tiers) if (qty >= t.minQty) price = t.pricePerUnit;
  return price;
};

export type WLine = {
  key: string;
  id: string;
  name: string;
  image: string;
  qty: number;
  unitPrice: number;
  moq: number;
  tiers: WholesaleTier[];
};

type AddInput = {
  id: string;
  name: string;
  image: string;
  moq: number;
  tiers: WholesaleTier[];
};

type WState = {
  items: WLine[];
  addOrder: (p: AddInput) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

export const useWholesale = create<WState>()(
  persist(
    (set, get) => ({
      items: [],
      addOrder: (p) =>
        set((s) => {
          if (s.items.find((i) => i.id === p.id)) return s;
          const qty = p.moq;
          return {
            items: [
              ...s.items,
              { key: p.id, ...p, qty, unitPrice: tierPrice(p.tiers, qty) },
            ],
          };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          items: s.items.map((i) => {
            if (i.key !== key) return i;
            const q = Math.max(i.moq, qty);
            return { ...i, qty: q, unitPrice: tierPrice(i.tiers, q) };
          }),
        })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((n, i) => n + i.qty * i.unitPrice, 0),
      count: () => get().items.length,
    }),
    { name: "tw-wholesale", storage: safeStorage },
  ),
);
