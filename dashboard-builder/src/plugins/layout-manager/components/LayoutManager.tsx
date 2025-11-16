// components/LayoutManager.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLayoutManager } from "../hooks/useLayoutManager";
import { PanelContainer } from "./PanelContainer";
import { DragLayer } from "./DragLayer";
import { gridToPx } from "../utils/grid";

export function LayoutManagerUI({
  initialItems,
  cols = { desktop: 12, tablet: 8, mobile: 4 },
  rowHeight = { desktop: 40, tablet: 36, mobile: 32 },
  gap = 8,
  adapter,
}: {
  initialItems: any[];
  cols?: { desktop: number; tablet: number; mobile: number };
  rowHeight?: { desktop: number; tablet: number; mobile: number };
  gap?: number;
  adapter?: any;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(1200);

  const lm = useLayoutManager({ adapter, initial: { items: initialItems, cols, rowHeight, gap, breakpoint: "desktop" } });

  // measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      setWidth(el.clientWidth);
    });
    obs.observe(el);
    setWidth(el.clientWidth);
    return () => obs.disconnect();
  }, []);

  const colWidth = useMemo(() => {
    const bp = lm.state.breakpoint;
    const colsCount = lm.state.cols[bp];
    return (width - (colsCount - 1) * gap) / colsCount;
  }, [width, lm.state, gap]);

  const toGrid = useCallback((px: number, py: number) => {
    return {
      col: Math.round(px / (colWidth + gap)),
      row: Math.round(py / (lm.state.rowHeight[lm.state.breakpoint] + gap))
    };
  }, [colWidth, gap, lm]);

  // pointer handling for drag: we attach pointermove on pointerdown and drive moveDrag using raf
  const rafRef = useRef<number | null>(null);
  const activePointer = useRef<{ x:number;y:number } | null>(null);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      activePointer.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          if (activePointer.current) {
            lm.moveDrag(activePointer.current.x, activePointer.current.y, toGrid);
          }
          rafRef.current = null;
        });
      }
    }
    // attach when dragging
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [lm, toGrid]);

  const onPanelDragStart = useCallback((e: React.PointerEvent, id: string) => {
    const item = lm.state.items.find(i=>i.id===id)!;
    item && lm.startDrag({
      id,
      mode: 'move',
      startPx: e.clientX,
      startPy: e.clientY,
      startItem: { ...item }
    });
    // set pointer capture
    (e.target as Element).setPointerCapture(e.pointerId);
    // attach global move/up to call lm.moveDrag / end
    function onMove(ev: PointerEvent) {
      lm.moveDrag(ev.clientX, ev.clientY, toGrid);
    }
    function onUp() {
      lm.endDrag();
      try { (e.target as Element).releasePointerCapture((e as any).pointerId); } catch {}
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [lm, toGrid]);

  const onResizeStart = useCallback((e: React.PointerEvent, id: string, dir: string) => {
    const item = lm.state.items.find(i=>i.id===id)!;
    lm.startResize({
      id,
      mode: 'resize',
      dir,
      startPx: e.clientX,
      startPy: e.clientY,
      startItem: { ...item }
    });
    (e.target as Element).setPointerCapture(e.pointerId);
    function onMove(ev: PointerEvent) {
      // compute delta in grid units (cols/rows)
      const dx = Math.round((ev.clientX - (e as any).clientX) / (colWidth + gap));
      const dy = Math.round((ev.clientY - (e as any).clientY) / (lm.state.rowHeight[lm.state.breakpoint] + gap));
      lm.moveResize(dx, dy);
    }
    function onUp() {
      lm.commit(true);
      lm.endDrag(); // clear
      try { (e.target as Element).releasePointerCapture((e as any).pointerId); } catch {}
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [lm, colWidth, gap]);

  // drop new items (example)
  const onDrop = useCallback((e: React.DragEvent) => {
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    const parsed = JSON.parse(data);
    const rect = containerRef.current!.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    lm.dropNewItem(parsed, px, py, colWidth, lm.state.rowHeight[lm.state.breakpoint], gap);
  }, [colWidth, gap, lm]);

  return (
    <div ref={containerRef} onDragOver={(e)=>e.preventDefault()} onDrop={onDrop} className="relative w-full h-full bg-red-500">
      {/* panels */}
      {lm.state.items.map(item => {
        const { x, y } = gridToPx(item.x, item.y, colWidth, lm.state.rowHeight[lm.state.breakpoint], gap);
        const widthPx = item.w * colWidth + (item.w - 1) * gap;
        const heightPx = item.h * lm.state.rowHeight[lm.state.breakpoint] + (item.h - 1) * gap;
        return (
          <div key={item.id} className="absolute transition-all" style={{ left: x, top: y, width: widthPx, height: heightPx }}>
            <PanelContainer
              item={item}
              cols={lm.state.cols[lm.state.breakpoint]}
              rowHeight={lm.state.rowHeight[lm.state.breakpoint]}
              gap={gap}
              editMode={true}
              onDragStart={onPanelDragStart}
              onResizeStart={onResizeStart}
            />
          </div>
        )
      })}

      {/* Drag preview layer (hook up preview from lm state if you keep one) */}
      <DragLayer visible={false} />
    </div>
  );
}
