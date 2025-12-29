// ============================================================================
// VISUALIZATION CONFIGURATIONS REGISTRY
// ============================================================================

// configurator/visualization-configs.ts
import { VisualizationConfig } from './configurator.types';

export const STAT_CONFIG: VisualizationConfig = {
  id: 'stat',
  name: 'Stat Panel',
  description: 'Display a single metric with optional sparkline',
  dataFields: [
    {
      key: 'value',
      label: 'Value',
      type: 'number',
      defaultValue: 0,
      description: 'The main numeric value to display'
    },
    {
      key: 'previousValue',
      label: 'Previous Value',
      type: 'number',
      description: 'Previous value for trend calculation'
    },
    {
      key: 'sparkline',
      label: 'Sparkline Data',
      type: 'json',
      placeholder: '[10, 20, 15, 25, 30]',
      description: 'Array of numbers for sparkline visualization'
    },
    {
      key: 'unit',
      label: 'Unit',
      type: 'text',
      placeholder: 'users',
      description: 'Unit label to display'
    }
  ],
  optionFields: [
    {
      key: 'prefix',
      label: 'Prefix',
      type: 'text',
      placeholder: '$',
      group: 'Formatting'
    },
    {
      key: 'suffix',
      label: 'Suffix',
      type: 'text',
      placeholder: 'k',
      group: 'Formatting'
    },
    {
      key: 'decimals',
      label: 'Decimal Places',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 10,
      group: 'Formatting'
    },
    {
      key: 'showSparkline',
      label: 'Show Sparkline',
      type: 'boolean',
      defaultValue: true,
      group: 'Display'
    },
    {
      key: 'showTrend',
      label: 'Show Trend',
      type: 'boolean',
      defaultValue: false,
      group: 'Display'
    }
  ],
  queryConfig: {
    enabled: true,
    fields: [
      {
        key: 'metric',
        label: 'Metric',
        type: 'select',
        options: [
          { label: 'Count', value: 'count' },
          { label: 'Sum', value: 'sum' },
          { label: 'Average', value: 'avg' },
          { label: 'Min', value: 'min' },
          { label: 'Max', value: 'max' }
        ]
      },
      {
        key: 'field',
        label: 'Field',
        type: 'text',
        placeholder: 'revenue'
      }
    ]
  }
};

export const GAUGE_CONFIG: VisualizationConfig = {
  id: 'gauge',
  name: 'Gauge',
  description: 'Display a value on a gauge',
  dataFields: [
    {
      key: 'value',
      label: 'Value',
      type: 'number',
      defaultValue: 0
    },
    {
      key: 'min',
      label: 'Min Value',
      type: 'number',
      defaultValue: 0
    },
    {
      key: 'max',
      label: 'Max Value',
      type: 'number',
      defaultValue: 100
    },
    {
      key: 'label',
      label: 'Label',
      type: 'text',
      placeholder: 'CPU Usage'
    },
    {
      key: 'unit',
      label: 'Unit',
      type: 'text',
      placeholder: '%'
    }
  ],
  optionFields: [
    {
      key: 'min',
      label: 'Gauge Min',
      type: 'number',
      defaultValue: 0,
      group: 'Range'
    },
    {
      key: 'max',
      label: 'Gauge Max',
      type: 'number',
      defaultValue: 100,
      group: 'Range'
    },
    {
      key: 'decimals',
      label: 'Decimal Places',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 10,
      group: 'Formatting'
    },
    {
      key: 'needle',
      label: 'Use Needle',
      type: 'boolean',
      defaultValue: false,
      group: 'Display'
    },
    {
      key: 'showValue',
      label: 'Show Value',
      type: 'boolean',
      defaultValue: true,
      group: 'Display'
    },
    {
      key: 'showLabels',
      label: 'Show Labels',
      type: 'boolean',
      defaultValue: true,
      group: 'Display'
    }
  ],
  queryConfig: {
    enabled: true,
    fields: [
      {
        key: 'metric',
        label: 'Metric',
        type: 'select',
        options: [
          { label: 'Latest Value', value: 'latest' },
          { label: 'Average', value: 'avg' },
          { label: 'Sum', value: 'sum' }
        ]
      }
    ]
  }
};

