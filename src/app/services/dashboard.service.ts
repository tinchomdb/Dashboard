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
export class DashboardService {
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
    compactType: CompactType.CompactUpAndLeft,
    displayGrid: DisplayGrid.OnDragAndResize,
    rowHeightRatio: ROW_HEIGHT_RATIO,
    margin: DEFAULT_MARGIN,
    outerMargin: true,
    minCols: DEFAULT_COLUMNS,
    maxCols: DEFAULT_COLUMNS,
    maxItemCols: DEFAULT_COLUMNS,
    minRows: 1,
    maxRows: 100,
    defaultItemCols: 1,
    defaultItemRows: 1,
    pushItems: true,
    swap: false,
    disableAutoPositionOnConflict: false,
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

    // Clamp widget sizes and positions that exceed the new column count
    const clamped = this.widgets().map((w) => {
      const cols = Math.min(w.cols, columns);
      const x = Math.min(w.x, columns - cols);
      return cols !== w.cols || x !== w.x ? { ...w, cols, x } : w;
    });

    // Resolve any overlapping positions caused by clamping
    this.widgets.set(this.resolveCollisions(clamped, columns));

    this.gridOptions.update((opts) => ({
      ...opts,
      minCols: columns,
      maxCols: columns,
      maxItemCols: columns,
    }));
    this.gridsterApi?.resize?.();
  }

  /**
   * Resolves overlapping widget positions by re-placing colliding widgets
   * into the first available grid slot. Widgets are processed in visual
   * order (top-to-bottom, left-to-right) so earlier widgets keep priority.
   */
  private resolveCollisions(widgets: DashboardWidget[], columns: number): DashboardWidget[] {
    // Sort by position: top rows first, then leftmost
    const sorted = [...widgets].sort((a, b) => a.y - b.y || a.x - b.x);

    // Occupancy grid: grid[row][col] = true if occupied
    const grid: boolean[][] = [];

    const isOccupied = (x: number, y: number, cols: number, rows: number): boolean => {
      for (let r = y; r < y + rows; r++) {
        for (let c = x; c < x + cols; c++) {
          if (grid[r]?.[c]) return true;
        }
      }
      return false;
    };

    const markOccupied = (x: number, y: number, cols: number, rows: number): void => {
      for (let r = y; r < y + rows; r++) {
        if (!grid[r]) grid[r] = new Array(columns).fill(false);
        for (let c = x; c < x + cols; c++) {
          grid[r][c] = true;
        }
      }
    };

    const findFirstFreePosition = (cols: number, rows: number): { x: number; y: number } => {
      for (let r = 0; ; r++) {
        for (let c = 0; c <= columns - cols; c++) {
          if (!isOccupied(c, r, cols, rows)) return { x: c, y: r };
        }
      }
    };

    const result: DashboardWidget[] = [];

    for (const widget of sorted) {
      if (!isOccupied(widget.x, widget.y, widget.cols, widget.rows)) {
        // Position is free — keep it
        markOccupied(widget.x, widget.y, widget.cols, widget.rows);
        result.push(widget);
      } else {
        // Collision — find the first available slot
        const pos = findFirstFreePosition(widget.cols, widget.rows);
        markOccupied(pos.x, pos.y, widget.cols, widget.rows);
        result.push({ ...widget, ...pos });
      }
    }

    return result;
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
