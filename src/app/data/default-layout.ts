import { UserDashboardLayout } from '../models/widget.model';

const DEFAULT_COLUMNS = 6;

/**
 * Defines the default dashboard state shown when no persisted layout exists.
 * Used by the mock API as the initial layout for new users.
 */
export const DEFAULT_LAYOUT: UserDashboardLayout = {
  columns: DEFAULT_COLUMNS,
  widgets: [
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
    // Row 6: Line chart + Pie chart
    { type: 'line-chart', variantId: 'ring-corruption', x: 0, y: 6 },
    { type: 'pie-chart', variantId: 'ring-distribution', x: 3, y: 6 },
    // Row 9: Doughnut chart + Polar area chart
    { type: 'doughnut-chart', variantId: 'territory-control', x: 0, y: 9 },
    { type: 'polar-area-chart', variantId: 'fortress-strength', x: 2, y: 9 },
  ],
};
