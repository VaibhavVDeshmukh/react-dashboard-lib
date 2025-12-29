// StatRenderer.tsx
import React from "react";
import { VisualizationRendererProps } from "../visualization-api";

interface StatData {
  value: number;
  sparkline?: number[];
  previousValue?: number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
}

interface StatOptions {
  textMode?: "auto" | "valueOnly" | "nameAndValue";
  showSparkline?: boolean;
  valueFormat?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  showTrend?: boolean;
  thresholds?: Array<{
    value: number;
    color: string;
  }>;
}

export const StatRenderer: React.FC<
  VisualizationRendererProps<"stat">
> = ({ data, options, width, height, theme = "light" }) => {
  // Type guard to safely cast data
  const statData = data as unknown as StatData;
  const statOptions = options as unknown as StatOptions;

  // Theme handling with system preference support
  const [isDark, setIsDark] = React.useState(
    theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  React.useEffect(() => {
    if (theme !== "system") {
      setIsDark(theme === "dark");
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [theme]);

  // Validate required data
  if (typeof statData?.value !== "number") {
    return (
      <div className={`flex items-center justify-center h-full w-full p-4 ${
        isDark ? "text-red-400 bg-red-900/20" : "text-red-600 bg-red-50"
      }`}>
        Invalid data: value is required
      </div>
    );
  }

  // Format value
  const formatValue = (val: number): string => {
    const decimals = statOptions?.decimals ?? 0;
    const formatted = val.toFixed(decimals);
    const prefix = statOptions?.prefix ?? "";
    const suffix = statOptions?.suffix ?? "";
    return `${prefix}${formatted}${suffix}`;
  };

  // Calculate trend
  const calculateTrend = (): {
    percentage: number;
    direction: "up" | "down" | "neutral";
  } | null => {
    if (!statData.previousValue || statData.previousValue === 0) return null;
    const diff = statData.value - statData.previousValue;
    const percentage = (diff / statData.previousValue) * 100;
    return {
      percentage: Math.abs(percentage),
      direction:
        percentage > 0 ? "up" : percentage < 0 ? "down" : "neutral",
    };
  };

  // Get color based on thresholds
  const getValueColor = (): string => {
    if (!statOptions?.thresholds || statOptions.thresholds.length === 0) {
      return isDark ? "#3B82F6" : "#2563EB";
    }

    const sortedThresholds = [...statOptions.thresholds].sort(
      (a, b) => b.value - a.value
    );

    for (const threshold of sortedThresholds) {
      if (statData.value >= threshold.value) {
        return threshold.color;
      }
    }

    return isDark ? "#6B7280" : "#9CA3AF";
  };

  const trend = statOptions?.showTrend ? calculateTrend() : null;
  const valueColor = getValueColor();

  // Sparkline rendering
  const renderSparkline = () => {
    if (!statOptions?.showSparkline || !statData.sparkline || statData.sparkline.length === 0) {
      return null;
    }

    const sparklineData = statData.sparkline;
    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const range = max - min || 1;

    const sparklineWidth = typeof width === "number" ? Math.min(width * 0.6, 200) : 200;
    const sparklineHeight = 40;
    const barWidth = sparklineWidth / sparklineData.length;
    const gap = barWidth * 0.2;
    const actualBarWidth = barWidth - gap;

    return (
      <div className="mt-4 flex items-end justify-center gap-[2px]" style={{ height: sparklineHeight }}>
        {sparklineData.map((value, index) => {
          const normalizedHeight = ((value - min) / range) * sparklineHeight;
          const isLast = index === sparklineData.length - 1;
          
          return (
            <div
              key={index}
              className="rounded-t transition-all duration-200"
              style={{
                width: actualBarWidth,
                height: `${Math.max(normalizedHeight, 2)}px`,
                backgroundColor: isLast
                  ? valueColor
                  : isDark
                  ? "rgba(59, 130, 246, 0.4)"
                  : "rgba(37, 99, 235, 0.4)",
              }}
              title={`${formatValue(value)}`}
            />
          );
        })}
      </div>
    );
  };

  // Trend indicator
  const renderTrend = () => {
    if (!trend) return null;

    const trendColor =
      trend.direction === "up"
        ? "#10B981"
        : trend.direction === "down"
        ? "#EF4444"
        : "#6B7280";

    const arrow =
      trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→";

    return (
      <div
        className="flex items-center gap-1 text-sm font-medium mt-2"
        style={{ color: trendColor }}
      >
        <span className="text-lg">{arrow}</span>
        <span>{trend.percentage.toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-full w-full p-4 transition-colors duration-200 bg-background`}
      style={{ width, height }}
    >
      {/* Main value */}
      <div
        className="text-5xl font-bold tabular-nums"
        style={{ color: valueColor }}
      >
        {formatValue(statData.value)}
      </div>

      {/* Unit label */}
      {statData.unit && (
        <div
          className={`text-sm mt-1 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {statData.unit}
        </div>
      )}

      {/* Trend indicator */}
      {renderTrend()}

      {/* Sparkline */}
      {renderSparkline()}
    </div>
  );
};

export default StatRenderer;