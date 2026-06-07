import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Size } from "../data/types";
import { safeStorage } from "./storage";

export type CartLine = {
  key: string;
  id: string;
  name: string;
  image: string;
  size: Size | string;
  price: number;
  qty: number;
};

type CartInput = Omit<CartLine, "key" | "qty">;

type CartState = {
  items: CartLine[];
  add: (item: CartInput, qty?: number) => void;
  updateQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) =>
        set((s) => {
          const key = `${item.id}__${item.size}`;
          const existing = s.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.key === key ? { ...i, qty: i.qty + qty } : i,
              ),
            };
          }
          return { items: [...s.items, { ...item, key, qty }] };
        }),
      updateQty: (key, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.key !== key)
              : s.items.map((i) => (i.key === key ? { ...i, qty } : i)),
        })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.qty * i.price, 0),
    }),
    { name: "tw-cart", storage: safeStorage },
  ),
);
