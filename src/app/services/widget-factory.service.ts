import { Injectable } from '@angular/core';

import { WIDGET_MOCK_DATA } from '../data/mock-data';
import {
  WidgetType,
  DashboardWidget,
  WIDGET_TYPE_DEFAULTS,
  WIDGET_TYPE_LABELS,
} from '../models/widget.model';

@Injectable({ providedIn: 'root' })
export class WidgetFactoryService {
  private idCounter = 0;

  createWidget(
    type: WidgetType,
    variantId: string,
    overrides?: Partial<DashboardWidget>,
  ): DashboardWidget {
    const variant = WIDGET_MOCK_DATA[type].find((v) => v.id === variantId);
    const defaults = WIDGET_TYPE_DEFAULTS[type];
    const id = ++this.idCounter;

    return {
      id: `widget-${id}`,
      type,
      variantId,
      title: variant?.title ?? WIDGET_TYPE_LABELS[type],
      subtitle: variant?.subtitle as string | undefined,
      loading: true,
      data: null,
      x: 0,
      y: 0,
      cols: defaults.cols,
      rows: defaults.rows,
      ...overrides,
    };
  }

  createDefaultWidgets(): DashboardWidget[] {
    const kpiVariants = WIDGET_MOCK_DATA.kpi;
    const statVariants = WIDGET_MOCK_DATA.stat;

    return [
      // Row 0: 6 KPI cards (1×1 each)
      ...kpiVariants.map((v, i) => this.createWidget('kpi', v.id, { x: i, y: 0 })),
      // Row 1: 3 Stat cards (1×2 each)
      ...statVariants.map((v, i) => this.createWidget('stat', v.id, { x: i, y: 1 })),
      // Rows 1–3, Cols 3–5: Radar chart
      this.createWidget('radar-chart', 'fellowship-skills', { x: 3, y: 1 }),
      // Row 3, Cols 0–2: Horizontal bar chart
      this.createWidget('horizontal-bar-chart', 'battle-casualties', { x: 0, y: 3 }),
    ];
  }
}
