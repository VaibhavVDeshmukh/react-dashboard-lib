import React, { useState, useEffect } from "react";
import { PanelMenu } from "./PanelMenu";
import { PanelLoader } from "./PanelLoader";
import { PanelError } from "./PanelError";
import { cn } from "../../utils/cn";
import "react-resizable/css/styles.css";

interface PanelChromeProps {
  id: string;
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: string | null;
  draggable?: boolean;
  editMode?: boolean;
  theme?: "light" | "dark" | "system";
  children?: React.ReactNode;
  menuItems?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }>;
}

export function PanelChrome({
  id,
  title,
  description,
  isLoading,
  error,
  draggable = true,
  theme = "system",
  children,
  menuItems,
}: PanelChromeProps) {
  /** Theme handling */
  const [isDark, setIsDark] = useState(
    theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

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

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      data-panel-id={id}
      className={cn(
        isDark ? "dark" : "light",
        "rounded-md flex flex-col relative overflow-hidden h-full w-full",
        "transition-shadow duration-150 border shadow-sm",

        // dark theme
        "dark:bg-[#1F1F1F] dark:border-[#3A3A3A] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)] dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.18)]",

        // light theme
        "bg-white border-gray-300 shadow-[0_0_0_1px_rgba(0,0,0,0.05)] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
      )}
    >
      {/* HEADER */}
      <div
        className={cn(
          "panel-drag-handle flex items-center justify-between px-3 py-2 bg-background",
          draggable && "cursor-move"
        )}
      >
        {/* LEFT SECTION: Title + tooltip */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Title with ellipsis */}
          {title && (
            <span
              className={cn(
                "text-sm font-medium block truncate max-w-[140px] sm:max-w-[200px] md:max-w-[260px] lg:max-w-[320px]",
                "dark:text-gray-100 text-gray-800"
              )}
              title={title} // native tooltip fallback
            >
              {title}
            </span>
          )}

          {/* Tooltip Icon */}
          {description && (
            <div className="relative group cursor-default flex-shrink-0">
              {/* “i” Icon */}
              <span
                className={cn(
                  "inline-flex items-center justify-center rounded-full border text-[10px] w-4 h-4",
                  "dark:border-gray-500 border-gray-400",
                  "dark:text-gray-300 text-gray-700",
                  "group-hover:bg-gray-300/20 transition"
                )}
              >
                i
              </span>

              {/* Tooltip Panel */}
              <div
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 mt-2 whitespace-normal z-50 px-3 py-2 rounded-md shadow-lg",
                  "text-xs leading-snug max-w-[200px]",
                  "opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150",

                  // theme support
                  "dark:bg-[#2b2b2b] dark:text-gray-200 dark:border dark:border-gray-700",
                  "bg-white text-gray-800 border border-gray-300"
                )}
              >
                {description}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SECTION: Menu */}
        {menuItems && (
          <PanelMenu
            open={menuOpen}
            onOpenChange={setMenuOpen}
            items={menuItems}
            theme={theme}
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
          <div className="h-full w-full p-2 overflow-auto">{children}</div>
        )}
      </div>
    </div>
  );
}
