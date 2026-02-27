import { TestBed } from '@angular/core/testing';
import { WIDGET_TYPES, WIDGET_TYPE_LABELS } from '../../models/widget.model';
import { MenuItem } from 'primeng/api';
import { DashboardHeader } from './dashboard-header';

const MOCK_MENU_ITEMS: MenuItem[] = WIDGET_TYPES.map((type) => ({
  label: WIDGET_TYPE_LABELS[type],
  icon: 'pi pi-box',
  items: [{ label: `${type} variant`, command: () => {} }],
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

  it('should emit toggleFilter with widget type', () => {
    const fixture = TestBed.createComponent(DashboardHeader);
    fixture.detectChanges();
    let emittedType: string | undefined;
    fixture.componentInstance.toggleFilter.subscribe((type: string) => (emittedType = type));

    fixture.componentInstance.toggleFilter.emit('kpi');
    expect(emittedType).toBe('kpi');
  });

  it('should accept addWidgetMenuItems input with all types', () => {
    const fixture = TestBed.createComponent(DashboardHeader);
    fixture.componentRef.setInput('addWidgetMenuItems', MOCK_MENU_ITEMS);
    fixture.detectChanges();
    expect(fixture.componentInstance.addWidgetMenuItems()).toEqual(MOCK_MENU_ITEMS);
    expect(fixture.componentInstance.addWidgetMenuItems().length).toBe(WIDGET_TYPES.length);
  });

  it('should have sub-items in add widget menu items', () => {
    const fixture = TestBed.createComponent(DashboardHeader);
    fixture.componentRef.setInput('addWidgetMenuItems', MOCK_MENU_ITEMS);
    fixture.detectChanges();
    const items = fixture.componentInstance.addWidgetMenuItems();
    const kpiItem = items.find((m) => m.label === 'KPI Indicator');
    expect(kpiItem?.items?.length).toBeGreaterThan(0);
  });

  it('should default to empty addWidgetMenuItems when no input provided', () => {
    const fixture = TestBed.createComponent(DashboardHeader);
    fixture.detectChanges();
    expect(fixture.componentInstance.addWidgetMenuItems()).toEqual([]);
  });
});
