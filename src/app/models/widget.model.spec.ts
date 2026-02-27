import { WIDGET_TYPES, WIDGET_TYPE_LABELS, WIDGET_TYPE_DEFAULTS } from './widget.model';
import { WIDGET_MOCK_DATA } from '../data/mock-data';

describe('Widget Model', () => {
  describe('WIDGET_TYPES', () => {
    it('should define all expected widget types', () => {
      expect(WIDGET_TYPES).toContain('kpi');
      expect(WIDGET_TYPES).toContain('stat');
      expect(WIDGET_TYPES).toContain('bar-chart');
      expect(WIDGET_TYPES).toContain('radar-chart');
      expect(WIDGET_TYPES).toContain('horizontal-bar-chart');
      expect(WIDGET_TYPES.length).toBe(5);
    });
  });

  describe('WIDGET_TYPE_LABELS', () => {
    it('should have a label for every widget type', () => {
      for (const type of WIDGET_TYPES) {
        expect(WIDGET_TYPE_LABELS[type]).toBeTruthy();
      }
    });
  });

  describe('WIDGET_TYPE_DEFAULTS', () => {
    it('should have default dimensions for every widget type', () => {
      for (const type of WIDGET_TYPES) {
        const defaults = WIDGET_TYPE_DEFAULTS[type];
        expect(defaults.cols).toBeGreaterThan(0);
        expect(defaults.rows).toBeGreaterThan(0);
      }
    });

    it('should have stat cards at 2 rows', () => {
      expect(WIDGET_TYPE_DEFAULTS.stat.rows).toBe(2);
    });
  });

  describe('WIDGET_MOCK_DATA', () => {
    it('should have data variants for every widget type', () => {
      for (const type of WIDGET_TYPES) {
        expect(WIDGET_MOCK_DATA[type].length).toBeGreaterThan(0);
      }
    });

    it('should have 6 KPI variants', () => {
      expect(WIDGET_MOCK_DATA.kpi.length).toBe(6);
    });

    it('should have 3 stat variants', () => {
      expect(WIDGET_MOCK_DATA.stat.length).toBe(3);
    });

    it('should have unique IDs within each type', () => {
      for (const type of WIDGET_TYPES) {
        const ids = WIDGET_MOCK_DATA[type].map((v) => v.id);
        expect(new Set(ids).size).toBe(ids.length);
      }
    });

    it('should have a title for every variant', () => {
      for (const type of WIDGET_TYPES) {
        for (const variant of WIDGET_MOCK_DATA[type]) {
          expect(variant.title).toBeTruthy();
          expect(variant.label).toBeTruthy();
        }
      }
    });
  });
});
