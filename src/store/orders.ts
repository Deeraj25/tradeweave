import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeStorage } from "./storage";
import { hashString } from "../lib/hash";
import type { CartLine } from "./cart";

export type OrderStatus = "placed" | "packing" | "shipped" | "out_for_delivery" | "delivered";

export const ORDER_STAGES: { key: OrderStatus; label: string; blurb: string }[] = [
  { key: "placed", label: "Order placed", blurb: "We’ve received your order." },
  { key: "packing", label: "Packing", blurb: "Your items are being hand-packed at the maker’s unit." },
  { key: "shipped", label: "Shipped", blurb: "Picked up by the courier and on the move." },
  { key: "out_for_delivery", label: "Out for delivery", blurb: "Your package is out with the delivery partner." },
  { key: "delivered", label: "Delivered", blurb: "Delivered. Enjoy — and you’re covered by warranty." },
];

const COURIERS = ["WeaveExpress", "Bluewing Logistics", "Saffron Speed", "MetroRunner"];
const CITIES = ["Surat Hub", "Mumbai Sort Center", "Pune Facility", "Bengaluru Hub", "Delhi Gateway"];

export type Claim = { id: string; reason: string; createdAt: number };

export type Order = {
  id: string;
  items: CartLine[];
  total: number;
  placedAt: number;
  status: OrderStatus;
  courier: string;
  trackingNo: string;
  originCity: string;
  destCity: string;
  etaDays: number;
  warrantyMonths: number;
  stageTimes: Partial<Record<OrderStatus, number>>;
  claim?: Claim;
};

export const stageIndex = (s: OrderStatus) => ORDER_STAGES.findIndex((x) => x.key === s);
export const nextStatus = (s: OrderStatus): OrderStatus | null => {
  const i = stageIndex(s);
  return i < ORDER_STAGES.length - 1 ? ORDER_STAGES[i + 1].key : null;
};

let seq = 0;

type OrdersState = {
  orders: Order[];
  placeOrder: (items: CartLine[], total: number) => Order;
  advance: (id: string) => void;
  setStatus: (id: string, status: OrderStatus) => void;
  raiseClaim: (id: string, reason: string) => string;
  getOrder: (id: string) => Order | undefined;
};

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      placeOrder: (items, total) => {
        const n = ++seq + get().orders.length;
        const id = "TW-ORD-" + (1000 + (hashString(items.map((i) => i.key).join(",") + n) % 9000));
        const seed = hashString(id);
        const order: Order = {
          id,
          items,
          total,
          placedAt: Date.now(),
          status: "placed",
          courier: COURIERS[seed % COURIERS.length],
          trackingNo: "TW" + (seed % 1_000_000).toString().padStart(6, "0") + "IN",
          originCity: CITIES[seed % CITIES.length],
          destCity: "Your address",
          etaDays: 3 + (seed % 4),
          warrantyMonths: 6,
          stageTimes: { placed: Date.now() },
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
      },
      advance: (id) =>
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.id !== id) return o;
            const ns = nextStatus(o.status);
            if (!ns) return o;
            return { ...o, status: ns, stageTimes: { ...o.stageTimes, [ns]: Date.now() } };
          }),
        })),
      setStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id ? { ...o, status, stageTimes: { ...o.stageTimes, [status]: Date.now() } } : o,
          ),
        })),
      raiseClaim: (id, reason) => {
        const claimId = "TW-WC-" + Math.random().toString(36).slice(2, 8).toUpperCase();
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id ? { ...o, claim: { id: claimId, reason, createdAt: Date.now() } } : o,
          ),
        }));
        return claimId;
      },
      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: "tw-orders", storage: safeStorage },
  ),
);
