import { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutManagerUI } from "../plugins/layout-manager/components/LayoutManager"; 

/** Sample panels for initial layout */
const initialItems = [
  { id: "panel-1", x: 0, y: 0, w: 4, h: 4 },
  { id: "panel-2", x: 4, y: 0, w: 4, h: 4 },
  { id: "panel-3", x: 8, y: 0, w: 4, h: 4 },
  { id: "panel-4", x: 0, y: 4, w: 6, h: 4 },
  { id: "panel-5", x: 6, y: 4, w: 6, h: 4 },
];

const meta: Meta<typeof LayoutManagerUI> = {
  title: "Dashboard/LayoutManager",
  component: LayoutManagerUI,
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
  },
  args: {
    initialItems,
    cols: {
      desktop: 12,
      tablet: 8,
      mobile: 4,
    },
    rowHeight: {
      desktop: 40,
      tablet: 36,
      mobile: 32,
    },
    gap: 8,
  },
  argTypes: {
    cols: {
      control: false,
    },
    rowHeight: {
      control: false,
    },
    gap: {
      control: { type: "number" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof LayoutManagerUI>;

/* ---------------------------------------------------------
 * DEFAULT VIEW
 * --------------------------------------------------------- */
export const Default: Story = {
  name: "Basic Layout",
};

/* ---------------------------------------------------------
 * EDIT MODE (Drag + Resize)
 * --------------------------------------------------------- */
export const EditMode: Story = {
  name: "Edit Mode (Drag & Resize)",
  parameters: {
    docs: {
      description: {
        story:
          "Panels can be dragged around the grid and resized. This simulates the dashboard editor experience.",
      },
    },
  },
  render: (args) => (
    <div className="w-full h-[800px]">
      <LayoutManagerUI {...args} />
    </div>
  ),
};

/* ---------------------------------------------------------
 * RESPONSIVE BREAKPOINTS
 * --------------------------------------------------------- */
export const ResponsiveBreakpoints: Story = {
  name: "Responsive Breakpoints",
  parameters: {
    docs: {
      description: {
        story:
          "Switch between desktop, tablet, and mobile breakpoints to preview how the layout adapts.",
      },
    },
  },
  render: (args) => (
    <div className="w-full h-[700px]">
      <LayoutManagerUI
        {...args}
        cols={{ desktop: 12, tablet: 8, mobile: 4 }}
      />
    </div>
  ),
};

/* ---------------------------------------------------------
 * SAVE / LOAD USING LOCAL STORAGE
 * --------------------------------------------------------- */
export const PersistentStorage: Story = {
  name: "Save & Load Layout (LocalStorage)",
  parameters: {
    docs: {
      description: {
        story:
          "The layout persists between reloads using the local persistence adapter. Try moving panels, then reload Storybook.",
      },
    },
  },
  args: {
    adapter: {
      load: async () => {
        const raw = localStorage.getItem("storybook-layout");
        return raw ? JSON.parse(raw) : null;
      },
      save: async (data: any) => {
        // action("layout saved")(data);
        localStorage.setItem("storybook-layout", JSON.stringify(data));
      },
    },
  },
  render: (args) => (
    <div className="w-full h-[800px]">
      <LayoutManagerUI {...args} />
    </div>
  ),
};

/* ---------------------------------------------------------
 * DRAG-DROP ADD PANEL
 * (Drop a new panel from outside)
 * --------------------------------------------------------- */
export const DragDropAddPanel: Story = {
  name: "Drag & Drop → Add Panel",
  parameters: {
    docs: {
      description: {
        story:
          "Drag the green box below into the layout to create a new panel dynamically.",
      },
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData(
            "application/json",
            JSON.stringify({
              id: "new-panel-" + Math.random().toString(36).slice(2),
              x: 0,
              y: 0,
              w: 4,
              h: 4,
            })
          );
        }}
        className="bg-green-600 text-white px-3 py-2 rounded w-fit cursor-grab"
      >
        Drag me into the layout →
      </div>

      <div className="w-full h-[800px] border border-gray-700 rounded">
        <LayoutManagerUI {...args} />
      </div>
    </div>
  ),
};
