// components/DragLayer.tsx
import React, { useEffect, useRef } from "react";

export function DragLayer({ preview, visible }: { preview?: React.ReactNode; visible?: boolean }) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // placeholder if you want continuous animation
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!visible) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Render preview centered at pointer using absolute position logic provided by consumer */}
      {preview}
    </div>
  );
}
