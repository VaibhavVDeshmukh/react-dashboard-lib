import { useEffect, useState } from "react";
import { cn } from "../../utils/cn";

type LoaderVariant = "spinner" | "dots" | "bar" | "skeleton" | "pulse";
type LoaderSize = "sm" | "md" | "lg" | "xl";

export function PanelLoader({
  variant = "spinner",
  size = "md",
  fullscreen = true,
  overlay = true,
  theme = "system",
  label,
}: {
  variant?: LoaderVariant;
  size?: LoaderSize;
  fullscreen?: boolean;
  overlay?: boolean;
  theme?: "light" | "dark" | "system";
  label?: string;
}) {
  // Detect dark/light from system if needed
  const [isDark, setIsDark] = useState(() =>
    theme === "dark"
      ? true
      : theme === "light"
      ? false
      : window.matchMedia("(prefers-color-scheme: dark)").matches
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

  const sizeMap: Record<LoaderSize, string> = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  // -------------------------
  // Variant Renderers
  // -------------------------

  const renderSpinner = () => (
    <div
      className={cn(
        "rounded-full border-2 animate-spin",
        sizeMap[size],
        isDark
          ? "border-gray-600 border-t-white"
          : "border-gray-400 border-t-black"
      )}
    />
  );

  const renderDots = () => (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "w-2 h-2 rounded-full animate-bounce",
            isDark ? "bg-gray-200" : "bg-gray-800"
          )}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );

  const renderBar = () => (
    <div className="w-40 h-1 overflow-hidden rounded bg-gray-400/20">
      <div
        className={cn(
          "h-full w-1/3 animate-[loading_1.4s_ease-in-out_infinite]",
          isDark ? "bg-gray-300" : "bg-gray-700"
        )}
      />
    </div>
  );

  const renderSkeleton = () => (
    <div className="flex flex-col space-y-3 w-full p-4">
      <div className="h-5 w-1/3 rounded bg-gray-500/30 animate-pulse" />
      <div className="h-4 w-1/2 rounded bg-gray-500/30 animate-pulse" />
      <div className="h-32 w-full rounded bg-gray-500/30 animate-pulse" />
    </div>
  );

  const renderPulse = () => (
    <div
      className={cn(
        "rounded-full animate-pulse",
        sizeMap[size],
        isDark ? "bg-gray-300" : "bg-gray-700"
      )}
    />
  );

  const renderVariant = () => {
    switch (variant) {
      case "dots":
        return renderDots();
      case "bar":
        return renderBar();
      case "skeleton":
        return renderSkeleton();
      case "pulse":
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  // -------------------------
  // Wrapper Container
  // -------------------------

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center z-50",
        overlay && "bg-black/20 dark:bg-black/30",
        !fullscreen && "static bg-transparent",
        isDark ? "dark" : "light"
      )}
    >
      {renderVariant()}

      {label && (
        <div className="mt-2 text-sm text-gray-300 dark:text-gray-200">
          {label}
        </div>
      )}
    </div>
  );
}
