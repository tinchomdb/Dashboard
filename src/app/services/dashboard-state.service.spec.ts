import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardStateService } from './dashboard-state.service';

describe('DashboardStateService', () => {
  let service: DashboardStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DashboardStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default widgets', () => {
    expect(service.widgets().length).toBe(11);
  });

  it('should initialize with 6 columns', () => {
    expect(service.columns()).toBe(6);
  });

  describe('addWidget', () => {
    it('should add a widget and increase count', () => {
      const initialCount = service.widgets().length;
      service.addWidget({ type: 'kpi', variantId: 'fellowship-count' });
      expect(service.widgets().length).toBe(initialCount + 1);
    });

    it('should return the newly created widget', () => {
      const widget = service.addWidget({ type: 'stat', variantId: 'orc-armies' });
      expect(widget.type).toBe('stat');
      expect(widget.loading).toBe(true);
    });

    it('should add widget of correct type', () => {
      const widget = service.addWidget({ type: 'radar-chart', variantId: 'fellowship-skills' });
      const found = service.widgets().find((w) => w.id === widget.id);
      expect(found).toBeTruthy();
      expect(found!.type).toBe('radar-chart');
    });
  });

  describe('removeWidget', () => {
    it('should remove a widget by id', () => {
      const widgets = service.widgets();
      const target = widgets[0];
      const initialCount = widgets.length;

      service.removeWidget(target.id);
      expect(service.widgets().length).toBe(initialCount - 1);
      expect(service.widgets().find((w) => w.id === target.id)).toBeUndefined();
    });

    it('should not change list when id does not exist', () => {
      const initialCount = service.widgets().length;
      service.removeWidget('nonexistent-id');
      expect(service.widgets().length).toBe(initialCount);
    });
  });

  describe('updateWidget', () => {
    it('should update widget properties', () => {
      const target = service.widgets()[0];
      service.updateWidget(target.id, { loading: false, data: { value: 42 } });

      const updated = service.widgets().find((w) => w.id === target.id);
      expect(updated!.loading).toBe(false);
      expect(updated!.data).toEqual({ value: 42 });
    });

    it('should not affect other widgets', () => {
      const widgets = service.widgets();
      const target = widgets[0];
      const other = widgets[1];

      service.updateWidget(target.id, { title: 'Updated' });

      const otherAfter = service.widgets().find((w) => w.id === other.id);
      expect(otherAfter!.title).toBe(other.title);
    });
  });

  describe('updateColumns', () => {
    it('should update column count', () => {
      service.updateColumns(8);
      expect(service.columns()).toBe(8);
    });

    it('should update maxCols and minCols on the grid options signal', () => {
      service.updateColumns(4);
      expect(service.gridOptions().maxCols).toBe(4);
      expect(service.gridOptions().minCols).toBe(4);
    });

    it('should clamp widget cols that exceed new column count', () => {
      // Default radar-chart has cols=3; reducing to 2 should clamp it
      service.updateColumns(2);
      const wideWidgets = service.widgets().filter((w) => w.cols > 2);
      expect(wideWidgets.length).toBe(0);
    });

    it('should update maxItemCols to match column count', () => {
      service.updateColumns(3);
      expect(service.gridOptions().maxItemCols).toBe(3);
    });

    it('should clamp widget x positions to stay within grid', () => {
      // Manually place a widget at x=3 with cols=1 in a 4-col grid
      service.updateWidget(service.widgets()[0].id, { x: 3, cols: 1 });
      // Shrink to 2 columns: x=3 with cols=1 exceeds grid (3+1 > 2)
      service.updateColumns(2);
      const widget = service.widgets()[0];
      expect(widget.x + widget.cols).toBeLessThanOrEqual(2);
    });

    it('should resolve overlapping widgets into new rows when columns shrink', () => {
      // 6 KPI cards at x=0..5, y=0 — reducing to 3 columns should push
      // overflow cards to new rows rather than stacking
      service.updateColumns(3);
      const positions = service.widgets().map((w) => `${w.x},${w.y}`);
      const uniquePositions = new Set(positions);
      // No two widgets should share the exact same top-left corner
      expect(uniquePositions.size).toBe(positions.length);
    });

    it('should not create any cell overlap between widgets', () => {
      service.updateColumns(2);
      const widgets = service.widgets();
      let hasOverlap = false;
      for (let i = 0; i < widgets.length; i++) {
        for (let j = i + 1; j < widgets.length; j++) {
          const a = widgets[i];
          const b = widgets[j];
          if (
            a.x < b.x + b.cols &&
            a.x + a.cols > b.x &&
            a.y < b.y + b.rows &&
            a.y + a.rows > b.y
          ) {
            hasOverlap = true;
          }
        }
      }
      expect(hasOverlap).toBe(false);
    });

    it('should preserve relative visual order after column reduction', () => {
      // The first KPI (originally x=0,y=0) should remain at or near the top
      const firstKpi = service.widgets()[0];
      service.updateColumns(3);
      const updated = service.widgets().find((w) => w.id === firstKpi.id)!;
      expect(updated.y).toBe(0);
      expect(updated.x).toBe(0);
    });

    it('should stack all widgets vertically when reduced to 1 column', () => {
      service.updateColumns(1);
      const widgets = service.widgets();
      // Every widget should have x=0 and cols clamped to 1
      for (const w of widgets) {
        expect(w.x).toBe(0);
        expect(w.cols).toBe(1);
      }
      // No overlaps: each widget occupies unique rows
      let hasOverlap = false;
      for (let i = 0; i < widgets.length; i++) {
        for (let j = i + 1; j < widgets.length; j++) {
          const a = widgets[i];
          const b = widgets[j];
          if (a.y < b.y + b.rows && a.y + a.rows > b.y) {
            hasOverlap = true;
          }
        }
      }
      expect(hasOverlap).toBe(false);
    });
  });

  describe('gridOptions', () => {
    it('should have draggable enabled', () => {
      expect(service.gridOptions().draggable?.enabled).toBe(true);
    });

    it('should have resizable enabled', () => {
      expect(service.gridOptions().resizable?.enabled).toBe(true);
    });

    it('should have pushItems enabled', () => {
      expect(service.gridOptions().pushItems).toBe(true);
    });

    it('should have rowHeightRatio set to 0.5', () => {
      expect(service.gridOptions().rowHeightRatio).toBe(0.5);
    });
  });

  describe('typeFilter', () => {
    it('should start with all types active', () => {
      expect(service.typeFilter().size).toBe(5);
    });

    it('should toggle a type off', () => {
      service.toggleTypeFilter('kpi');
      expect(service.typeFilter().has('kpi')).toBe(false);
    });

    it('should toggle a type back on', () => {
      service.toggleTypeFilter('kpi');
      service.toggleTypeFilter('kpi');
      expect(service.typeFilter().has('kpi')).toBe(true);
    });
  });

  describe('filteredWidgets', () => {
    it('should return all widgets when all types active', () => {
      expect(service.filteredWidgets().length).toBe(service.widgets().length);
    });

    it('should exclude hidden types', () => {
      service.toggleTypeFilter('kpi');
      const filtered = service.filteredWidgets();
      expect(filtered.every((w) => w.type !== 'kpi')).toBe(true);
      expect(filtered.length).toBeLessThan(service.widgets().length);
    });
  });

  describe('widgetCatalog', () => {
    it('should initialize with empty arrays for each type', () => {
      const catalog = service.widgetCatalog();
      expect(catalog.kpi).toEqual([]);
      expect(catalog.stat).toEqual([]);
      expect(catalog['bar-chart']).toEqual([]);
    });
  });

  describe('addWidgetMenuItems', () => {
    it('should derive menu items from widget catalog', () => {
      service.widgetCatalog.set({
        kpi: [{ id: 'test-kpi', label: 'Test KPI', title: 'Test KPI Title' }],
        stat: [],
        'bar-chart': [],
        'radar-chart': [],
        'horizontal-bar-chart': [],
      });
      const items = service.addWidgetMenuItems();
      const kpiItem = items.find((m) => m.label === 'KPI Indicator');
      expect(kpiItem).toBeTruthy();
      expect(kpiItem!.items!.length).toBe(1);
      expect(kpiItem!.items![0].label).toBe('Test KPI');
    });

    it('should return empty sub-items when catalog is empty', () => {
      const items = service.addWidgetMenuItems();
      expect(items.length).toBe(5);
      items.forEach((item) => {
        expect(item.items).toEqual([]);
      });
    });
  });
});
