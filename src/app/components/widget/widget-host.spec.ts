import { TestBed } from '@angular/core/testing';
import { WidgetHost } from './widget-host';
import { DashboardWidget } from '../../models/widget.model';

function createMockWidget(overrides: Partial<DashboardWidget> = {}): DashboardWidget {
  return {
    id: 'test-1',
    type: 'kpi',
    variantId: 'fellowship-count',
    title: 'Fellowship Members',
    loading: false,
    data: { value: 9 },
    x: 0,
    y: 0,
    cols: 1,
    rows: 1,
    ...overrides,
  };
}

describe('WidgetHost', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetHost],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(WidgetHost);
    fixture.componentRef.setInput('widget', createMockWidget());
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show skeleton when loading', () => {
    const fixture = TestBed.createComponent(WidgetHost);
    fixture.componentRef.setInput('widget', createMockWidget({ loading: true }));
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('p-skeleton')).toBeTruthy();
  });

  it('should render KPI card when type is kpi and not loading', () => {
    const fixture = TestBed.createComponent(WidgetHost);
    fixture.componentRef.setInput('widget', createMockWidget({ type: 'kpi', loading: false }));
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-kpi-card')).toBeTruthy();
  });

  it('should render stat card when type is stat', () => {
    const fixture = TestBed.createComponent(WidgetHost);
    fixture.componentRef.setInput(
      'widget',
      createMockWidget({
        type: 'stat',
        loading: false,
        data: { value: '100%', badge: { value: 'OK', severity: 'success' } },
      }),
    );
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-stat-card')).toBeTruthy();
  });

  it('should render chart card when type is radar-chart', () => {
    const fixture = TestBed.createComponent(WidgetHost);
    fixture.componentRef.setInput(
      'widget',
      createMockWidget({
        type: 'radar-chart',
        loading: false,
        data: { labels: ['A'], datasets: [{ data: [1] }] },
      }),
    );
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-chart-card')).toBeTruthy();
  });

  it('should emit remove event with widget id', () => {
    const fixture = TestBed.createComponent(WidgetHost);
    const widget = createMockWidget();
    fixture.componentRef.setInput('widget', widget);
    fixture.detectChanges();

    let emittedId: string | undefined;
    fixture.componentInstance.remove.subscribe((id: string) => (emittedId = id));
    fixture.componentInstance['onRemove']();

    expect(emittedId).toBe('test-1');
  });

  it('should have a drag handle element after opening actions', () => {
    const fixture = TestBed.createComponent(WidgetHost);
    fixture.componentRef.setInput('widget', createMockWidget());
    fixture.detectChanges();

    // Open the actions menu
    fixture.componentInstance['actionsOpen'].set(true);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.widget-drag-handle')).toBeTruthy();
  });

  it('should show download button for chart widgets when actions are open', () => {
    const fixture = TestBed.createComponent(WidgetHost);
    fixture.componentRef.setInput(
      'widget',
      createMockWidget({
        type: 'bar-chart',
        loading: false,
        data: { labels: ['A'], datasets: [{ data: [1] }] },
      }),
    );
    fixture.detectChanges();

    fixture.componentInstance['actionsOpen'].set(true);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const downloadBtn = el.querySelector('[aria-label="Download chart"]');
    expect(downloadBtn).toBeTruthy();
  });

  it('should not show download button for non-chart widgets', () => {
    const fixture = TestBed.createComponent(WidgetHost);
    fixture.componentRef.setInput('widget', createMockWidget({ type: 'kpi', loading: false }));
    fixture.detectChanges();

    fixture.componentInstance['actionsOpen'].set(true);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const downloadBtn = el.querySelector('[aria-label="Download chart"]');
    expect(downloadBtn).toBeFalsy();
  });
});
