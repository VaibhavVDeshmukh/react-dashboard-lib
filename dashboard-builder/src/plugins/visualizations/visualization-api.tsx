// visualization-api.tsx
import React from "react";

/** Built-in visualization ids */
export type VisualizationType =
  | "timeSeries"
  | "bar"
  | "stat"
  | "gauge"
  | "barGauge"
  | "table"
  | "pie";

/** Generic shape of data passed into a visualization.
 * You can refine per-vis renderer.
 */
export type VizData = Record<string, unknown> | unknown[];

/** Option shapes per visualization (extendable) */
export interface TimeSeriesOptions {
  mode: "line" | "area" | "bar";
  stacking: boolean;
  showLegend: boolean;
  color?: string;
}

export interface BarOptions {
  grouping: "group" | "stack";
  showXAxis: boolean;
  showYAxis: boolean;
  colorScheme?: string;
}

export interface StatOptions {
  textMode: "auto" | "valueOnly" | "nameAndValue";
  showSparkline: boolean;
  valueFormat?: string;
}

export interface GaugeOptions {
  min?: number;
  max?: number;
  thresholds?: Array<{ value: number; color: string }>;
}

export interface BarGaugeOptions extends GaugeOptions {
  orientation: "horizontal" | "vertical";
}

export interface TableOptions {
  pageSize: number;
  columns?: string[];
}

export interface PieOptions {
  donut: boolean;
  showLabels: boolean;
  labelPosition?: "inside" | "outside";
}

/** Master mapping (discriminated union) */
export interface VizOptionsMap {
  timeSeries: TimeSeriesOptions;
  bar: BarOptions;
  stat: StatOptions;
  gauge: GaugeOptions;
  barGauge: BarGaugeOptions;
  table: TableOptions;
  pie: PieOptions;
}

/** Generic options type by viz id */
export type VizOptions<T extends VisualizationType = VisualizationType> =
  VizOptionsMap[T];

/** Renderer props generic */
export type VisualizationRendererProps<T extends VisualizationType = VisualizationType> = {
  data: VizData;
  options: VizOptions<T>;
  width: number;
  height: number;
  theme?: "light" | "dark" | "system";
};

/** A visualization renderer component */
export type VisualizationRenderer<T extends VisualizationType = VisualizationType> =
  React.ComponentType<VisualizationRendererProps<T>>;

/** Registry entry */
export interface VizRegistryEntry<T extends VisualizationType = VisualizationType> {
  id: T;
  title: string;
  description?: string;
  renderer: VisualizationRenderer<T>;
  defaultOptions: VizOptions<T>;
  icon?: React.ReactNode;
}

/** Registry */
const registry = new Map<VisualizationType, VizRegistryEntry>();

export const registerVisualization = <T extends VisualizationType>(
  entry: VizRegistryEntry<T>
) => {
  registry.set(entry.id as VisualizationType, entry as unknown as VizRegistryEntry);
};

export const getRegistryEntry = (id: VisualizationType) => registry.get(id);
export const listRegisteredVisualizations = () => Array.from(registry.values());
