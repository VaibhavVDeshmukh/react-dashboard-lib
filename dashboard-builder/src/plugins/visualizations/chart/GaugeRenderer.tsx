// GaugeRenderer.tsx
import React from "react";
import { VisualizationRendererProps } from "../visualization-api";

interface GaugeData {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  unit?: string;
}

interface GaugeOptions {
  min?: number;
  max?: number;
  thresholds?: Array<{
    value: number;
    color: string;
  }>;
  showValue?: boolean;
  showLabels?: boolean;
  decimals?: number;
  needle?: boolean;
}

export const GaugeRenderer: React.FC<
  VisualizationRendererProps<"gauge">
> = ({ data, options, width, height, theme = "light" }) => {
  // Type guard to safely cast data
  const gaugeData = data as unknown as GaugeData;
  const gaugeOptions = options as unknown as GaugeOptions;

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
  if (typeof gaugeData?.value !== "number") {
    return (
      <div className={`flex items-center justify-center h-full w-full p-4 ${
        isDark ? "text-red-400 bg-red-900/20" : "text-red-600 bg-red-50"
      }`}>
        Invalid data: value is required
      </div>
    );
  }

  // Defaults
  const min = gaugeOptions?.min ?? gaugeData.min ?? 0;
  const max = gaugeOptions?.max ?? gaugeData.max ?? 100;
  const value = Math.max(min, Math.min(max, gaugeData.value));
  const decimals = gaugeOptions?.decimals ?? 0;
  const showValue = gaugeOptions?.showValue ?? true;
  const showLabels = gaugeOptions?.showLabels ?? true;
  const useNeedle = gaugeOptions?.needle ?? false;

  // Calculate percentage
  const percentage = ((value - min) / (max - min)) * 100;

  // Get color based on thresholds
  const getColor = (): string => {
    if (!gaugeOptions?.thresholds || gaugeOptions.thresholds.length === 0) {
      return "#3B82F6";
    }

    const sortedThresholds = [...gaugeOptions.thresholds].sort(
      (a, b) => b.value - a.value
    );

    for (const threshold of sortedThresholds) {
      if (value >= threshold.value) {
        return threshold.color;
      }
    }

    return isDark ? "#6B7280" : "#9CA3AF";
  };

  const activeColor = getColor();

  // Calculate gauge dimensions
  const size = Math.min(
    typeof width === "number" ? width : 300,
    typeof height === "number" ? height : 300
  );
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;
  const strokeWidth = size * 0.08;

  // Gauge arc parameters (180 degrees, from -90 to 90)
  const startAngle = -90;
  const endAngle = 90;
  const totalAngle = endAngle - startAngle;

  // Calculate arc path
  const createArcPath = (
    startAngleDeg: number,
    endAngleDeg: number,
    r: number
  ): string => {
    const startAngleRad = (startAngleDeg * Math.PI) / 180;
    const endAngleRad = (endAngleDeg * Math.PI) / 180;

    const x1 = centerX + r * Math.cos(startAngleRad);
    const y1 = centerY + r * Math.sin(startAngleRad);
    const x2 = centerX + r * Math.cos(endAngleRad);
    const y2 = centerY + r * Math.sin(endAngleRad);

    const largeArcFlag = endAngleDeg - startAngleDeg > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  // Background arc (full gauge)
  const backgroundPath = createArcPath(startAngle, endAngle, radius);

  // Value arc
  const valueAngle = startAngle + (percentage / 100) * totalAngle;
  const valuePath = createArcPath(startAngle, valueAngle, radius);

  // Needle angle
  const needleAngle = startAngle + (percentage / 100) * totalAngle;
  const needleAngleRad = (needleAngle * Math.PI) / 180;
  const needleLength = radius * 0.9;
  const needleX = centerX + needleLength * Math.cos(needleAngleRad);
  const needleY = centerY + needleLength * Math.sin(needleAngleRad);

  // Render threshold markers
  const renderThresholdMarkers = () => {
    if (!gaugeOptions?.thresholds || gaugeOptions.thresholds.length === 0) {
      return null;
    }

    return gaugeOptions.thresholds.map((threshold, index) => {
      const thresholdPercentage = ((threshold.value - min) / (max - min)) * 100;
      const angle = startAngle + (thresholdPercentage / 100) * totalAngle;
      const angleRad = (angle * Math.PI) / 180;

      const markerRadius = radius + strokeWidth / 2 + 5;
      const markerX = centerX + markerRadius * Math.cos(angleRad);
      const markerY = centerY + markerRadius * Math.sin(angleRad);

      return (
        <circle
          key={index}
          cx={markerX}
          cy={markerY}
          r={3}
          fill={threshold.color}
        />
      );
    });
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-full w-full transition-colors duration-200 bg-background`}
      style={{ width, height }}
    >
      <svg width={size} height={size} style={{ overflow: "visible" }}>
        {/* Background arc */}
        <path
          d={backgroundPath}
          fill="none"
          stroke={isDark ? "#374151" : "#E5E7EB"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Value arc */}
        {!useNeedle && (
          <path
            d={valuePath}
            fill="none"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ transition: "all 0.5s ease-in-out" }}
          />
        )}

        {/* Needle */}
        {useNeedle && (
          <g>
            <line
              x1={centerX}
              y1={centerY}
              x2={needleX}
              y2={needleY}
              stroke={activeColor}
              strokeWidth={3}
              strokeLinecap="round"
              style={{ transition: "all 0.5s ease-in-out" }}
            />
            <circle cx={centerX} cy={centerY} r={6} fill={activeColor} />
          </g>
        )}

        {/* Threshold markers */}
        {renderThresholdMarkers()}
      </svg>

      {/* Value display */}
      {showValue && (
        <div
          className="text-4xl font-bold mt-2"
          style={{ color: activeColor }}
        >
          {value.toFixed(decimals)}
          {gaugeData.unit && (
            <span className="text-xl ml-1">{gaugeData.unit}</span>
          )}
        </div>
      )}

      {/* Label */}
      {gaugeData.label && (
        <div
          className={`text-sm mt-1 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {gaugeData.label}
        </div>
      )}

      {/* Min/Max labels */}
      {showLabels && (
        <div
          className={`flex justify-between w-full px-8 mt-2 text-xs ${
            isDark ? "text-gray-500" : "text-gray-500"
          }`}
        >
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};

export default GaugeRenderer;