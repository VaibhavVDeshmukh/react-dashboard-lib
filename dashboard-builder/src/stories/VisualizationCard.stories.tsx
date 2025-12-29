// VisualizationCard.stories.tsx
import "../plugins/visualizations/register-defaults"; 
import { Meta, StoryObj } from "@storybook/react-vite";
import { VisualizationCard } from "../plugins/visualizations/VisualizationCard";

const meta: Meta<typeof VisualizationCard> = {
  title: "Visualization/VisualizationCard",
  component: VisualizationCard,
  args: {
    id: "demo",
    type: "stat",
    data: { value: 12.4 },
    width: 520,
    height: 220,
  },
};

export default meta;
type Story = StoryObj<typeof VisualizationCard>;

export const Default: Story = {};
export const TimeSeries: Story = {
  args: {
    type: "timeSeries",
    options: { mode: "line", stacking: false, showLegend: true },
  },
};

export const Table: Story = { args: { type: "table" } };
