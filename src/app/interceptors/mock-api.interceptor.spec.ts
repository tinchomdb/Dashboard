import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { mockApiInterceptor } from './mock-api.interceptor';

/** Must be ≥ the interceptor's DELAY_MAX so the mocked response completes. */
const TICK_DELAY = 2000;

describe('MockApiInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([mockApiInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    vi.useRealTimers();
    localStorage.clear();
  });

  it('should return mock data for KPI endpoints', () => {
    let result: unknown;
    httpClient.get('/api/kpi/fellowship-count').subscribe((data) => (result = data));
    vi.advanceTimersByTime(TICK_DELAY);
    expect(result).toBeTruthy();
    expect((result as { value: number }).value).toBe(9);
  });

  it('should return mock data for stat endpoints', () => {
    let result: unknown;
    httpClient.get('/api/stat/orc-armies').subscribe((data) => (result = data));
    vi.advanceTimersByTime(TICK_DELAY);
    expect(result).toBeTruthy();
    expect((result as { value: string }).value).toBe('~150,000');
  });

  it('should return mock data for radar-chart endpoints', () => {
    let result: unknown;
    httpClient.get('/api/radar-chart/fellowship-skills').subscribe((data) => (result = data));
    vi.advanceTimersByTime(TICK_DELAY);
    expect(result).toBeTruthy();
    const chartData = result as { labels: string[]; datasets: unknown[] };
    expect(chartData.labels).toBeDefined();
    expect(chartData.datasets.length).toBeGreaterThan(0);
  });

  it('should return mock data for horizontal-bar-chart endpoints', () => {
    let result: unknown;
    httpClient
      .get('/api/horizontal-bar-chart/battle-casualties')
      .subscribe((data) => (result = data));
    vi.advanceTimersByTime(TICK_DELAY);
    expect(result).toBeTruthy();
  });

  it('should pass through unknown endpoints', () => {
    httpClient.get('/other/endpoint').subscribe();
    const req = httpTesting.expectOne('/other/endpoint');
    expect(req.request.url).toBe('/other/endpoint');
    req.flush({});
  });

  it('should return mock user profile for /api/user-profile', () => {
    let result: unknown;
    httpClient.get('/api/user-profile').subscribe((data) => (result = data));
    vi.advanceTimersByTime(TICK_DELAY);
    expect(result).toBeTruthy();
    const profile = result as { name: string; lastLogin: string };
    expect(profile.name).toBe('Frodo');
    expect(profile.lastLogin).toBeDefined();
  });

  it('should return widget catalog for /api/widget-catalog', () => {
    let result: unknown;
    httpClient.get('/api/widget-catalog').subscribe((data) => (result = data));
    vi.advanceTimersByTime(TICK_DELAY);
    expect(result).toBeTruthy();
    const catalog = result as { label: string; icon: string; items: unknown[] }[];
    expect(Array.isArray(catalog)).toBe(true);
    const kpiGroup = catalog.find((g) => g.label === 'KPI Indicator');
    expect(kpiGroup).toBeDefined();
    expect(Array.isArray(kpiGroup!.items)).toBe(true);
  });

  it('should return default user layout for GET /api/user-layout', () => {
    let result: unknown;
    httpClient.get('/api/user-layout').subscribe((data) => (result = data));
    vi.advanceTimersByTime(TICK_DELAY);
    expect(result).toBeTruthy();
    const layout = result as { columns: number; widgets: { type: string; variantId: string }[] };
    expect(layout.columns).toBe(6);
    expect(Array.isArray(layout.widgets)).toBe(true);
    expect(layout.widgets.length).toBeGreaterThan(0);
    expect(layout.widgets[0].type).toBe('kpi');
    expect(layout.widgets[0].variantId).toBe('fellowship-count');
  });

  it('should accept PUT /api/user-layout and return 204', () => {
    const payload = { columns: 4, widgets: [{ type: 'kpi', variantId: 'test', x: 0, y: 0 }] };
    let status: number | undefined;
    httpClient
      .put('/api/user-layout', payload, { observe: 'response' })
      .subscribe((res) => (status = res.status));
    vi.advanceTimersByTime(TICK_DELAY);
    expect(status).toBe(204);
  });

  it('should fall back to default layout when localStorage has invalid data', () => {
    localStorage.setItem('dashboard-user-layout', JSON.stringify({ bad: 'data' }));

    let result: unknown;
    httpClient.get('/api/user-layout').subscribe((data) => (result = data));
    vi.advanceTimersByTime(TICK_DELAY);

    const layout = result as { columns: number; widgets: { type: string; variantId: string }[] };
    expect(layout.columns).toBe(6);
    expect(layout.widgets.length).toBeGreaterThan(0);
    expect(layout.widgets[0].type).toBe('kpi');
  });

  it('should fall back to default layout when localStorage has a plain array', () => {
    localStorage.setItem(
      'dashboard-user-layout',
      JSON.stringify([{ type: 'kpi', variantId: 'test', x: 0, y: 0 }]),
    );

    let result: unknown;
    httpClient.get('/api/user-layout').subscribe((data) => (result = data));
    vi.advanceTimersByTime(TICK_DELAY);

    const layout = result as { columns: number; widgets: { type: string }[] };
    expect(layout.columns).toBe(6);
    expect(layout.widgets.length).toBeGreaterThan(0);
  });

  it('should fall back to default layout when localStorage has corrupt JSON', () => {
    localStorage.setItem('dashboard-user-layout', 'not-json');

    let result: unknown;
    httpClient.get('/api/user-layout').subscribe((data) => (result = data));
    vi.advanceTimersByTime(TICK_DELAY);

    const layout = result as { columns: number; widgets: unknown[] };
    expect(layout.columns).toBe(6);
    expect(layout.widgets.length).toBeGreaterThan(0);
  });
});
