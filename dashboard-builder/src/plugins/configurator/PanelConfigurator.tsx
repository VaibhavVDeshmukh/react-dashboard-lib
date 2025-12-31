/* eslint-disable @typescript-eslint/no-explicit-any */

// components/configurator/PanelConfigurator.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Save, Database, ChevronRight } from 'lucide-react';
import { VisualizationConfig } from './configurator.types';
import { FieldRenderer } from './FieldRenderer';

interface PanelConfiguratorProps {
  isOpen: boolean;
  onClose: () => void;
  config: VisualizationConfig;
  initialData?: any;
  initialOptions?: any;
  initialQuery?: any;
  onSave: (data: { data: any; options: any; query?: any }) => void;
  theme?: 'light' | 'dark' | 'system';
}

export const PanelConfigurator: React.FC<PanelConfiguratorProps> = ({
  isOpen,
  onClose,
  config,
  initialData = {},
  initialOptions = {},
  initialQuery = {},
  onSave,
  theme = 'light'
}) => {
  const [activeTab, setActiveTab] = useState<'data' | 'options' | 'query'>('data');
  const [data, setData] = useState(initialData);
  const [options, setOptions] = useState(initialOptions);
  const [query, setQuery] = useState(initialQuery);
  const wasOpen = useRef(isOpen);

  // Determine if dark mode
  const [isDark, setIsDark] = useState(
    theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (theme !== "system") {
      setIsDark(theme === "dark");
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
    setIsDark(mq.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [theme]);

  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      // Modal just opened - initialize with props
      setData(initialData);
      setOptions(initialOptions);
      setQuery(initialQuery);
      setActiveTab('data'); // Reset to first tab
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  const handleDataChange = (key: string, value: any) => {
    setData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleOptionChange = (key: string, value: any) => {
    setOptions((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleQueryChange = (key: string, value: any) => {
    setQuery((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave({ data, options, query });
    onClose();
  };

  // Group options by group
  const groupedOptions = config.optionFields.reduce((acc, field) => {
    const group = field.group || 'General';
    if (!acc[group]) acc[group] = [];
    acc[group].push(field);
    return acc;
  }, {} as Record<string, typeof config.optionFields>);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Right-side docked panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[700px] shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
                title="Close"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <h2
                  className={`text-xl font-bold truncate ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Configure {config.name}
                </h2>
                {config.description && (
                  <p
                    className={`text-sm mt-1 truncate ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {config.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className={`flex border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <button
            onClick={() => setActiveTab('data')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'data'
                ? 'border-blue-500 text-blue-500'
                : isDark
                ? 'border-transparent text-gray-400 hover:text-gray-300'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Data
          </button>
          <button
            onClick={() => setActiveTab('options')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'options'
                ? 'border-blue-500 text-blue-500'
                : isDark
                ? 'border-transparent text-gray-400 hover:text-gray-300'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Options
          </button>
          {config.queryConfig?.enabled && (
            <button
              onClick={() => setActiveTab('query')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'query'
                  ? 'border-blue-500 text-blue-500'
                  : isDark
                  ? 'border-transparent text-gray-400 hover:text-gray-300'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Database className="w-4 h-4" />
              Query
            </button>
          )}
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'data' && (
            <div className="space-y-6">
              {config.dataFields.length === 0 ? (
                <div
                  className={`text-center py-8 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  No data fields to configure
                </div>
              ) : (
                config.dataFields.map((field) => (
                  <FieldRenderer
                    key={field.key}
                    field={field}
                    value={data[field.key]}
                    onChange={handleDataChange}
                    theme={theme}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'options' && (
            <div className="space-y-8">
              {Object.keys(groupedOptions).length === 0 ? (
                <div
                  className={`text-center py-8 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  No options to configure
                </div>
              ) : (
                Object.entries(groupedOptions).map(([groupName, fields]) => (
                  <div key={groupName}>
                    <h3
                      className={`text-lg font-semibold mb-4 pb-2 border-b ${
                        isDark
                          ? 'text-gray-200 border-gray-700'
                          : 'text-gray-900 border-gray-200'
                      }`}
                    >
                      {groupName}
                    </h3>
                    <div className="space-y-6">
                      {fields.map((field) => (
                        <FieldRenderer
                          key={field.key}
                          field={field}
                          value={options[field.key]}
                          onChange={handleOptionChange}
                          theme={theme}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'query' && config.queryConfig?.enabled && (
            <div className="space-y-6">
              <div
                className={`p-4 rounded-lg ${
                  isDark
                    ? 'bg-blue-900/20 border border-blue-800'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <p
                  className={`text-sm ${
                    isDark ? 'text-blue-200' : 'text-blue-800'
                  }`}
                >
                  Configure data source query parameters. These will be used to
                  fetch data from your backend.
                </p>
              </div>
              {config.queryConfig.fields.map((field) => (
                <FieldRenderer
                  key={field.key}
                  field={field}
                  value={query[field.key]}
                  onChange={handleQueryChange}
                  theme={theme}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        <div
          className={`flex items-center justify-between gap-3 p-6 border-t ${
            isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};