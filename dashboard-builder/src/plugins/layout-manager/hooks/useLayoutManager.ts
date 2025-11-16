// hooks/useLayoutManager.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import type { LayoutItem, LayoutState, Breakpoint, DragPayload, PersistAdapter } from "../types";
import { clamp, resolveCollisions } from "../utils/grid";
import { localPersistAdapter } from "./localPersistAdapter";

export function useLayoutManager(opts?: {
  initial?: LayoutState;
  adapter?: PersistAdapter | null;
  cols?: { desktop: number; tablet: number; mobile: number };
  rowHeight?: { desktop: number; tablet: number; mobile: number };
  gap?: number;
}) {
  const defaultState: LayoutState = opts?.initial ?? {
    items: [],
    cols: { desktop: 12, tablet: 8, mobile: 4 },
    rowHeight: { desktop: 40, tablet: 36, mobile: 32 },
    gap: opts?.gap ?? 8,
    breakpoint: "desktop",
  } as unknown as LayoutState;

  const adapter = opts?.adapter ?? localPersistAdapter();
  const [state, setState] = useState<LayoutState>(defaultState);
  const dragRef = useRef<DragPayload | null>(null);

  // load saved
  useEffect(() => {
    let mounted = true;
    adapter?.load().then((s) => {
      if (!mounted) return;
      if (s) setState(s);
    });
    return () => { mounted = false; };
  }, [adapter]);

  const addItem = useCallback((item: LayoutItem) => {
    setState((s) => ({ ...s, items: [...s.items, item] }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) }));
  }, []);

  const updateItem = useCallback((id: string, patch: Partial<LayoutItem>) => {
    setState((s) => ({ ...s, items: s.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }));
  }, []);

  const startDrag = useCallback((payload: DragPayload) => {
    dragRef.current = payload;
  }, []);

  const moveDrag = useCallback((clientX: number, clientY: number, toGrid: (px:number,py:number) => {col:number,row:number}) => {
    const d = dragRef.current;
    if (!d) return;
    // simplified: compute new x,y based on pointer offset and store preview on state (optimistic)
    const dx = clientX - d.startPx;
    const dy = clientY - d.startPy;

    const colRow = toGrid(d.startItem.x * 1 + dx, d.startItem.y * 1 + dy);
    // update the moving item in an ephemeral preview state (not yet committed)
    setState((s) => {
      const items = s.items.map((it) => (it.id === d.startItem.id ? { ...it, x: colRow.col, y: colRow.row } : it));
      // resolve collisions
      const moved = items.find((i)=>i.id===d.startItem.id)!;
      const resolved = resolveCollisions(items, moved);
      return { ...s, items: resolved };
    });
  }, []);

  const endDrag = useCallback(() => {
    dragRef.current = null;
  }, []);

  const startResize = useCallback((payload: DragPayload) => {
    dragRef.current = payload;
  }, []);

  const moveResize = useCallback((deltaW: number, deltaH: number) => {
    const d = dragRef.current;
    if (!d) return;
    setState((s) => {
      const items = s.items.map(it => {
        if (it.id !== d.startItem.id) return it;
        const newW = clamp(d.startItem.w + deltaW, d.startItem.minW ?? 1, 1000);
        const newH = clamp(d.startItem.h + deltaH, d.startItem.minH ?? 1, 1000);
        return { ...it, w: newW, h: newH };
      });
      return { ...s, items };
    });
  }, []);

  const commit = useCallback(async (persist = true) => {
    if (persist && adapter) await adapter.save(state);
  }, [state, adapter]);

  const switchBreakpoint = useCallback((bp: Breakpoint) => {
    setState((s) => ({ ...s, breakpoint: bp }));
  }, []);

  const dropNewItem = useCallback((item: LayoutItem, px: number, py: number, colWidth: number, rowHeight: number, gap: number) => {
    // snap to px grid -> compute x,y then add
    const col = Math.round(px / (colWidth + gap));
    const row = Math.round(py / (rowHeight + gap));
    addItem({ ...item, x: Math.max(0, col), y: Math.max(0, row) });
  }, [addItem]);

  const stackItem = useCallback((targetId: string, intoId: string) => {
    setState((s) => {
      const target = s.items.find(i => i.id===targetId);
      if (!target) return s;
      const into = s.items.find(i => i.id===intoId);
      if (!into) return s;
      // group by stack key
      const stackGroup = into.stackGroup ?? `${into.id}-stack`;
      return { ...s, items: s.items.map(it => it.id===targetId ? { ...it, stackGroup } : it) };
    });
  }, []);

  return {
    state,
    addItem,
    removeItem,
    updateItem,
    startDrag,
    moveDrag,
    endDrag,
    startResize,
    moveResize,
    commit,
    switchBreakpoint,
    dropNewItem,
    stackItem,
    setState, // expose for advanced uses
  };
}
