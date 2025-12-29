import React, { useCallback, useEffect, useState } from "react";
import {
  Responsive,
  WidthProvider,
  Layout,
  Layouts,
} from "react-grid-layout";

const ResponsiveGrid = WidthProvider(Responsive);

/** Strong generic T = panel data payload */
export interface GenericPanelData<T = unknown> {
  id: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  data?: T;
}

export interface LayoutManagerProps<T = unknown> {
  /** Panels to render */
  initialPanels: GenericPanelData<T>[];

  /** Required: how to render panel contents */
  renderPanel: (panel: GenericPanelData<T>) => React.ReactNode;

  /** Optional wrapper (PanelChrome, Card, etc) */
  panelWrapper?: (
    panel: GenericPanelData<T>,
    content: React.ReactNode
  ) => React.ReactNode;

  /** Drag / Resize mode */
  editMode?: boolean;

  /** When RGL layout updates */
  onLayoutChange?: (layout: Layout[]) => void;

  /** When user adds a panel (drag-drop or custom logic) */
  onPanelAdd?: (panel: GenericPanelData<T>) => void;

  /** When panel removed */
  onPanelRemove?: (id: string) => void;

  /** Breakpoint system */
  breakpoints?: { [key: string]: number };
  cols?: { [key: string]: number };

  rowHeight?: number;
  margin?: [number, number];
}

/**
 * ULTRA-GENERIC RESPONSIVE LAYOUT MANAGER
 * Works with ANY dashboard widgets + ANY UX system.
 */
export function LayoutManager<T = unknown>({
  initialPanels,
  renderPanel,
  panelWrapper,
  editMode = true,
  onLayoutChange,
  onPanelAdd,
  onPanelRemove,

  // Grid defaults
  rowHeight = 40,
  margin = [8, 8],
  breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480 },
  cols = { lg: 12, md: 10, sm: 6, xs: 4 },
}: LayoutManagerProps<T>) {
  const [layout, setLayout] = useState<Layout[]>([]);

  /** Sync initialPanels → RGL layout */
  useEffect(() => {
    const next = initialPanels.map((p, i) => ({
      i: p.id,
      x: p.x ?? (i % 3) * 4,
      y: p.y ?? Math.floor(i / 3) * 4,
      w: p.w ?? 4,
      h: p.h ?? 4,
    }));
    setLayout(next);
  }, [initialPanels]);

  /** Layout updates from RGL */
  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      setLayout(newLayout);
      onLayoutChange?.(newLayout);
    },
    [onLayoutChange]
  );

  /** Panel remove helper */
  const removePanel = useCallback(
    (id: string) => {
      onPanelRemove?.(id);
      setLayout((prev) => prev.filter((l) => l.i !== id));
    },
    [onPanelRemove]
  );

  /** Render all panels */
  const renderAllPanels = layout.map((item) => {
    const panel = initialPanels.find((p) => p.id === item.i);

    if (!panel) return null; // should not happen

    const content = renderPanel(panel);

    const wrapped = panelWrapper
      ? panelWrapper(panel, content)
      : content;

    return (
      <div key={item.i} data-grid={item} className="h-full w-full">
        {wrapped}
      </div>
    );
  });

  return (
    <div className="w-full h-full">
      <ResponsiveGrid
        className="layout"
        layouts={{ lg: layout } as Layouts}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={rowHeight}
        margin={margin}
        isDraggable={editMode}
        isResizable={editMode}
        draggableHandle=".panel-drag-handle"
        draggableCancel=".react-draggable-cancel"
        onLayoutChange={handleLayoutChange}
      >
        {renderAllPanels}
      </ResponsiveGrid>
    </div>
  );
}
