import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

export function PanelMenu({
  open,
  onOpenChange,
  items,
  theme = "system", // <- new
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: Array<{ label: string; icon?: React.ReactNode; onClick: () => void }>;
  theme?: "light" | "dark" | "system";
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Determine active theme (dark/light/system)
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Close menu on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open, onOpenChange]);

  return (
    <div
      ref={menuRef}
      className={cn("relative select-none", isDark ? "dark" : "light")}
    >
      {/* Kebab Button */}
      <button
        onClick={() => onOpenChange(!open)}
        className={cn(
          "px-1 py-1 rounded transition-colors",
          // DARK
          "dark:text-gray-300 dark:hover:text-white dark:hover:bg-[#3A3A3A]",
          // LIGHT
          "text-gray-700 hover:text-black hover:bg-gray-200"
        )}
      >
        <svg width="16" height="16" className="fill-current">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>

      {/* MENU LIST */}
      {open && (
        <div
          className={cn(
            "absolute right-0 mt-2 z-50 py-1 rounded-md shadow-lg",
            "w-44 sm:w-48 min-w-max transition-all",
            // DARK
            "dark:bg-[#2C2C2C] dark:border dark:border-[#3A3A3A] dark:text-gray-200",
            // LIGHT
            "bg-white border border-gray-300 text-gray-800"
          )}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick();
                onOpenChange(false);
              }}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-left text-sm",
                "transition-colors",

                // DARK
                "dark:hover:bg-[#3A3A3A] dark:text-gray-200",

                // LIGHT
                "hover:bg-gray-200 text-gray-800"
              )}
            >
              {item.icon ? (
                <span className="text-lg">{item.icon}</span>
              ) : null}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
