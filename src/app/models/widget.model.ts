import { GridsterItemConfig } from 'angular-gridster2';

// ── Literal unions & derived types (can only be expressed as `type`) ──

export const WIDGET_TYPES = [
  'kpi',
  'stat',
  'bar-chart',
  'radar-chart',
  'horizontal-bar-chart',
] as const;

export type WidgetType = (typeof WIDGET_TYPES)[number];

export type ChartType = 'bar' | 'radar';

export type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

// ── Data-shape interfaces (plain object contracts → `interface`) ──

export interface Badge {
  value: string;
  severity: TagSeverity;
}

export interface KpiData {
  value: string | number;
}

export interface StatData {
  value: string | number;
  badge?: Badge;
}

export interface ChartData {
  labels: string[];
  datasets: Record<string, unknown>[];
}

// ── Composite data types (unions / intersections → `type`) ──

export type WidgetData = KpiData | StatData | ChartData;

/** API response shape: title metadata merged with payload. */
export type WidgetDataResponse = { title: string; subtitle?: string } & WidgetData;

/** A single widget variant entry stored in mock data or backend. */
export type WidgetEntry = { id: string } & WidgetDataResponse;

// ── Domain interfaces (object shapes, base → derived order) ──

/** A persisted widget placement as stored/returned by the API. */
export interface WidgetLayoutItem {
  type: WidgetType;
  variantId: string;
  x: number;
  y: number;
}

/** Full persisted dashboard state: grid settings + widget placements. */
export interface UserDashboardLayout {
  columns: number;
  widgets: WidgetLayoutItem[];
}

export interface AddWidgetEvent {
  type: WidgetType;
  variantId: string;
}

export interface WidgetCatalogItem extends AddWidgetEvent {
  label: string;
}

export interface WidgetCatalogGroup {
  label: string;
  icon: string;
  items: WidgetCatalogItem[];
}

export interface DashboardWidget extends GridsterItemConfig {
  id: string;
  type: WidgetType;
  variantId: string;
  title: string;
  subtitle?: string;
  loading: boolean;
  data: WidgetData | null;
}

// ── Constants ──

interface WidgetTypeConfig {
  label: string;
  icon: string;
  cols: number;
  rows: number;
}

export const WIDGET_TYPE_CONFIG: Record<WidgetType, WidgetTypeConfig> = {
  kpi: { label: 'KPI Indicator', icon: 'pi pi-hashtag', cols: 1, rows: 1 },
  stat: { label: 'Stat Card', icon: 'pi pi-chart-pie', cols: 1, rows: 2 },
  'bar-chart': { label: 'Bar Chart', icon: 'pi pi-chart-bar', cols: 3, rows: 3 },
  'radar-chart': { label: 'Radar Chart', icon: 'pi pi-chart-scatter', cols: 3, rows: 5 },
  'horizontal-bar-chart': {
    label: 'Horizontal Bar Chart',
    icon: 'pi pi-chart-bar',
    cols: 3,
    rows: 3,
  },
};
