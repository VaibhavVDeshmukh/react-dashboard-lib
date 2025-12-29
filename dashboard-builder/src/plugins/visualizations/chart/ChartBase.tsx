import React from "react";
import { Chart } from "react-chartjs-2";
import { ChartType } from "chart.js";

export interface ChartBaseProps {
  width?: number | string;
  height?: number | string;
  data: any;
  options?: any;
  type: ChartType;
}
export const ChartBase: React.FC<ChartBaseProps> = ({
  data,
  options,
  type,
  width = "100%",
  height = "100%",
}) => {
  return (
    <div style={{ width, height }}>
      <Chart type={type as ChartType} data={data} options={options} />
    </div>
  );
};
