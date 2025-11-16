import React, { useState, useRef, useCallback, useEffect } from "react";
import { PanelMenu } from "./PanelMenu";
import { PanelLoader } from "./PanelLoader";
import { PanelError } from "./PanelError";
import { cn } from "../../utils/cn";

interface PanelChromeProps {
  id: string;
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: string | null;
  draggable?: boolean;
  editMode?: boolean;
  theme?: "light" | "dark" | "system"; // <— ADDED
  children?: React.ReactNode;
  menuItems?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }>;
}

/** FULL RESPONSIVE + RESIZABLE + THEME (LIGHT/DARK/SYSTEM) */
export function PanelChrome({
  id,
  title,
  description,
  isLoading,
  error,
  draggable = true,
  editMode = false,
  theme = "system",
  children,
  menuItems,
}: PanelChromeProps) {
  const MIN_WIDTH = 180;
  const MIN_HEIGHT = 120;

  const panelRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  // Track system theme
  const [isDark, setIsDark] = useState(
    theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  // Listen to system theme changes
  useEffect(() => {
    if (theme !== "system") {
      setIsDark(theme === "dark");
      return;
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);

    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [theme]);

  // Panel Size
  const [size, setSize] = useState({ width: 350, height: 250 });

  // Resize Data
  const resizeRef = useRef<{
    dir: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  /** Start resizing */
  const onResizeStart = (e: React.PointerEvent, dir: string) => {
    e.preventDefault();
    e.stopPropagation();

    resizeRef.current = {
      dir,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
    };

    window.addEventListener("pointermove", onResizeMove);
    window.addEventListener("pointerup", onResizeStop);
  };

  /** Resizing logic */
  const onResizeMove = useCallback((e: PointerEvent) => {
    if (!resizeRef.current) return;

    const { dir, startX, startY, startWidth, startHeight } = resizeRef.current;

    let newWidth = startWidth;
    let newHeight = startHeight;

    if (dir.includes("right")) newWidth += e.clientX - startX;
    if (dir.includes("left")) newWidth -= e.clientX - startX;

    if (dir.includes("bottom")) newHeight += e.clientY - startY;
    if (dir.includes("top")) newHeight -= e.clientY - startY;

    setSize({
      width: Math.max(newWidth, MIN_WIDTH),
      height: Math.max(newHeight, MIN_HEIGHT),
    });
  }, []);

  /** Stop resize */
  const onResizeStop = useCallback(() => {
    resizeRef.current = null;
    window.removeEventListener("pointermove", onResizeMove);
    window.removeEventListener("pointerup", onResizeStop);
  }, [onResizeMove]);

  return (
    <div
      ref={panelRef}
      data-panel-id={id}
      className={cn(
        // THEME ROOT
        isDark ? "dark" : "light",
        // Panel
        "rounded-md flex flex-col relative overflow-hidden",
        "transition-shadow duration-150",
        "border shadow-sm",

        // DARK THEME
        "dark:bg-[#1F1F1F] dark:border-[#3A3A3A] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)] dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.18)]",

        // LIGHT THEME
        "bg-white border-gray-300 shadow-[0_0_0_1px_rgba(0,0,0,0.05)] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
      )}
      style={{ width: size.width, height: size.height }}
    >
      {/* HEADER */}
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2 border-b",
          draggable && "cursor-move",

          // DARK THEME HEADER
          "dark:bg-[#222222] dark:border-[#333333] dark:text-gray-200",

          // LIGHT THEME HEADER
          "bg-gray-100 border-gray-300 text-gray-800",

          editMode && "dark:bg-[#2b2b2b] bg-gray-200"
        )}
      >
        <div className="flex flex-col">
          <span className="text-sm font-medium">{title}</span>
          {description && (
            <span className="text-xs opacity-70">{description}</span>
          )}
        </div>

        {menuItems && (
          <PanelMenu
            open={menuOpen}
            onOpenChange={setMenuOpen}
            items={menuItems}
          />
        )}
      </div>

      {/* BODY */}
      <div
        className={cn(
          "relative flex-1 overflow-hidden",
          "dark:bg-[#1a1a1a] bg-white"
        )}
      >
        {isLoading && <PanelLoader />}
        {!isLoading && error && <PanelError message={error} />}

        {!isLoading && !error && (
          <div className="h-full w-full p-2">{children}</div>
        )}
      </div>

      {/* BOTTOM STRIP */}
      <div
        className={cn(
          "h-2 w-full flex justify-center items-center text-[10px]",
          "dark:text-gray-500 text-gray-500"
        )}
      ></div>

      {/* RESIZE HANDLES */}
      {editMode && (
        <>
          <div
            className="absolute top-0 left-0 w-1 h-full cursor-w-resize bg-transparent dark:hover:bg-white/10 hover:bg-black/10"
            onPointerDown={(e) => onResizeStart(e, "left")}
          />
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-e-resize bg-transparent dark:hover:bg-white/10 hover:bg-black/10"
            onPointerDown={(e) => onResizeStart(e, "right")}
          />
          <div
            className="absolute bottom-0 left-0 w-full h-1 cursor-s-resize bg-transparent dark:hover:bg-white/10 hover:bg-black/10"
            onPointerDown={(e) => onResizeStart(e, "bottom")}
          />
          <div
            className="absolute top-0 left-0 w-full h-1 cursor-n-resize bg-transparent dark:hover:bg-white/10 hover:bg-black/10"
            onPointerDown={(e) => onResizeStart(e, "top")}
          />

          {/* corners */}
          <div
            className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize dark:hover:bg-white/20 hover:bg-black/20"
            onPointerDown={(e) => onResizeStart(e, "top-left")}
          />
          <div
            className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize dark:hover:bg-white/20 hover:bg-black/20"
            onPointerDown={(e) => onResizeStart(e, "top-right")}
          />
          <div
            className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize dark:hover:bg-white/20 hover:bg-black/20"
            onPointerDown={(e) => onResizeStart(e, "bottom-left")}
          />
          <div
            className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize dark:hover:bg-white/20 hover:bg-black/20"
            onPointerDown={(e) => onResizeStart(e, "bottom-right")}
          />
        </>
      )}
    </div>
  );
}
