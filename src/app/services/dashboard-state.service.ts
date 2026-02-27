import { Injectable, signal, computed, inject } from '@angular/core';
import { GridsterConfig, GridType, CompactType, DisplayGrid, GridsterApi } from 'angular-gridster2';
import { WidgetFactoryService } from './widget-factory.service';
import { WidgetDataRepository } from '../repositories/widget-data.repository';
import { MenuItem } from 'primeng/api';
import {
  AddWidgetEvent,
  DashboardWidget,
  WidgetEntry,
  WIDGET_TYPE_LABELS,
  WIDGET_TYPES,
  WidgetType,
} from '../models/widget.model';

const DEFAULT_COLUMNS = 6;
const DEFAULT_MARGIN = 12;
const ROW_HEIGHT_RATIO = 0.5;

/**
 * Manages the dashboard grid configuration and widget collection.
 * Single responsibility: state management for the dashboard layout.
 * Self-initialising: loads catalog and widget data on construction.
 */
@Injectable({ providedIn: 'root' })
export class DashboardStateService {
  private readonly factory = inject(WidgetFactoryService);
  private readonly repository = inject(WidgetDataRepository);
  private gridsterApi: GridsterApi | null = null;

  // ── Widget catalog state ──
  readonly widgetCatalog = signal<Record<WidgetType, WidgetEntry[]>>({
    kpi: [],
    stat: [],
    'bar-chart': [],
    'radar-chart': [],
    'horizontal-bar-chart': [],
  });

  // ── Widget state ──
  readonly widgets = signal<DashboardWidget[]>([]);
  readonly columns = signal(DEFAULT_COLUMNS);
  readonly typeFilter = signal<Set<WidgetType>>(new Set(WIDGET_TYPES));

  readonly filteredWidgets = computed(() => {
    const filter = this.typeFilter();
    return this.widgets().filter((w) => filter.has(w.type));
  });

  // ── Derived: menu items for the "Add Widget" menu ──
  readonly addWidgetMenuItems = computed<MenuItem[]>(() => {
    const catalog = this.widgetCatalog();
    return WIDGET_TYPES.map((type) => ({
      label: WIDGET_TYPE_LABELS[type],
      icon: this.getWidgetIcon(type),
      items: (catalog[type] ?? []).map((variant) => ({
        label: variant.label,
        command: () => this.addWidget({ type, variantId: variant.id }),
      })),
    }));
  });

  /**
   * Signal-based options so Gridster's input signal detects changes.
   * Every mutation creates a new object reference to trigger Angular's
   * change detection in the Gridster component.
   */
  readonly gridOptions = signal<GridsterConfig>({
    gridType: GridType.ScrollVertical,
    compactType: CompactType.CompactUp,
    displayGrid: DisplayGrid.OnDragAndResize,
    rowHeightRatio: ROW_HEIGHT_RATIO,
    margin: DEFAULT_MARGIN,
    outerMargin: true,
    minCols: DEFAULT_COLUMNS,
    maxCols: DEFAULT_COLUMNS,
    minRows: 1,
    maxRows: 100,
    defaultItemCols: 1,
    defaultItemRows: 1,
    pushItems: true,
    swap: false,
    draggable: {
      enabled: true,
      ignoreContent: true,
      dragHandleClass: 'widget-drag-handle',
    },
    resizable: {
      enabled: true,
    },
    itemResizeCallback: () => {
      window.dispatchEvent(new Event('resize'));
    },
    initCallback: (_gridster, api) => {
      this.gridsterApi = api;
    },
  });

  constructor() {
    this.widgets.set(this.factory.createDefaultWidgets());
    this.loadWidgetCatalog();
    this.loadAllWidgetData();
  }

  // ── HTTP loaders ──

  private loadWidgetCatalog(): void {
    this.repository.fetchWidgetCatalog().subscribe({
      next: (catalog) => this.widgetCatalog.set(catalog),
    });
  }

  loadWidgetData(widget: DashboardWidget): void {
    this.repository.fetchWidgetData(widget.type, widget.variantId).subscribe({
      next: (data) => this.updateWidget(widget.id, { data, loading: false }),
      error: () => this.updateWidget(widget.id, { data: null, loading: false }),
    });
  }

  private loadAllWidgetData(): void {
    for (const widget of this.widgets()) {
      this.loadWidgetData(widget);
    }
  }

  // ── Mutations ──

  addWidget(event: AddWidgetEvent): DashboardWidget {
    const widget = this.factory.createWidget(event.type, event.variantId);
    this.gridsterApi?.getNextPossiblePosition?.(widget);
    this.widgets.update((list) => [...list, widget]);
    this.loadWidgetData(widget);
    return widget;
  }

  removeWidget(id: string): void {
    this.widgets.update((list) => list.filter((w) => w.id !== id));
  }

  updateWidget(id: string, changes: Partial<DashboardWidget>): void {
    this.widgets.update((list) => list.map((w) => (w.id === id ? { ...w, ...changes } : w)));
  }

  updateColumns(columns: number): void {
    this.columns.set(columns);

    // Clamp widget sizes that exceed the new column count
    this.widgets.update((list) =>
      list.map((w) => (w.cols > columns ? { ...w, cols: columns } : w)),
    );

    this.gridOptions.update((opts) => ({ ...opts, minCols: columns, maxCols: columns }));
    this.gridsterApi?.resize?.();
  }

  toggleTypeFilter(type: WidgetType): void {
    this.typeFilter.update((set) => {
      const next = new Set(set);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  private getWidgetIcon(type: WidgetType): string {
    const icons: Record<WidgetType, string> = {
      kpi: 'pi pi-hashtag',
      stat: 'pi pi-chart-pie',
      'bar-chart': 'pi pi-chart-bar',
      'radar-chart': 'pi pi-chart-scatter',
      'horizontal-bar-chart': 'pi pi-chart-bar',
    };
    return icons[type];
  }
}
