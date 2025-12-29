import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

export interface PanelMenuItem {
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onClick?: () => void;
  submenu?: PanelMenuItem[];
}

export function PanelMenu({
  open,
  onOpenChange,
  items,
  theme = "system",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: PanelMenuItem[];
  theme?: "light" | "dark" | "system";
}) {
  const ref = useRef<HTMLDivElement>(null);

  /** Detect dark mode */
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  /** Close on outside click */
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, onOpenChange]);

  /** Close on ESC key */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative select-none", isDark ? "dark" : "light")}
    >
      {/* Kebab Button */}
      <button
        className={cn(
          "react-draggable-cancel px-1 py-[2px] rounded text-gray-700 dark:text-gray-300",
          "hover:bg-gray-200 dark:hover:bg-[#3A3A3A] transition-colors"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onOpenChange(!open);
        }}
      >
        <svg width="16" height="16" className="fill-current">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>

      {/* MENU */}
      {open && (
        <div
          className={cn(
            "absolute right-0 mt-2 z-50 w-56 py-1 rounded-lg shadow-xl border",
            "bg-white text-gray-800 border-gray-300",
            "dark:bg-[#1E1E1E] dark:text-gray-200 dark:border-[#333]",
            "transition-all"
          )}
        >
          {items.map((item, idx) => (
            <MenuItem
              key={idx}
              item={item}
              onClose={() => onOpenChange(false)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------- Menu Item Component ---------------------- */

function MenuItem({
  item,
  onClose,
}: {
  item: PanelMenuItem;
  onClose: () => void;
}) {
  return (
    <button
      className={cn(
        "w-full text-left px-3 py-2 text-sm flex items-center justify-between",
        "hover:bg-gray-200 dark:hover:bg-[#2A2A2A] transition-colors"
      )}
      onClick={() => {
        item.onClick?.();
        onClose();
      }}
    >
      <div className="flex items-center gap-2">
        {/* Left Icon */}
        {item.icon && <span className="text-base opacity-90">{item.icon}</span>}
        <span className="truncate">{item.label}</span>
      </div>

      {/* Right Shortcut */}
      {item.shortcut && (
        <span
          className="text-xs px-2 py-[1px] rounded border 
              dark:border-gray-600 border-gray-400 opacity-80"
        >
          {item.shortcut}
        </span>
      )}

      {/* Submenu arrow */}
      {item.submenu && (
        <span className="ml-2 opacity-60">›</span> // (or use an icon)
      )}
    </button>
  );
}
