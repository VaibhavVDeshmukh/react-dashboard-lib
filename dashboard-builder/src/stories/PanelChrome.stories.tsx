import type { Meta, StoryObj } from "@storybook/react-vite";
import { PanelChrome } from "../plugins/panel-chrome/PanelChrome";

const meta: Meta<typeof PanelChrome> = {
  title: "Dashboard/PanelChrome",
  component: PanelChrome,
  parameters: {
    docs: {
      description: {
        component: `
**PanelChrome** is a Grafana-style UI wrapper used inside dashboard panels.  
It provides:

- Header with title, description, and menu button  
- Themed dark/light styling  
- Drag handle (\`.panel-drag-handle\`) for layout managers  
- Error + loading overlays  
- Fully responsive content area  

This component is designed to work perfectly inside **React-Grid-Layout**,  
or standalone inside Storybook for UI inspection.
        `,
      },
    },
    layout: "fullscreen",
  },
  args: {
    id: "panel-1",
    title: "Example Panel",
    description: "PanelChrome component docs demo",
    draggable: true,
    editMode: false,
    isLoading: false,
    error: null,
    menuItems: [
      { label: "Refresh", onClick: () => alert("Refresh clicked") },
      { label: "Inspect", onClick: () => alert("Inspect clicked") },
      { label: "Remove", onClick: () => alert("Remove clicked") },
    ],
    children: (
      <div className="text-gray-800 dark:text-gray-200">
        Panel body content goes here.
      </div>
    ),
  },
};

export default meta;

type Story = StoryObj<typeof PanelChrome>;

/* ------------------------------------------------------
 * DEFAULT
 * ------------------------------------------------------ */
export const Default: Story = {
  name: "Default Panel",
};

/* ------------------------------------------------------
 * LOADING STATE
 * ------------------------------------------------------ */
export const Loading: Story = {
  args: {
    isLoading: true,
    children: null,
  },
  parameters: {
    docs: {
      description: {
        story: "Displays the built-in loader overlay.",
      },
    },
  },
};

/* ------------------------------------------------------
 * ERROR STATE
 * ------------------------------------------------------ */
export const Error: Story = {
  args: {
    error: "Failed to fetch panel data.",
    children: null,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows error overlay with message.",
      },
    },
  },
};

/* ------------------------------------------------------
 * DARK THEME PREVIEW
 * ------------------------------------------------------ */
export const DarkTheme: Story = {
  args: {
    theme: "dark",
  },
  parameters: {
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#1F1F1F" }],
    },
    docs: {
      description: {
        story:
          "Forces dark theme mode. Works even when Storybook browser prefers light theme.",
      },
    },
  },
};

/* ------------------------------------------------------
 * WITH MENU
 * ------------------------------------------------------ */
export const WithMenu: Story = {
  args: {
    menuItems: [
      { label: "Open", onClick: () => console.log("Open") },
      { label: "Duplicate", onClick: () => console.log("Duplicate") },
      { label: "Share", onClick: () => console.log("Share") },
      { label: "Delete", onClick: () => console.log("Delete") },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "PanelChrome supports any number of menu actions.",
      },
    },
  },
};

/* ------------------------------------------------------
 * EDIT MODE (drag-enabled header)
 * ------------------------------------------------------ */
export const EditMode: Story = {
  args: {
    editMode: true,
    draggable: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Enables drag-handle styling used inside React-Grid-Layout or any other layout manager.",
      },
    },
  },
};

/* ------------------------------------------------------
 * CUSTOM BODY CONTENT
 * ------------------------------------------------------ */
export const WithCustomContent: Story = {
  args: {
    children: (
      <div className="p-4 space-y-3">
        <div className="bg-blue-200 text-blue-900 p-2 rounded">Widget A</div>
        <div className="bg-green-200 text-green-900 p-2 rounded">Widget B</div>
        <div className="bg-yellow-200 text-yellow-900 p-2 rounded">Widget C</div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "You can embed any content inside PanelChrome: charts, tables, or custom apps.",
      },
    },
  },
};
