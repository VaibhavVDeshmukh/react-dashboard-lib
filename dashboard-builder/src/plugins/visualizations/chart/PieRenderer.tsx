// PieRenderer.tsx
import React from "react";
import { VisualizationRendererProps } from "../visualization-api";
import { ChartBase } from "../chart/ChartBase";

export const PieRenderer: React.FC<VisualizationRendererProps<"pie">> = ({
  width,
  height,
  data,
  options,
}) => {
  const chartData = {
    labels: (data as any)?.labels ?? ["A", "B"],
    datasets: [
      {
        data: (data as any)?.values ?? [30, 70],
        backgroundColor:
          (options as any).colors ?? ["#FFB86B", "#7DD3FC", "#34D399", "#F472B6"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: options.donut ? "50%" : "0%",
  };

  return (
    <ChartBase
      type="pie"
      width={width}
      height={height}
      data={chartData}
      options={chartOptions}
    />
  );
};
