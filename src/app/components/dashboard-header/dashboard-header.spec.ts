import { TestBed } from '@angular/core/testing';
import {
  WIDGET_TYPES,
  WIDGET_TYPE_CONFIG,
  WidgetCatalogGroup,
  WidgetType,
  AddWidgetEvent,
} from '../../models/widget.model';
import { DashboardHeader } from './dashboard-header';

const MOCK_CATALOG: WidgetCatalogGroup[] = WIDGET_TYPES.map((type) => ({
  label: WIDGET_TYPE_CONFIG[type].label,
  icon: WIDGET_TYPE_CONFIG[type].icon,
  items: [{ label: `${type} variant`, type, variantId: `${type}-1` }],
}));

describe('DashboardHeader', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHeader],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DashboardHeader);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render welcome message with provided user name', () => {
    const fixture = TestBed.createComponent(DashboardHeader);
    fixture.componentRef.setInput('userName', 'Frodo');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Hi Frodo');
  });

  it('should render custom user name', () => {
    const fixture = TestBed.createComponent(DashboardHeader);
    fixture.componentRef.setInput('userName', 'Gandalf');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Hi Gandalf');
  });

  it('should render last login info', () => {
    const fixture = TestBed.createComponent(DashboardHeader);
    fixture.componentRef.setInput('lastLogin', 'February 27 at 8:15am CET');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('February 27 at 8:15am CET');
  });

  it('should emit columnsChange when column input changes', () => {
    const fixture = TestBed.createComponent(DashboardHeader);
    fixture.detectChanges();
    let newColumns: number | undefined;
    fixture.componentInstance.columnsChange.subscribe((cols: number) => (newColumns = cols));

    fixture.componentInstance['onColumnsChange'](8);
    expect(newColumns).toBe(8);
  });

  it('should not emit columnsChange for invalid values', () => {
    const fixture = TestBed.createComponent(DashboardHeader);
    fixture.detectChanges();
    let emitted = false;
    fixture.componentInstance.columnsChange.subscribe(() => (emitted = true));

    fixture.componentInstance['onColumnsChange'](0);
    expect(emitted).toBe(false);

    fixture.componentInstance['onColumnsChange'](null);
    expect(emitted).toBe(false);
  });

  it('should reflect active filters in filter items', () => {
    const fixture = TestBed.createComponent(DashboardHeader);
    fixture.componentRef.setInput('activeFilters', new Set<WidgetType>(['kpi']));
    fixture.detectChanges();
    const items = fixture.componentInstance['filterItems']();
    const kpi = items.find((i) => i.type === 'kpi');
    const stat = items.find((i) => i.type === 'stat');
    expect(kpi?.active).toBe(true);
    expect(stat?.active).toBe(false);
  });

  it('should accept widgetCatalog input with all types', () => {
    const fixture = TestBed.createComponent(DashboardHeader);
    fixture.componentRef.setInput('widgetCatalog', MOCK_CATALOG);
    fixture.detectChanges();
    expect(fixture.componentInstance.widgetCatalog()).toEqual(MOCK_CATALOG);
    expect(fixture.componentInstance.widgetCatalog().length).toBe(WIDGET_TYPES.length);
  });

  it('should have sub-items in menu items computed from catalog', () => {
    const fixture = TestBed.createComponent(DashboardHeader);
    fixture.componentRef.setInput('widgetCatalog', MOCK_CATALOG);
    fixture.detectChanges();
    const items = fixture.componentInstance['menuItems']();
    const kpiItem = items.find((m) => m.label === 'KPI Indicator');
    expect(kpiItem?.items?.length).toBeGreaterThan(0);
  });

  it('should default to empty widgetCatalog when no input provided', () => {
    const fixture = TestBed.createComponent(DashboardHeader);
    fixture.detectChanges();
    expect(fixture.componentInstance.widgetCatalog()).toEqual([]);
  });

  it('should emit addWidget event when menu item command is executed', () => {
    const fixture = TestBed.createComponent(DashboardHeader);
    fixture.componentRef.setInput('widgetCatalog', MOCK_CATALOG);
    fixture.detectChanges();
    let emitted: AddWidgetEvent | undefined;
    fixture.componentInstance.addWidget.subscribe((event: AddWidgetEvent) => (emitted = event));
    const items = fixture.componentInstance['menuItems']();
    items[0].items![0].command!({} as never);
    expect(emitted).toEqual({ type: 'kpi', variantId: 'kpi-1' });
  });
});
