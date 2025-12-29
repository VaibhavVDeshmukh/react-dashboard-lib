/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================================
// GENERIC FIELD RENDERER
// ============================================================================

// components/configurator/FieldRenderer.tsx
import React from 'react';
import { ConfigField } from './configurator.types';

interface FieldRendererProps {
  field: ConfigField;
  value: any;
  onChange: (key: string, value: any) => void;
  theme?: 'light' | 'dark' | 'system';
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-3 py-2 rounded-md border ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value ?? field.defaultValue ?? ''}
            onChange={(e) => onChange(field.key, parseFloat(e.target.value) || 0)}
            min={field.min}
            max={field.max}
            step={field.step || 1}
            className={`w-full px-3 py-2 rounded-md border ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value ?? field.defaultValue ?? false}
              onChange={(e) => onChange(field.key, e.target.checked)}
              className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              Enabled
            </span>
          </label>
        );

      case 'select':
        return (
          <select
            value={value ?? field.defaultValue ?? ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            className={`w-full px-3 py-2 rounded-md border ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value || '#3B82F6'}
              onChange={(e) => onChange(field.key, e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={value || '#3B82F6'}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={`flex-1 px-3 py-2 rounded-md border ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        );

      case 'color-array': {
        const colors = value || field.defaultValue || [];
        return (
          <div className="space-y-2">
            {colors.map((color: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...colors];
                    newColors[idx] = e.target.value;
                    onChange(field.key, newColors);
                  }}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...colors];
                    newColors[idx] = e.target.value;
                    onChange(field.key, newColors);
                  }}
                  className={`flex-1 px-3 py-2 rounded-md border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <button
                  onClick={() => {
                    const newColors = colors.filter((_: any, i: number) => i !== idx);
                    onChange(field.key, newColors);
                  }}
                  className="px-2 py-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => onChange(field.key, [...colors, '#3B82F6'])}
              className="text-sm text-blue-500 hover:underline"
            >
              + Add Color
            </button>
          </div>
        );
      }

      case 'slider':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={field.min || 0}
              max={field.max || 100}
              step={field.step || 1}
              value={value ?? field.defaultValue ?? 0}
              onChange={(e) => onChange(field.key, parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-center">
              {value ?? field.defaultValue ?? 0}
            </div>
          </div>
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`w-full px-3 py-2 rounded-md border ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        );

      case 'json':
        return (
          <textarea
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                onChange(field.key, parsed);
              } catch {
                // Keep as string if not valid JSON
                onChange(field.key, e.target.value);
              }
            }}
            placeholder={field.placeholder}
            rows={6}
            className={`w-full px-3 py-2 rounded-md border font-mono text-sm ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        );

      default:
        return <div className="text-red-500">Unknown field type: {field.type}</div>;
    }
  };

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${
        isDark ? 'text-gray-200' : 'text-gray-700'
      }`}>
        {field.label}
      </label>
      {renderField()}
      {field.description && (
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {field.description}
        </p>
      )}
    </div>
  );
};