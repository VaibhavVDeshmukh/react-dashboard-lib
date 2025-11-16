import { Meta, StoryObj } from "@storybook/react-vite";
import { PanelChrome } from "../plugins/panel-chrome/PanelChrome";

const meta: Meta<typeof PanelChrome> = {
  title: "Dashboard/PanelChrome",
  component: PanelChrome,
  parameters: {
    layout: "padded", // better for resizable stories
  },

  argTypes: {
    theme: {
      control: { type: "select" },
      options: ["light", "dark", "system"],
      description: "Controls the panel's color theme",
    },
    editMode: {
      control: "boolean",
      description: "Enables resizing handles & edit chrome",
    },
    draggable: {
      control: "boolean",
      description: "Shows drag cursor on header",
    },
    isLoading: {
      control: "boolean",
    },
    error: {
      control: "text",
    },
  },

  args: {
    id: "panel-1",
    title: "Citibike Dashboard Example",
    description: "BigQuery Public Dataset",
    theme: "system",
    isLoading: false,
    editMode: false,
    error: null,
    draggable: true,

    menuItems: [
      { label: "View", onClick: () => alert("View clicked") },
      { label: "Edit", onClick: () => alert("Edit clicked") },
      { label: "Share", onClick: () => alert("Share clicked") },
      { label: "Inspect", onClick: () => alert("Inspect clicked") },
      { label: "Remove", onClick: () => alert("Remove clicked") },
    ],

    // Responsive example content
    children: (
      <div className="text-gray-800 dark:text-gray-200">
        <p>This is the panel body content.</p>
        <p>You can place charts, tables, or custom widgets here.</p>
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof PanelChrome>;

/* --------------------------
 *      DEFAULT PANEL
 * -------------------------- */
export const Default: Story = {};


/* --------------------------
 *     LOADING STATE
 * -------------------------- */
export const Loading: Story = {
  args: {
    isLoading: true,
    children: null,
  },
};


/* --------------------------
 *      ERROR STATE
 * -------------------------- */
export const Error: Story = {
  args: {
    error: "Failed to load data from the server.",
  },
};


/* --------------------------
 *    WITH CUSTOM CONTENT
 * -------------------------- */
export const WithContent: Story = {
  args: {
    children: (
      <div className="text-gray-800 dark:text-gray-200 space-y-2">
        <p>This is a custom content area.</p>
        <p>You can embed charts, tables, logs, or custom panels.</p>
      </div>
    ),
  },
};


/* --------------------------
 *    MENU ITEM EXAMPLE
 * -------------------------- */
export const WithMenu: Story = {
  args: {
    menuItems: [
      { label: "View", onClick: () => console.log("View") },
      { label: "Edit", onClick: () => console.log("Edit") },
      { label: "Inspect", onClick: () => console.log("Inspect") },
      { label: "More", onClick: () => console.log("More") },
      { label: "Remove", onClick: () => console.log("Remove") },
    ],
  },
};


/* --------------------------
 *     EDIT MODE (Resizable)
 * -------------------------- */
export const EditMode: Story = {
  args: {
    editMode: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows resize handles and allows the panel to be resized dynamically.",
      },
    },
  },
};


/* --------------------------
 *       INTERACTIVE PLAYGROUND
 * -------------------------- */
export const Playground: Story = {
  parameters: {
    controls: { expanded: true },
  },
};
