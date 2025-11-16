// hooks/localPersistAdapter.ts
import { PersistAdapter, LayoutState } from "../types";

export const localPersistAdapter = (key = "layout_v1"): PersistAdapter => ({
  async load() {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as LayoutState;
    } catch { return null; }
  },
  async save(state) {
    localStorage.setItem(key, JSON.stringify(state));
  },
});
