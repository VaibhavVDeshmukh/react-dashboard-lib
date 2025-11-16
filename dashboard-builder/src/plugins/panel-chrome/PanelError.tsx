import React, { useEffect, useState } from "react";
import { cn } from "../../utils/cn";

type ErrorVariant = "default" | "card" | "banner" | "inline" | "icon" | "detailed";

interface PanelErrorProps {
  message: string;
  title?: string;
  variant?: ErrorVariant;
  theme?: "light" | "dark" | "system";
  onRetry?: () => void;
  icon?: React.ReactNode;
}

export function PanelError({
  message,
  title = "Error",
  variant = "default",
  theme = "system",
  onRetry,
  icon,
}: PanelErrorProps) {
  const [isDark, setIsDark] = useState(() =>
    theme === "dark"
      ? true
      : theme === "light"
      ? false
      : window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Sync with OS dark mode if using system
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

  const classes = {
    container: cn(
      "absolute inset-0 flex flex-col items-center justify-center text-center p-4",
      isDark ? "dark" : "light"
    ),
    text: cn(
      "text-sm",
      isDark ? "text-red-300" : "text-red-700"
    ),
    card: cn(
      "bg-red-900/20 dark:bg-red-800/20 border border-red-700/40",
      "px-4 py-3 rounded-md shadow-md max-w-sm"
    ),
    banner: cn(
      "absolute top-0 inset-x-0",
      isDark
        ? "bg-red-900/40 text-red-200 border-b border-red-800/60"
        : "bg-red-50 text-red-800 border-b border-red-200",
      "px-4 py-2 text-sm font-medium"
    ),
    inline: cn(
      "w-full text-left px-3 py-2 rounded border",
      isDark
        ? "bg-red-950/40 border-red-800 text-red-200"
        : "bg-red-50 border-red-300 text-red-800"
    ),
    retryButton: cn(
      "mt-3 px-3 py-1 rounded text-xs font-medium transition-all",
      isDark
        ? "bg-red-800/40 hover:bg-red-700/50 text-red-200"
        : "bg-red-200 hover:bg-red-300 text-red-900"
    ),
  };

  // -----------------------------
  // VARIANT RENDERERS
  // -----------------------------

  if (variant === "banner") {
    return (
      <div className={classes.banner} role="alert">
        {icon && <span className="mr-1">{icon}</span>}
        <span>{message}</span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={classes.inline} role="alert">
        {icon && <span className="mr-1">{icon}</span>}
        {message}
        {onRetry && (
          <button className={classes.retryButton} onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={classes.container} role="alert">
        <div className={classes.card}>
          <div className="flex items-center gap-2 justify-center mb-1">
            {icon}
            <span className="font-semibold text-red-300 dark:text-red-200">
              {title}
            </span>
          </div>
          <p className={classes.text}>{message}</p>

          {onRetry && (
            <button className={classes.retryButton} onClick={onRetry}>
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (variant === "icon") {
    return (
      <div className={classes.container} role="alert">
        <div className="flex flex-col items-center gap-2">
          {icon && <div className="text-red-400 dark:text-red-300">{icon}</div>}
          <p className={classes.text}>{message}</p>
        </div>
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div className={classes.container} role="alert">
        <div className="flex flex-col items-center max-w-sm bg-red-900/20 dark:bg-red-800/20 border border-red-700/40 px-4 py-3 rounded-md shadow-md">
          <div className="flex items-center gap-2 mb-1">
            {icon}
            <span className="text-base font-semibold text-red-300 dark:text-red-200">
              {title}
            </span>
          </div>

          <p className={classes.text}>{message}</p>

          {onRetry && (
            <button className={classes.retryButton} onClick={onRetry}>
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  // DEFAULT (minimal)
  return (
    <div className={classes.container} role="alert">
      <p className={classes.text}>{message}</p>
    </div>
  );
}
