/* eslint-disable @typescript-eslint/no-explicit-any */
// types/configurator.types.ts
export type FieldType = 
  | 'text' 
  | 'number' 
  | 'select' 
  | 'multi-select'
  | 'boolean' 
  | 'color' 
  | 'color-array'
  | 'slider'
  | 'textarea'
  | 'json';

export interface ConfigField {
  key: string;
  label: string;
  type: FieldType;
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  description?: string;
  group?: string;
}

export interface VisualizationConfig {
  id: string;
  name: string;
  description?: string;
  dataFields: ConfigField[];
  optionFields: ConfigField[];
  queryConfig?: {
    enabled: boolean;
    fields: ConfigField[];
  };
}