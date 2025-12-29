/* eslint-disable @typescript-eslint/no-explicit-any */
// DashboardExample.tsx
import React, { useState, useCallback, useEffect } from "react";
import { Layout } from "react-grid-layout";
import { Edit3, Eye, Plus, Download, Settings } from "lucide-react";

// Import visualization setup
import "../plugins/visualizations/chartjs-setup";
import "../plugins/visualizations/register-defaults";
import { GenericPanelData, LayoutManager } from "../plugins/layout-manager/components/LayoutManager";
import { VisualizationCard } from "../plugins/visualizations/VisualizationCard";
import { PanelChrome } from "../plugins/panel-chrome/PanelChrome";
import { VisualizationType } from "../plugins/visualizations/visualization-api";
import { PanelConfigurator } from "../plugins/configurator/PanelConfigurator";
import { getVisualizationConfig } from "../plugins/configurator/visualization-configs";

// Define your panel data structure
interface PanelData {
  title: string;
  description?: string;
  visualization: string;
  options: Record<string, any>;
  payload: any;
}

// Sample dashboard data
const INITIAL_DASHBOARD_PANELS: GenericPanelData<PanelData>[] = [
  {
    id: "stat-revenue",
    x: 0,
    y: 0,
    w: 3,
    h: 4,
    data: {
      title: "Total Revenue",
      description: "Monthly revenue in USD",
      visualization: "stat",
      options: {
        prefix: "$",
        suffix: "k",
        decimals: 1,
        showSparkline: true,
      },
      payload: {
        value: 245.8,
        sparkline: [200, 210, 220, 235, 240, 245, 245.8],
      },
    },
  },
  {
    id: "stat-users",
    x: 3,
    y: 0,
    w: 3,
    h: 4,
    data: {
      title: "Active Users",
      description: "Current active user count",
      visualization: "stat",
      options: {
        prefix: "",
        decimals: 0,
        showSparkline: true,
      },
      payload: {
        value: 1248,
        sparkline: [1100, 1150, 1180, 1200, 1220, 1235, 1248],
      },
    },
  },
  {
    id: "stat-conversion",
    x: 6,
    y: 0,
    w: 3,
    h: 4,
    data: {
      title: "Conversion Rate",
      description: "Overall conversion percentage",
      visualization: "stat",
      options: {
        suffix: "%",
        decimals: 2,
        showSparkline: false,
      },
      payload: {
        value: 3.42,
      },
    },
  },
  {
    id: "stat-bounce",
    x: 9,
    y: 0,
    w: 3,
    h: 4,
    data: {
      title: "Bounce Rate",
      description: "Percentage of single-page visits",
      visualization: "stat",
      options: {
        suffix: "%",
        decimals: 1,
        showSparkline: true,
      },
      payload: {
        value: 42.3,
        sparkline: [45, 44, 43, 43, 42.5, 42.3, 42.3],
      },
    },
  },
  {
    id: "timeseries-traffic",
    x: 0,
    y: 3,
    w: 8,
    h: 5,
    data: {
      title: "Website Traffic",
      description: "Daily visitors over the past week",
      visualization: "timeSeries",
      options: {
        mode: "line",
        showLegend: true,
        stacking: false,
        colors: ["#3B82F6", "#10B981", "#F59E0B"],
      },
      payload: {
        series: [
          {
            label: "Desktop",
            points: [
              [1, 450],
              [2, 520],
              [3, 480],
              [4, 550],
              [5, 600],
              [6, 580],
              [7, 620],
            ],
          },
          {
            label: "Mobile",
            points: [
              [1, 320],
              [2, 350],
              [3, 380],
              [4, 400],
              [5, 420],
              [6, 450],
              [7, 480],
            ],
          },
          {
            label: "Tablet",
            points: [
              [1, 80],
              [2, 90],
              [3, 85],
              [4, 95],
              [5, 100],
              [6, 105],
              [7, 110],
            ],
          },
        ],
      },
    },
  },
  {
    id: "pie-devices",
    x: 8,
    y: 3,
    w: 4,
    h: 5,
    data: {
      title: "Device Distribution",
      description: "Traffic by device type",
      visualization: "pie",
      options: {
        colors: ["#3B82F6", "#10B981", "#F59E0B"],
        donut: true,
      },
      payload: {
        labels: ["Desktop", "Mobile", "Tablet"],
        values: [620, 480, 110],
      },
    },
  },
  {
    id: "bar-regions",
    x: 0,
    y: 8,
    w: 6,
    h: 5,
    data: {
      title: "Sales by Region",
      description: "Revenue breakdown by geographical region",
      visualization: "bar",
      options: {
        label: "Revenue ($k)",
        colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
      },
      payload: {
        labels: ["North America", "Europe", "Asia", "South America", "Africa"],
        values: [85, 72, 98, 45, 28],
      },
    },
  },
  {
    id: "table-top-products",
    x: 6,
    y: 8,
    w: 6,
    h: 5,
    data: {
      title: "Top Products",
      description: "Best selling products this month",
      visualization: "table",
      options: {},
      payload: {
        rows: [
          ["Product", "Sales", "Revenue", "Trend"],
          ["Widget Pro", "1,234", "$45.6k", "↑ 12%"],
          ["Gadget Plus", "987", "$38.2k", "↑ 8%"],
          ["Tool Master", "756", "$28.9k", "↓ 3%"],
          ["Device X", "543", "$21.7k", "↑ 15%"],
          ["System Y", "432", "$18.3k", "→ 0%"],
        ],
      },
    },
  },
];

