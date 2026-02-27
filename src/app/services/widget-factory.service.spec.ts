import { TestBed } from '@angular/core/testing';
import { WidgetFactoryService } from './widget-factory.service';
import { WIDGET_TYPE_LABELS } from '../models/widget.model';
import { WIDGET_MOCK_DATA } from '../data/mock-data';

describe('WidgetFactoryService', () => {
  let service: WidgetFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createWidget', () => {
    it('should create a widget with variant title', () => {
      const widget = service.createWidget('kpi', 'fellowship-count');
      expect(widget.type).toBe('kpi');
      expect(widget.title).toBe('Fellowship Members');
      expect(widget.loading).toBe(true);
      expect(widget.data).toBeNull();
      expect(widget.cols).toBe(1);
      expect(widget.rows).toBe(1);
    });

    it('should fall back to type label for unknown variant', () => {
      const widget = service.createWidget('kpi', 'unknown-variant');
      expect(widget.title).toBe(WIDGET_TYPE_LABELS.kpi);
    });

    it('should generate unique IDs', () => {
      const w1 = service.createWidget('kpi', 'fellowship-count');
      const w2 = service.createWidget('kpi', 'fellowship-count');
      expect(w1.id).not.toBe(w2.id);
    });

    it('should set correct endpoint from type and variant', () => {
      const widget = service.createWidget('stat', 'orc-armies');
      expect(widget.variantId).toBe('orc-armies');
    });

    it('should apply overrides', () => {
      const widget = service.createWidget('kpi', 'wizards', { x: 3, y: 2 });
      expect(widget.x).toBe(3);
      expect(widget.y).toBe(2);
    });

    it('should include subtitle from variant when available', () => {
      const widget = service.createWidget('radar-chart', 'fellowship-skills');
      expect(widget.subtitle).toBeTruthy();
    });
  });

  describe('createDefaultWidgets', () => {
    it('should create 11 default widgets', () => {
      const widgets = service.createDefaultWidgets();
      expect(widgets.length).toBe(11);
    });

    it('should have 6 KPI widgets in row 0', () => {
      const widgets = service.createDefaultWidgets();
      const kpis = widgets.filter((w) => w.type === 'kpi');
      expect(kpis.length).toBe(6);
      kpis.forEach((kpi) => expect(kpi.y).toBe(0));
    });

    it('should have 3 stat widgets in row 1', () => {
      const widgets = service.createDefaultWidgets();
      const stats = widgets.filter((w) => w.type === 'stat');
      expect(stats.length).toBe(3);
      stats.forEach((stat) => expect(stat.y).toBe(1));
    });

    it('should derive titles from the data catalog', () => {
      const widgets = service.createDefaultWidgets();
      const firstKpi = widgets.find((w) => w.type === 'kpi');
      const expectedTitle = WIDGET_MOCK_DATA.kpi[0].title;
      expect(firstKpi!.title).toBe(expectedTitle);
    });

    it('should have a radar chart', () => {
      const widgets = service.createDefaultWidgets();
      const radar = widgets.find((w) => w.type === 'radar-chart');
      expect(radar).toBeTruthy();
      expect(radar!.x).toBe(3);
      expect(radar!.cols).toBe(3);
    });

    it('should have a horizontal bar chart', () => {
      const widgets = service.createDefaultWidgets();
      const bar = widgets.find((w) => w.type === 'horizontal-bar-chart');
      expect(bar).toBeTruthy();
      expect(bar!.cols).toBe(3);
    });
  });
});
