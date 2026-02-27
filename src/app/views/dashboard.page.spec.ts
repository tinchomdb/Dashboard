import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardPage } from './dashboard.page';

describe('DashboardPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render dashboard header', () => {
    const fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-dashboard-header')).toBeTruthy();
  });

  it('should render gridster container', () => {
    const fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('gridster')).toBeTruthy();
  });

  it('should render widget hosts for each widget', () => {
    const fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const widgetHosts = el.querySelectorAll('app-widget-host');
    // Default widgets: 6 KPIs + 3 Stats + 1 Radar + 1 Bar = 11
    expect(widgetHosts.length).toBe(11);
  });
});
