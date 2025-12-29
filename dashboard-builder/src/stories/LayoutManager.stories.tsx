import { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { LayoutManager } from "../plugins/layout-manager/components/LayoutManager";
import { PanelChrome } from "../plugins/panel-chrome/PanelChrome";
import "../plugins/visualizations/chartjs-setup";
// IMPORTANT: register all visualizations
import "../plugins/visualizations/register-defaults";

import { VisualizationCard } from "../plugins/visualizations/VisualizationCard";

/** Sample panels */
const initialPanels = [
  // -----------------------------
  // 1) STAT PANEL
  // -----------------------------
  {
    id: "panel-stat",
    x: 0,
    y: 0,
    w: 4,
    h: 4,
    data: {
      title: "Stat Example",
      visualization: "stat",
      options: { prefix: "", decimals: 2, showSparkline: true },
      payload: {
        value: 12.4,
        sparkline: [1, 3, 5, 7, 6, 4, 2],
      },
    },
  },

  // -----------------------------
  // 2) TIME SERIES
  // -----------------------------
  {
    id: "panel-timeseries",
    x: 4,
    y: 0,
    w: 4,
    h: 4,
    data: {
      title: "Time Series (CPU Usage)",
      visualization: "timeSeries",
      options: {
        mode: "line",
        showLegend: true,
        stacking: false,
        colors: ["#3B82F6"],
      },
      payload: {
        series: [
          {
            label: "CPU Load",
            points: [
              [1, 10],
              [2, 30],
              [3, 20],
              [4, 40],
              [5, 35],
            ],
          },
        ],
      },
    },
  },

  // -----------------------------
  // 3) TABLE
  // -----------------------------
  {
    id: "panel-table",
    x: 8,
    y: 0,
    w: 4,
    h: 4,
    data: {
      title: "User Table",
      visualization: "table",
      options: {},
      payload: {
        rows: [
          ["Name", "Age"],
          ["Alice", 30],
          ["Bob", 22],
          ["Charlie", 27],
        ],
      },
    },
  },

  // -----------------------------
  // 4) BAR CHART
  // -----------------------------
  {
    id: "panel-bar",
    x: 0,
    y: 4,
    w: 6,
    h: 4,
    data: {
      title: "Sales by Region",
      visualization: "bar",
      options: {
        label: "Revenue (k$)",
        colors: ["#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8"],
      },
      payload: {
        labels: ["East", "West", "North", "South"],
        values: [12, 19, 7, 14],
      },
    },
  },

  // -----------------------------
  // 5) PIE CHART
  // -----------------------------
  {
    id: "panel-pie",
    x: 6,
    y: 4,
    w: 6,
    h: 4,
    data: {
      title: "Market Share",
      visualization: "pie",
      options: {
        colors: ["#D38A3F", "#3CA0D0", "#1F8A6E", "#7554C6"],
        donut: true,
      },
      payload: {
        labels: ["Chrome", "Safari", "Firefox", "Edge"],
        values: [60, 22, 12, 6],
      },
    },
  },
];


const meta: Meta<typeof LayoutManager> = {
  title: "Dashboard/LayoutManager + Visualizations",
  component: LayoutManager,

  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
  },

  args: {
    editMode: true,
    initialPanels,
    onLayoutChange: fn(),

    /** Renders the visualization for each panel */
    renderPanel: (panel) => (
      <VisualizationCard
        id={panel.id}
        type={panel.data?.visualization}
        data={panel.data?.payload}
        options={panel.data?.options}
        width="100%"
        height="100%"
      />
    ),

    /** Wrap in PanelChrome */
    panelWrapper: (panel, content) => (
      <PanelChrome
        id={panel.id}
        title={panel.data?.title}
        description={`${panel.data?.visualization?.toUpperCase()} panel`}
        menuItems={[{ label: "Remove", onClick: () => {} }]}
      >
        {content}
      </PanelChrome>
    ),
  },

  argTypes: {
    editMode: { control: "boolean" },
    initialPanels: { control: false },
    renderPanel: { control: false },
    panelWrapper: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof LayoutManager>;

/* BASIC GRID */
export const Default: Story = {
  name: "Visualization Panel Layout",
  render: (args) => (
    <div className="w-full h-[900px]">
      <LayoutManager {...args} />
    </div>
  ),
};

/* Time series panel */
export const TimeSeriesDemo: Story = {
  args: {
    initialPanels: [
      {
        id: "ts",
        x: 0, y: 0, w: 12, h: 6,
        data: {
          title: "CPU Usage",
          visualization: "timeSeries",
          options: { mode: "line", showLegend: true },
          payload: {
            series: [
              { label: "CPU", points: [[1, 20], [2, 40], [3, 30], [4, 50]] }
            ]
          }
        }
      }
    ]
  },
};

/* Mixed Visualization Dashboard */
export const MixedVisualizations: Story = {
  name: "Mixed Visualization Dashboard",
  args: {
    initialPanels,
  },
};