export default function DashboardExample() {
  const [panels, setPanels] = useState<GenericPanelData<PanelData>[]>(INITIAL_DASHBOARD_PANELS);
  const [editMode, setEditMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "system">("system");
  const [configuringPanel, setConfiguringPanel] = useState<string | null>(null);

  // Determine if dark mode should be active
  const [isDark, setIsDark] = useState(
    selectedTheme === "dark" ||
      (selectedTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  // Handle theme changes
  useEffect(() => {
    if (selectedTheme !== "system") {
      setIsDark(selectedTheme === "dark");
      return;
    }
    
    // Listen to system theme changes
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
    setIsDark(mq.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [selectedTheme]);

  // Apply dark class to document root for Tailwind dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Handle layout changes from react-grid-layout
  const handleLayoutChange = useCallback((layout: Layout[]) => {
    console.log("Layout changed:", layout);
    // You could persist this to localStorage or backend
    // localStorage.setItem('dashboard-layout', JSON.stringify(layout));
  }, []);

  // Handle panel removal
  const handlePanelRemove = useCallback((id: string) => {
    setPanels((prev) => prev.filter((p) => p.id !== id));
    console.log("Panel removed:", id);
  }, []);
  
  const handlePanelEdit = useCallback((id: string) => {
    setConfiguringPanel(id);
  }, []);

  const handleConfigSave = useCallback((
    panelId: string,
    configData: { data: any; options: any; query?: any }
  ) => {
    setPanels((prev) =>
      prev.map((panel) =>
        panel.id === panelId
          ? {
              ...panel,
              data: {
                ...panel.data!,
                payload: configData.data,
                options: configData.options,
                query: configData.query,
              },
            }
          : panel
      )
    );
  }, []);

  // Handle panel add (example)
  const handleAddPanel = useCallback(() => {
    const newPanel: GenericPanelData<PanelData> = {
      id: `panel-${Date.now()}`,
      x: 0,
      y: Infinity, // Adds to bottom
      w: 4,
      h: 4,
      data: {
        title: "New Panel",
        description: "A newly added panel",
        visualization: "stat",
        options: { prefix: "", decimals: 0, showSparkline: false },
        payload: { value: 0 },
      },
    };
    setPanels((prev) => [...prev, newPanel]);
  }, []);

  // Render function for each panel's content
  const renderPanel = useCallback((panel: GenericPanelData<PanelData>) => {
    if (!panel.data) return null;

    return (
      <VisualizationCard
        id={panel.id}
        type={panel.data.visualization as VisualizationType}
        data={panel.data.payload}
        options={panel.data.options}
        width="100%"
        height="100%"
        theme={selectedTheme}
      />
    );
  }, [selectedTheme]);

  // Panel wrapper with PanelChrome
  const panelWrapper = useCallback(
    (panel: GenericPanelData<PanelData>, content: React.ReactNode) => {
      if (!panel.data) return content;

      return (
        <PanelChrome
          id={panel.id}
          title={panel.data.title}
          description={panel.data.description}
          draggable={editMode}
          editMode={editMode}
          theme={selectedTheme}
          menuItems={[
            {
              label: "Duplicate",
              icon: <Plus className="w-4 h-4" />,
              onClick: () => {
                const duplicate = {
                  ...panel,
                  id: `${panel.id}-copy-${Date.now()}`,
                  x: (panel.x ?? 0) + 1,
                  y: (panel.y ?? 0) + 1,
                };
                setPanels((prev) => [...prev, duplicate]);
              },
            },
            {
              label: "Edit",
              icon: <Settings className="w-4 h-4" />,
              onClick: () => handlePanelEdit(panel.id),
            },
            {
              label: "Remove",
              icon: <Download className="w-4 h-4" />,
              onClick: () => handlePanelRemove(panel.id),
            },
          ]}
        >
          {content}
        </PanelChrome>
      );
    },
    [editMode, selectedTheme, handlePanelRemove, handlePanelEdit]
  );

   // Get current panel being configured
  const currentPanel = panels.find((p) => p.id === configuringPanel);
  const currentConfig = currentPanel?.data
    ? getVisualizationConfig(currentPanel.data.visualization)
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">
                Real-time metrics and insights
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Selector */}
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value as "light" | "dark" | "system")}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>

              {/* Add Panel Button */}
              <button
                onClick={handleAddPanel}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Panel
              </button>

              {/* Edit Mode Toggle */}
              <button
                onClick={() => setEditMode(!editMode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors duration-200 ${
                  editMode
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                }`}
              >
                {editMode ? (
                  <>
                    <Eye className="w-4 h-4" />
                    View Mode
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    Edit Mode
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {editMode && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors duration-200">
            <p className="text-sm text-blue-800 dark:text-blue-200 transition-colors duration-200">
              <strong>Edit Mode Active:</strong> Drag panels by their headers to reposition. 
              Resize from the bottom-right corner. Click the menu icon for more options.
            </p>
          </div>
        )}

        <div className="h-[calc(100vh-200px)]">
          <LayoutManager
            initialPanels={panels}
            renderPanel={renderPanel}
            panelWrapper={panelWrapper}
            editMode={editMode}
            onLayoutChange={handleLayoutChange}
            onPanelRemove={handlePanelRemove}
            rowHeight={50}
            margin={[12, 12]}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
          />
        </div>
      </main>

      {/* Panel Configurator Modal */}
      {currentPanel && currentConfig && (
        <PanelConfigurator
          isOpen={!!configuringPanel}
          onClose={() => setConfiguringPanel(null)}
          config={currentConfig}
          initialData={currentPanel.data?.payload}
          initialOptions={currentPanel.data?.options}
          initialQuery={currentPanel.data?.query}
          onSave={(configData) => handleConfigSave(currentPanel.id, configData)}
          theme={selectedTheme}
        />
      )}
    </div>
  );
}