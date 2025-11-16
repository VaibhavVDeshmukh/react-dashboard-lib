// utils/grid.ts
import { LayoutItem } from "../types";

export function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

export function rectsOverlap(a: LayoutItem, b: LayoutItem) {
  return !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
}

/**
 * Basic collision resolver: attempt to push items down/right when overlapping the
 * moved item. This is deterministic and suitable for grid layouts.
 */
export function resolveCollisions(items: LayoutItem[], moving: LayoutItem): LayoutItem[] {
  const out = items.map((i) => ({ ...i }));
  const map = new Map(out.map((i) => [i.id, i]));
  const stack = [moving];

  while (stack.length) {
    const cur = stack.shift()!;
    for (const it of out) {
      if (it.id === cur.id) continue;
      if (rectsOverlap(cur, it)) {
        // push it below cur (simple strategy)
        const newY = cur.y + cur.h;
        if (newY !== it.y) {
          const updated = { ...it, y: newY };
          map.set(it.id, updated);
          // update out and push to stack to catch cascading collisions
          const idx = out.findIndex((o) => o.id === it.id);
          out[idx] = updated;
          stack.push(updated);
        }
      }
    }
  }
  return out;
}

/** Snap pixel->grid col/row */
export function pxToGrid(px: number, py: number, colWidth: number, rowHeight: number, gap: number) {
  const gridCol = Math.round((px) / (colWidth + gap));
  const gridRow = Math.round((py) / (rowHeight + gap));
  return { col: Math.max(0, gridCol), row: Math.max(0, gridRow) };
}

/** Grid->px */
export function gridToPx(col: number, row: number, colWidth: number, rowHeight: number, gap: number) {
  const x = col * (colWidth + gap);
  const y = row * (rowHeight + gap);
  return { x, y };
}
