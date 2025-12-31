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
      <div
        className={`flex items-center justify-center h-full w-full p-4 ${
          isDark ? "text-red-400 bg-red-900/20" : "text-red-600 bg-red-50"
        }`}
      >
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
  const percentage = (((value - min) / (max - min)) * 100);

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

  // Calculate gauge dimensions - HORIZONTAL LAYOUT
  const containerWidth = typeof width === "number" ? width : 300;
  const containerHeight = typeof height === "number" ? height : 200;
  
  // Use width as primary dimension for horizontal gauge
  const gaugeWidth = Math.min(containerWidth * 0.9, containerHeight * 1.8);
  const radius = gaugeWidth * 0.4;
  const strokeWidth = radius * 0.2;
  
  // SVG dimensions
  const svgWidth = gaugeWidth;
  const svgHeight = radius + strokeWidth + 10; // Half circle + stroke + padding
  
  // Center position - centered horizontally, at bottom of SVG
  const centerX = svgWidth / 2;
  const centerY = svgHeight - 5; // Position at bottom so arc opens upward

  // ============ HORIZONTAL GAUGE ARC PARAMETERS ============
  // Arc goes from LEFT (180°) to RIGHT (0°), curving UPWARD
  // In SVG: 0° = right, 90° = down, 180° = left, 270° = up
  const startAngle = 0; // Left side (9 o'clock)
  const endAngle = 180;     // Right side (3 o'clock)
  const totalAngle = 180; // Total sweep of 180 degrees
  // =========================================================

  // Calculate arc path - for horizontal, we go counterclockwise (sweep-flag = 0)
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

    // For horizontal gauge going from 180° to 0° (counterclockwise/upward)
    // We use sweep-flag = 0 for counterclockwise
    const angleDiff = Math.abs(endAngleDeg - startAngleDeg);
    const largeArcFlag = angleDiff > 180 ? 1 : 0;
    const sweepFlag = 0; // Counterclockwise for upward arc

    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`;
  };

  // Background arc (full gauge) - from 180° to 0°
  const backgroundPath = createArcPath(startAngle, endAngle, radius);

  // Value arc - from 180° towards 0° based on percentage
  // At 0%: stays at 180°, at 100%: reaches 0°
  const valueAngle = startAngle - (percentage / 100) * totalAngle;
  const valuePath = createArcPath(startAngle, valueAngle, radius);

  // Needle angle calculation
  const needleAngle = startAngle - (percentage / 100) * totalAngle;
  const needleAngleRad = (needleAngle * Math.PI) / 180;
  const needleLength = radius * 0.85;
  const needleX = centerX + needleLength * Math.cos(needleAngleRad);
  const needleY = centerY + needleLength * Math.sin(needleAngleRad);

  // Render threshold markers
  const renderThresholdMarkers = () => {
    if (!gaugeOptions?.thresholds || gaugeOptions.thresholds.length === 0) {
      return null;
    }

    return gaugeOptions.thresholds.map((threshold, index) => {
      const thresholdPercentage = ((threshold.value - min) / (max - min)) * 100;
      // Calculate angle for threshold (180° to 0°)
      const angle = startAngle - (thresholdPercentage / 100) * totalAngle;
      const angleRad = (angle * Math.PI) / 180;

      const markerRadius = radius + strokeWidth / 2 + 8;
      const markerX = centerX + markerRadius * Math.cos(angleRad);
      const markerY = centerY + markerRadius * Math.sin(angleRad);

      return (
        <circle
          key={index}
          cx={markerX}
          cy={markerY}
          r={4}
          fill={threshold.color}
        />
      );
    });
  };

  // Render tick marks for better readability
  const renderTickMarks = () => {
    const ticks = [];
    const tickCount = 5; // 0%, 25%, 50%, 75%, 100%
    
    for (let i = 0; i <= tickCount; i++) {
      const tickPercentage = (i / tickCount) * 100;
      const angle = startAngle - (tickPercentage / 100) * totalAngle;
      const angleRad = (angle * Math.PI) / 180;
      
      const innerRadius = radius - strokeWidth / 2 - 2;
      const outerRadius = radius - strokeWidth / 2 - 8;
      
      const x1 = centerX + innerRadius * Math.cos(angleRad);
      const y1 = centerY + innerRadius * Math.sin(angleRad);
      const x2 = centerX + outerRadius * Math.cos(angleRad);
      const y2 = centerY + outerRadius * Math.sin(angleRad);
      
      ticks.push(
        <line
          key={`tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isDark ? "#4B5563" : "#9CA3AF"}
          strokeWidth={2}
          strokeLinecap="round"
        />
      );
    }
    
    return ticks;
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full transition-colors duration-200 bg-background mirror"
      style={{ width, height }}
    >
      <svg 
        width={svgWidth} 
        height={svgHeight} 
        style={{ overflow: "visible" }}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        {/* Background arc */}
        <path
          d={backgroundPath}
          fill="none"
          stroke={isDark ? "#374151" : "#E5E7EB"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Tick marks */}
        {renderTickMarks()}

        {/* Value arc */}
        {!useNeedle && percentage > 0 && (
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
          <g style={{ transition: "all 0.5s ease-in-out" }}>
            {/* Needle shadow */}
            <line
              x1={centerX}
              y1={centerY}
              x2={needleX + 1}
              y2={needleY + 1}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth={4}
              strokeLinecap="round"
            />
            {/* Needle */}
            <line
              x1={centerX}
              y1={centerY}
              x2={needleX}
              y2={needleY}
              stroke={activeColor}
              strokeWidth={3}
              strokeLinecap="round"
            />
            {/* Center circle */}
            <circle 
              cx={centerX} 
              cy={centerY} 
              r={8} 
              fill={activeColor} 
            />
            <circle 
              cx={centerX} 
              cy={centerY} 
              r={4} 
              fill={isDark ? "#1F2937" : "#FFFFFF"} 
            />
          </g>
        )}

        {/* Threshold markers */}
        {renderThresholdMarkers()}
      </svg>

      {/* Min/Max labels - positioned at ends of arc */}
      {showLabels && (
        <div
          className={`flex justify-between w-full px-4 -mt-2 text-xs font-medium ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
          style={{ maxWidth: svgWidth }}
        >
          <span>{max}{gaugeData.unit || ''}</span>
          <span>{min}{gaugeData.unit || ''}</span>
        </div>
      )}

      {/* Value display */}
      {showValue && (
        <div
          className="text-3xl font-bold mt-2"
          style={{ color: activeColor }}
        >
          {value.toFixed(decimals)}
          {gaugeData.unit && (
            <span className="text-lg ml-1 opacity-80">{gaugeData.unit}</span>
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
    </div>
  );
};

export default GaugeRenderer;