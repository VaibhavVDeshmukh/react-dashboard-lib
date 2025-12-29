// TimeSeriesRenderer.tsx
import React from "react";
import { VisualizationRendererProps } from "../visualization-api";
import { ChartBase } from "../chart/ChartBase";

interface TimeSeriesData {
  series?: Array<{
    label: string;
    points: Array<[string | number, number]>;
  }>;
}

export const TimeSeriesRenderer: React.FC<
  VisualizationRendererProps<"timeSeries">
> = ({ width, height, data, options }) => {
  const series = (data as TimeSeriesData)?.series || [];
  const chartData = {
    labels: series?.[0]?.points?.map((p: any) => p[0]) || [],
    datasets: series?.map((s: any, i: number) => ({
      label: s.label,
      data: s.points.map((p: any) => p[1]),
      borderColor: options.color ?? "rgba(54, 162, 235, 1)",
      backgroundColor:
        options.mode === "area"
          ? "rgba(54, 162, 235, 0.3)"
          : "rgba(0,0,0,0)",
      fill: options.mode === "area",
      tension: 0.3,
    })) ?? [],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: options.showLegend ?? true },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { display: true, grid: { color: "#444" } },
      y: { display: true, grid: { color: "#333" } },
    },
  };

  return (
    <ChartBase
      type="line"
      width={width}
      height={height}
      data={chartData}
      options={chartOptions}
    />
  );
};
