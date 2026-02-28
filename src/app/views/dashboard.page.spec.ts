import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardPage } from './dashboard.page';
import { DEFAULT_LAYOUT } from '../data/default-layout';

describe('DashboardPage', () => {
  let httpTesting: HttpTestingController;

  function flushInitRequests(): void {
    httpTesting.expectOne('/api/user-layout').flush(DEFAULT_LAYOUT);
    httpTesting.expectOne('/api/widget-catalog').flush([]);
    const dataReqs = httpTesting.match(
      (req) =>
        req.url.startsWith('/api/') &&
        req.url !== '/api/user-layout' &&
        req.url !== '/api/widget-catalog',
    );
    dataReqs.forEach((req) => req.flush({ title: 'Mock', value: 0 }));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DashboardPage);
    flushInitRequests();
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render dashboard header', () => {
    const fixture = TestBed.createComponent(DashboardPage);
    flushInitRequests();
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-dashboard-header')).toBeTruthy();
  });

  it('should render gridster container', () => {
    const fixture = TestBed.createComponent(DashboardPage);
    flushInitRequests();
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('gridster')).toBeTruthy();
  });

  it('should render widget hosts for each widget', () => {
    const fixture = TestBed.createComponent(DashboardPage);
    flushInitRequests();
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const widgetHosts = el.querySelectorAll('app-widget-host');
    // Default widgets: 6 KPIs + 3 Stats + 1 Radar + 1 Bar = 11
    expect(widgetHosts.length).toBe(11);
  });
});
