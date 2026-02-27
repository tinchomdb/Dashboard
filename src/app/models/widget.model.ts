import { GridsterItemConfig } from 'angular-gridster2';

// ── Types ──

export const WIDGET_TYPES = [
  'kpi',
  'stat',
  'bar-chart',
  'radar-chart',
  'horizontal-bar-chart',
] as const;

export type WidgetType = (typeof WIDGET_TYPES)[number];

export type ChartType = 'bar' | 'line' | 'radar' | 'pie' | 'doughnut' | 'polarArea';

export type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

// ── Interfaces ──

export interface UserProfile {
  name: string;
  lastLogin: string;
}

/** A single widget variant entry with metadata and payload. */
export interface WidgetEntry {
  id: string;
  label: string;
  title: string;
  subtitle?: string;
  [key: string]: unknown;
}

export interface DashboardWidget extends GridsterItemConfig {
  id: string;
  type: WidgetType;
  variantId: string;
  title: string;
  subtitle?: string;
  loading: boolean;
  data: unknown;
}

export interface AddWidgetEvent {
  type: WidgetType;
  variantId: string;
}

// ── Constants ──

export const WIDGET_TYPE_LABELS: Record<WidgetType, string> = {
  kpi: 'KPI Indicator',
  stat: 'Stat Card',
  'bar-chart': 'Bar Chart',
  'radar-chart': 'Radar Chart',
  'horizontal-bar-chart': 'Horizontal Bar Chart',
};

export const WIDGET_TYPE_DEFAULTS: Record<WidgetType, { cols: number; rows: number }> = {
  kpi: { cols: 1, rows: 1 },
  stat: { cols: 1, rows: 2 },
  'bar-chart': { cols: 3, rows: 3 },
  'radar-chart': { cols: 3, rows: 5 },
  'horizontal-bar-chart': { cols: 3, rows: 3 },
};
