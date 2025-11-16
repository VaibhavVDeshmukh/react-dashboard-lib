// components/PanelContainer.tsx
import React, { useRef } from "react";
import { LayoutItem } from "../types";
import { PanelChrome } from "../../panel-chrome/PanelChrome";

export function PanelContainer({
  item,
  cols,
  rowHeight,
  gap,
  editMode,
  onDragStart,
  onResizeStart,
  children,
}: {
  item: LayoutItem;
  cols: number;
  rowHeight: number;
  gap: number;
  editMode: boolean;
  onDragStart: (e: React.PointerEvent, id: string) => void;
  onResizeStart: (e: React.PointerEvent, id: string, dir: string) => void;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const colWidthPx = (containerWidth: number) => (containerWidth - (cols - 1) * gap) / cols;

  return (
    <div
      ref={ref}
      className="absolute"
      // consumers set style left/top/width/height via style attribute
      role="group"
      aria-roledescription="dashboard-panel"
      data-panel-id={item.id}
    >
      <div onPointerDown={(e) => onDragStart(e, item.id)}>
        <PanelChrome id={item.id} title={item.id} editMode={editMode}>
          {children}
        </PanelChrome>
      </div>

      {editMode && (
        <>
          {/* right handle */}
          <div onPointerDown={(e) => onResizeStart(e, item.id, "right")}
               className="absolute right-0 top-0 w-2 h-full cursor-e-resize" />
          {/* bottom-right corner */}
          <div onPointerDown={(e) => onResizeStart(e, item.id, "bottom-right")}
               className="absolute right-0 bottom-0 w-3 h-3 cursor-se-resize" />
          {/* ... other handles */}
        </>
      )}
    </div>
  );
}
