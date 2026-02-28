import { WidgetLayoutItem } from '../models/widget.model';

/**
 * Defines the default set of widgets shown when the dashboard first loads.
 * Used by the mock API as the initial persisted layout for new users.
 * Each entry specifies the widget type, variant, and grid position.
 */
export const DEFAULT_LAYOUT: WidgetLayoutItem[] = [
  // Row 0: 6 KPI cards (1×1 each)
  { type: 'kpi', variantId: 'fellowship-count', x: 0, y: 0 },
  { type: 'kpi', variantId: 'rings-of-power', x: 1, y: 0 },
  { type: 'kpi', variantId: 'battles-won', x: 2, y: 0 },
  { type: 'kpi', variantId: 'realms', x: 3, y: 0 },
  { type: 'kpi', variantId: 'dark-lords', x: 4, y: 0 },
  { type: 'kpi', variantId: 'wizards', x: 5, y: 0 },
  // Row 1: 3 Stat cards (1×2 each)
  { type: 'stat', variantId: 'orc-armies', x: 0, y: 1 },
  { type: 'stat', variantId: 'elf-population', x: 1, y: 1 },
  { type: 'stat', variantId: 'hobbit-meals', x: 2, y: 1 },
  // Rows 1–3, Cols 3–5: Radar chart
  { type: 'radar-chart', variantId: 'fellowship-skills', x: 3, y: 1 },
  // Row 3, Cols 0–2: Horizontal bar chart
  { type: 'horizontal-bar-chart', variantId: 'battle-casualties', x: 0, y: 3 },
];
