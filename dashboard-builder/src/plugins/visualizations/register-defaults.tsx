// register-defaults.tsx
import { BarRenderer } from "./chart/BarRenderer";
import GaugeRenderer from "./chart/GaugeRenderer";
import { PieRenderer } from "./chart/PieRenderer";
import StatRenderer from "./chart/StatRenderer";
import { TableRenderer } from "./chart/TableRenderer";
import { TimeSeriesRenderer } from "./chart/TimeSeriesRenderer";
import { registerVisualization } from "./visualization-api";


registerVisualization({
  id: "timeSeries",
  title: "Time series",
  description: "Time based line, area and bar charts",
  renderer: TimeSeriesRenderer,
  defaultOptions: { mode: "line", stacking: false, showLegend: true, color: "#3B82F6" },
});

registerVisualization({
  id: "bar",
  title: "Bar chart",
  description: "Categorical charts with group support",
  renderer: BarRenderer,
  defaultOptions: { grouping: "group", showXAxis: true, showYAxis: true, colorScheme: "blue" },
});

registerVisualization({
  id: "stat",
  title: "Stat",
  description: "Big stat values & sparklines",
  renderer: StatRenderer,
  defaultOptions: { textMode: "auto", showSparkline: true },
});

registerVisualization({
  id: "gauge",
  title: "Gauge",
  description: "Standard gauge visualization",
  renderer: GaugeRenderer,
  defaultOptions: { min: 0, max: 100, thresholds: [] },
});

registerVisualization({
  id: "table",
  title: "Table",
  description: "Supports many column styles",
  renderer: TableRenderer,
  defaultOptions: { pageSize: 10 },
});

registerVisualization({
  id: "pie",
  title: "Pie chart",
  description: "The new core pie chart visualization",
  renderer: PieRenderer,
  defaultOptions: { donut: false, showLabels: true, labelPosition: "outside" },
});
