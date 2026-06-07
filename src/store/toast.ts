import { create } from "zustand";

export type Toast = { id: number; message: string; tone: "gold" | "success" | "error" };

type ToastState = {
  toasts: Toast[];
  push: (message: string, tone?: Toast["tone"]) => void;
  dismiss: (id: number) => void;
};

let seq = 0;

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  push: (message, tone = "gold") => {
    const id = ++seq;
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 2600);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
