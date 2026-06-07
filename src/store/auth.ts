import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeStorage } from "./storage";

export type User = { name: string; email?: string; phone?: string } | null;

type AuthState = {
  user: User;
  signIn: (u: NonNullable<User>) => void;
  signOut: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (u) => set({ user: u }),
      signOut: () => set({ user: null }),
    }),
    { name: "tw-auth", storage: safeStorage },
  ),
);
