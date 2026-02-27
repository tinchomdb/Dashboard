import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { mockApiInterceptor } from './mock-api.interceptor';

describe('MockApiInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
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
  });

  it('should return mock data for KPI endpoints', async () => {
    const result = await new Promise((resolve) => {
      httpClient.get('/api/kpi/fellowship-count').subscribe((data) => resolve(data));
    });
    expect(result).toBeTruthy();
    expect((result as { value: number }).value).toBe(9);
  });

  it('should return mock data for stat endpoints', async () => {
    const result = await new Promise((resolve) => {
      httpClient.get('/api/stat/orc-armies').subscribe((data) => resolve(data));
    });
    expect(result).toBeTruthy();
    expect((result as { value: string }).value).toBe('~150,000');
  });

  it('should return mock data for radar-chart endpoints', async () => {
    const result = await new Promise((resolve) => {
      httpClient.get('/api/radar-chart/fellowship-skills').subscribe((data) => resolve(data));
    });
    expect(result).toBeTruthy();
    const chartData = result as { labels: string[]; datasets: unknown[] };
    expect(chartData.labels).toBeDefined();
    expect(chartData.datasets.length).toBeGreaterThan(0);
  });

  it('should return mock data for horizontal-bar-chart endpoints', async () => {
    const result = await new Promise((resolve) => {
      httpClient
        .get('/api/horizontal-bar-chart/battle-casualties')
        .subscribe((data) => resolve(data));
    });
    expect(result).toBeTruthy();
  });

  it('should pass through unknown endpoints', () => {
    httpClient.get('/other/endpoint').subscribe();
    const req = httpTesting.expectOne('/other/endpoint');
    expect(req.request.url).toBe('/other/endpoint');
    req.flush({});
  });

  it('should return mock user profile for /api/user-profile', async () => {
    const result = await new Promise((resolve) => {
      httpClient.get('/api/user-profile').subscribe((data) => resolve(data));
    });
    expect(result).toBeTruthy();
    const profile = result as { name: string; lastLogin: string };
    expect(profile.name).toBe('Frodo');
    expect(profile.lastLogin).toBeDefined();
  });

  it('should return widget catalog for /api/widget-catalog', async () => {
    const result = await new Promise((resolve) => {
      httpClient.get('/api/widget-catalog').subscribe((data) => resolve(data));
    });
    expect(result).toBeTruthy();
    const catalog = result as Record<string, unknown[]>;
    expect(catalog['kpi']).toBeDefined();
    expect(catalog['stat']).toBeDefined();
    expect(Array.isArray(catalog['kpi'])).toBe(true);
  });
});
