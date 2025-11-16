// hooks/usePersist.ts
import { useEffect, useRef } from "react";
import type { PersistAdapter } from "../types";

export function usePersist(adapter: PersistAdapter | null, value: any, delay = 600) {
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!adapter) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      adapter.save(value).catch((err) => console.error("persist save failed", err));
    }, delay);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [adapter, value, delay]);
}
