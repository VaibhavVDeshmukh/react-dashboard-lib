// types.ts
export type Breakpoint = "desktop" | "tablet" | "mobile";

export interface LayoutItem {
  id: string;
  x: number; // grid col
  y: number; // grid row
  w: number; // cols span
  h: number; // rows span
  minW?: number;
  minH?: number;
  z?: number; // stacking order
  stackGroup?: string | null; // panels that stack into tabs
  data?: any;
}

export interface LayoutState {
  items: LayoutItem[];
  cols: Record<Breakpoint, number>;
  rowHeight: Record<Breakpoint, number>;
  gap: number;
  breakpoint: Breakpoint;
}

export type DragMode = "move" | "resize" | null;

export interface DragPayload {
  id: string;
  mode: DragMode;
  dir?: string; // for resize: 'left'|'right'|'top'|'bottom' or corners like 'top-right'
  startPx: number;
  startPy: number;
  startItem: LayoutItem;
  pointerId?: number;
}

export interface PersistAdapter {
  load: () => Promise<LayoutState | null>;
  save: (state: LayoutState) => Promise<void>;
}
