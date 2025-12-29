// BarRenderer.tsx
import React from "react";
import { VisualizationRendererProps } from "../visualization-api";
import { ChartBase } from "../chart/ChartBase";

interface BarData {
  labels?: string[];
  values?: number[];
}

export const BarRenderer: React.FC<VisualizationRendererProps<"bar">> = ({
  width,
  height,
  data,
  options,
}) => {
  const barData = data as BarData;
  const chartData = {
    labels: barData?.labels ?? ["A", "B", "C", "D"],
    datasets: [
      {
        label: options?.label ?? "Values",
        data: barData?.values ?? [3, 10, 4, 12],
        backgroundColor: options?.colors ?? "rgba(59,130,246,0.8)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <ChartBase
      type="bar"
      width={width}
      height={height}
      data={chartData}
      options={chartOptions}
    />
  );
};
