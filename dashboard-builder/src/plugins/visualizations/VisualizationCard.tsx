// VisualizationCard.tsx
import React, { useEffect, useState } from "react";
import {
  VisualizationType,
  getRegistryEntry,
  VizOptions,
} from "./visualization-api";

type CardProps<T extends VisualizationType = VisualizationType> = {
  id: string;
  type: T;
  data: unknown;
  options?: VizOptions<T>;
  onOptionsChange?: (opts: VizOptions<T>) => void;
  width?: number | string;
  height?: number | string;
  theme?: "dark" | "light" | "system";
  className?: string;
};

export function VisualizationCard<T extends VisualizationType = VisualizationType>({
  type,
  data,
  options,
  width = 400,
  height = 240,
  theme = "dark",
  className = "",
}: CardProps<T>) {
  const [localOptions, setLocalOptions] = useState<VizOptions<T>>(options ?? ({} as VizOptions<T>));

  // merge incoming changes
  useEffect(() => {
    if (options) setLocalOptions(options);
  }, [options]);

  const entry = getRegistryEntry(type);
  if (!entry) {
    return <div className="p-4 bg-red-50">Visualization not registered: {type}</div>;
  }

  const Renderer = entry.renderer as React.ComponentType<{
    data: unknown;
    options: VizOptions<T>;
    width: number;
    height: number;
    theme?: "dark" | "light" | "system";
  }>;

  return (
    <div className={` ${className}`} style={{ width }}>

      {/* preview / renderer area */}
      <div style={{ width: "100%", height }} className="overflow-hidden">
        <Renderer data={data} options={localOptions} width={width as number} height={height as number} theme={theme} />
      </div>
    </div>
  );
}
