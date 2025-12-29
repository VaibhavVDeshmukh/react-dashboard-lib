// // viz-renderers.tsx — FULLY UPGRADED VERSION
// import React from "react";
// import { VisualizationRendererProps } from "./visualization-api";
// import { Chart } from "react-chartjs-2";
// import { ChartBase } from "./chart/ChartBase";

// // =======================================================================
// // 📈 TIME SERIES RENDERER 
// // =======================================================================
// export const TimeSeriesRenderer: React.FC<
//   VisualizationRendererProps<"timeSeries">
// > = ({ width, height, data, options }) => {
//   const chartData = {
//     labels: data?.series?.[0]?.points?.map((p) => p[0]) ?? [],
//     datasets:
//       data?.series?.map((s, idx) => ({
//         label: s.label,
//         data: s.points.map((p) => p[1]),
//         borderColor: options.colors?.[idx] ?? "rgba(54, 162, 235, 1)",
//         backgroundColor:
//           options.mode === "area"
//             ? "rgba(54,162,235,0.3)"
//             : "rgba(0,0,0,0)",
//         fill: options.mode === "area",
//         tension: 0.3,
//       })) ?? [],
//   };

//   return (
//     <ChartBase
//       type="line"
//       width={width}
//       height={height}
//       data={chartData}
//       options={{
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: { display: options.showLegend ?? true },
//         },
//         scales: {
//           x: { display: true },
//           y: { display: true },
//         },
//       }}
//     />
//   );
// };

// // =======================================================================
// // 📊 BAR CHART
// // =======================================================================
// export const BarRenderer: React.FC<VisualizationRendererProps<"bar">> = ({
//   width,
//   height,
//   data,
//   options,
// }) => {
//   const chartData = {
//     labels: data?.labels ?? ["A", "B", "C", "D"],
//     datasets: [
//       {
//         label: options.label ?? "Values",
//         data: data?.values ?? [4, 10, 6, 12],
//         backgroundColor:
//           options.colors ?? ["#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8"],
//       },
//     ],
//   };

//   return (
//     <ChartBase
//       type="bar"
//       width={width}
//       height={height}
//       data={chartData}
//       options={{ responsive: true, maintainAspectRatio: false }}
//     />
//   );
// };

// // =======================================================================
// // 🎛️ GAUGE (semi-circle doughnut)
// // =======================================================================
// export const GaugeRenderer: React.FC<VisualizationRendererProps<"gauge">> = ({
//   width,
//   height,
//   data,
// }) => {
//   const value = data?.value ?? 79;

//   const gaugeData = {
//     datasets: [
//       {
//         data: [value, 100 - value],
//         backgroundColor: ["#4ADE80", "#1E293B"],
//         borderWidth: 0,
//       },
//     ],
//   };

//   const gaugeOptions = {
//     rotation: -90,
//     circumference: 180,
//     cutout: "70%",
//     plugins: { legend: { display: false } },
//     responsive: true,
//     maintainAspectRatio: false,
//   };

//   return (
//     <div style={{ width, height }}>
//       <Chart type="doughnut" data={gaugeData} options={gaugeOptions} />
//     </div>
//   );
// };

// // =======================================================================
// // 📋 TABLE RENDERER
// // =======================================================================
// export const TableRenderer: React.FC<VisualizationRendererProps<"table">> = ({
//   width,
//   height,
//   data,
// }) => (
//   <div
//     className="w-full h-full overflow-auto dark:bg-slate-800 bg-white"
//     style={{ width, height }}
//   >
//     <table className="w-full text-sm">
//       <tbody>
//         {(data?.rows ?? []).map((row: any[], i: number) => (
//           <tr key={i} className="border-b dark:border-slate-700">
//             {row.map((cell, j) => (
//               <td key={j} className="p-2 dark:text-gray-300 text-gray-800">
//                 {cell}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// // =======================================================================
// // 🥧 PIE CHART RENDERER
// // =======================================================================
// export const PieRenderer: React.FC<VisualizationRendererProps<"pie">> = ({
//   width,
//   height,
//   data,
//   options,
// }) => {
//   const pieData = data as { labels?: string[]; values?: number[] } | undefined;
//   const chartData = {
//     labels: pieData?.labels ?? ["A", "B"],
//     datasets: [
//       {
//         data: pieData?.values ?? [30, 70],
//         backgroundColor:
//           (options as any).colors ?? ["#FFB86B", "#7DD3FC", "#34D399", "#A78BFA"],
//       },
//     ],
//   };

//   return (
//     <ChartBase
//       type="pie"
//       width={width}
//       height={height}
//       data={chartData}
//       options={{
//         responsive: true,
//         maintainAspectRatio: false,
//         cutout: options.donut ? "50%" : "0%",
//       }}
//     />
//   );
// };
