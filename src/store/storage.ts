import { createJSONStorage, type StateStorage } from "zustand/middleware";

// In-memory fallback used when localStorage is unavailable
// (test/node env, SSR, or private-mode browsers that throw).
const memory = new Map<string, string>();
const memoryStorage: StateStorage = {
  getItem: (k) => (memory.has(k) ? memory.get(k)! : null),
  setItem: (k, v) => void memory.set(k, v),
  removeItem: (k) => void memory.delete(k),
};

function resolve(): StateStorage {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      // probe (some browsers throw on access in private mode)
      const k = "__tw_probe__";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
      return window.localStorage;
    }
  } catch {
    /* fall through to memory */
  }
  return memoryStorage;
}

export const safeStorage = createJSONStorage(resolve);