export const TIME_SERIES_CONFIG: VisualizationConfig = {
  id: 'timeSeries',
  name: 'Time Series',
  description: 'Display time-based data',
  dataFields: [
    {
      key: 'series',
      label: 'Series Data',
      type: 'json',
      placeholder: '[{"label": "Series 1", "points": [[1, 10], [2, 20]]}]',
      description: 'Array of series objects with label and points'
    }
  ],
  optionFields: [
    {
      key: 'mode',
      label: 'Display Mode',
      type: 'select',
      options: [
        { label: 'Line', value: 'line' },
        { label: 'Area', value: 'area' },
        { label: 'Bar', value: 'bar' }
      ],
      defaultValue: 'line',
      group: 'Display'
    },
    {
      key: 'showLegend',
      label: 'Show Legend',
      type: 'boolean',
      defaultValue: true,
      group: 'Display'
    },
    {
      key: 'stacking',
      label: 'Stack Series',
      type: 'boolean',
      defaultValue: false,
      group: 'Display'
    },
    {
      key: 'colors',
      label: 'Colors',
      type: 'color-array',
      defaultValue: ['#3B82F6', '#10B981', '#F59E0B'],
      group: 'Styling'
    }
  ],
  queryConfig: {
    enabled: true,
    fields: [
      {
        key: 'timeField',
        label: 'Time Field',
        type: 'text',
        placeholder: 'timestamp'
      },
      {
        key: 'valueField',
        label: 'Value Field',
        type: 'text',
        placeholder: 'count'
      },
      {
        key: 'groupBy',
        label: 'Group By',
        type: 'text',
        placeholder: 'category'
      }
    ]
  }
};

export const BAR_CONFIG: VisualizationConfig = {
  id: 'bar',
  name: 'Bar Chart',
  description: 'Display categorical data',
  dataFields: [
    {
      key: 'labels',
      label: 'Labels',
      type: 'json',
      placeholder: '["Category 1", "Category 2"]',
      description: 'Array of category labels'
    },
    {
      key: 'values',
      label: 'Values',
      type: 'json',
      placeholder: '[10, 20, 30]',
      description: 'Array of numeric values'
    }
  ],
  optionFields: [
    {
      key: 'orientation',
      label: 'Orientation',
      type: 'select',
      options: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' }
      ],
      defaultValue: 'vertical',
      group: 'Display'
    },
    {
      key: 'colors',
      label: 'Colors',
      type: 'color-array',
      defaultValue: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      group: 'Styling'
    }
  ]
};

export const PIE_CONFIG: VisualizationConfig = {
  id: 'pie',
  name: 'Pie Chart',
  description: 'Display proportional data',
  dataFields: [
    {
      key: 'labels',
      label: 'Labels',
      type: 'json',
      placeholder: '["Slice 1", "Slice 2"]'
    },
    {
      key: 'values',
      label: 'Values',
      type: 'json',
      placeholder: '[30, 70]'
    }
  ],
  optionFields: [
    {
      key: 'donut',
      label: 'Donut Chart',
      type: 'boolean',
      defaultValue: false,
      group: 'Display'
    },
    {
      key: 'showLabels',
      label: 'Show Labels',
      type: 'boolean',
      defaultValue: true,
      group: 'Display'
    },
    {
      key: 'colors',
      label: 'Colors',
      type: 'color-array',
      defaultValue: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      group: 'Styling'
    }
  ]
};

export const TABLE_CONFIG: VisualizationConfig = {
  id: 'table',
  name: 'Table',
  description: 'Display tabular data',
  dataFields: [
    {
      key: 'rows',
      label: 'Table Data',
      type: 'json',
      placeholder: '[["Header 1", "Header 2"], ["Row 1 Col 1", "Row 1 Col 2"]]',
      description: 'Array of arrays representing rows and columns'
    }
  ],
  optionFields: [
    {
      key: 'pageSize',
      label: 'Page Size',
      type: 'number',
      defaultValue: 10,
      min: 5,
      max: 100,
      group: 'Display'
    },
    {
      key: 'showPagination',
      label: 'Show Pagination',
      type: 'boolean',
      defaultValue: true,
      group: 'Display'
    }
  ]
};

// Registry of all configurations
export const VISUALIZATION_CONFIGS: Record<string, VisualizationConfig> = {
  stat: STAT_CONFIG,
  gauge: GAUGE_CONFIG,
  timeSeries: TIME_SERIES_CONFIG,
  bar: BAR_CONFIG,
  pie: PIE_CONFIG,
  table: TABLE_CONFIG
};

export const getVisualizationConfig = (type: string): VisualizationConfig | undefined => {
  return VISUALIZATION_CONFIGS[type];
};