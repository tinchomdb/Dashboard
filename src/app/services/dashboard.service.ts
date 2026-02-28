import { Injectable, signal, computed, inject } from '@angular/core';
import { GridsterConfig, GridType, CompactType, DisplayGrid } from 'angular-gridster2';
import { DashboardRepository } from '../repositories/dashboard.repository';
import {
  AddWidgetEvent,
  DashboardWidget,
  UserDashboardLayout,
  WidgetCatalogGroup,
  WidgetData,
  WidgetDataResponse,
  WIDGET_TYPE_CONFIG,
  WIDGET_TYPES,
  WidgetType,
} from '../models/widget.model';

const DEFAULT_COLUMNS = 6;
const DEFAULT_MARGIN = 12;
const ROW_HEIGHT_RATIO = 0.5;

/**
 * Manages the dashboard grid configuration and widget collection.
 * Self-initialising: loads catalog and widget data on construction.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly dashboardRepository = inject(DashboardRepository);

  // ── State ──

  readonly widgets = signal<DashboardWidget[]>([]);
  readonly columns = signal(DEFAULT_COLUMNS);
  readonly typeFilter = signal<Set<WidgetType>>(new Set(WIDGET_TYPES));
  readonly widgetCatalog = signal<WidgetCatalogGroup[]>([]);

  // ── Derived ──

  readonly filteredWidgets = computed(() =>
    this.widgets().filter((w) => this.typeFilter().has(w.type)),
  );

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
    draggable: { enabled: true, ignoreContent: true, dragHandleClass: 'widget-drag-handle' },
    resizable: { enabled: true },
    itemChangeCallback: () => this.persistLayout(),
  });

  constructor() {
    this.initializeWidgets();
    this.loadWidgetCatalog();
  }

  // ── Public API ──

  addWidget({ type, variantId }: AddWidgetEvent): DashboardWidget {
    const widget = this.createWidget(type, variantId);
    this.widgets.update((list) => [...list, widget]);
    this.loadWidgetData(widget);
    this.persistLayout();
    return widget;
  }

  removeWidget(id: string): void {
    this.widgets.update((list) => list.filter((w) => w.id !== id));
    this.persistLayout();
  }

  updateWidget(id: string, changes: Partial<DashboardWidget>): void {
    this.widgets.update((list) => list.map((w) => (w.id === id ? { ...w, ...changes } : w)));
  }

  updateColumns(columns: number): void {
    this.columns.set(columns);

    const clamped = this.widgets().map((w) => {
      const cols = Math.min(w.cols, columns);
      return { ...w, cols, x: Math.min(w.x, columns - cols) };
    });

    this.widgets.set(this.resolveCollisions(clamped, columns));
    this.gridOptions.update((opts) => ({
      ...opts,
      minCols: columns,
      maxCols: columns,
      maxItemCols: columns,
    }));
    this.persistLayout();
  }

  toggleTypeFilter(type: WidgetType): void {
    this.typeFilter.update((current) => {
      const next = new Set(current);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  }

  // ── Private loaders ──

  private loadWidgetCatalog(): void {
    this.dashboardRepository.fetchWidgetCatalog().subscribe({
      next: (catalog) => this.widgetCatalog.set(catalog),
      error: (err) => console.error('Failed to load widget catalog', err),
    });
  }

  private initializeWidgets(): void {
    this.dashboardRepository.fetchUserLayout().subscribe({
      next: (layout) => this.applyLayout(layout),
      error: (err) => console.error('Failed to load user layout', err),
    });
  }

  private applyLayout({ columns, widgets }: UserDashboardLayout): void {
    this.columns.set(columns);
    this.gridOptions.update((opts) => ({
      ...opts,
      minCols: columns,
      maxCols: columns,
      maxItemCols: columns,
    }));
    this.widgets.set(
      widgets.map(({ type, variantId, x, y }) => this.createWidget(type, variantId, { x, y })),
    );
    this.widgets().forEach((w) => this.loadWidgetData(w));
  }

  private loadWidgetData(widget: DashboardWidget): void {
    this.dashboardRepository
      .fetchWidgetData<WidgetDataResponse>(widget.type, widget.variantId)
      .subscribe({
        next: ({ title, subtitle, ...data }) =>
          this.updateWidget(widget.id, {
            title,
            subtitle,
            data: data as WidgetData,
            loading: false,
          }),
        error: (err) => {
          console.error(`Failed to load data for widget ${widget.id}`, err);
          this.updateWidget(widget.id, { data: null, loading: false });
        },
      });
  }

  private persistLayout(): void {
    const layout: UserDashboardLayout = {
      columns: this.columns(),
      widgets: this.widgets().map(({ type, variantId, x, y }) => ({
        type,
        variantId,
        x,
        y,
      })),
    };
    this.dashboardRepository.saveUserLayout(layout).subscribe({
      error: (err) => console.error('Failed to save layout', err),
    });
  }

  // ── Private helpers ──

  private createWidget(
    type: WidgetType,
    variantId: string,
    pos?: { x: number; y: number },
  ): DashboardWidget {
    const config = WIDGET_TYPE_CONFIG[type];
    return {
      id: crypto.randomUUID(),
      type,
      variantId,
      title: config.label,
      loading: true,
      data: null,
      x: pos?.x ?? 0,
      y: pos?.y ?? 0,
      cols: config.cols,
      rows: config.rows,
    };
  }

  /**
   * Resolves overlapping widget positions after column changes. Widgets are
   * processed in visual order (top-to-bottom, left-to-right) so earlier
   * widgets keep their position; later ones move to the next free slot.
   */
  private resolveCollisions(widgets: DashboardWidget[], columns: number): DashboardWidget[] {
    const sorted = [...widgets].sort((a, b) => a.y - b.y || a.x - b.x);
    const grid: boolean[][] = [];

    const isFree = (x: number, y: number, cols: number, rows: number): boolean => {
      for (let r = y; r < y + rows; r++) {
        for (let c = x; c < x + cols; c++) {
          if (grid[r]?.[c]) return false;
        }
      }
      return true;
    };

    const occupy = (x: number, y: number, cols: number, rows: number): void => {
      for (let r = y; r < y + rows; r++) {
        grid[r] ??= new Array(columns).fill(false);
        for (let c = x; c < x + cols; c++) grid[r][c] = true;
      }
    };

    const firstFreeSlot = (cols: number, rows: number): { x: number; y: number } => {
      for (let r = 0; ; r++) {
        for (let c = 0; c <= columns - cols; c++) {
          if (isFree(c, r, cols, rows)) return { x: c, y: r };
        }
      }
    };

    return sorted.map((widget) => {
      const { cols, rows } = widget;
      const pos = isFree(widget.x, widget.y, cols, rows)
        ? { x: widget.x, y: widget.y }
        : firstFreeSlot(cols, rows);
      occupy(pos.x, pos.y, cols, rows);
      return { ...widget, ...pos };
    });
  }
}
