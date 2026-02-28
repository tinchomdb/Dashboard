import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DashboardRepository } from './dashboard.repository';

describe('DashboardRepository', () => {
  let repository: DashboardRepository;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    repository = TestBed.inject(DashboardRepository);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  it('should fetch user profile from /api/user-profile', () => {
    const mockProfile = { name: 'Frodo', lastLogin: 'Feb 27' };
    let result: unknown;

    repository.fetchUserProfile().subscribe((data) => (result = data));

    const req = httpTesting.expectOne('/api/user-profile');
    expect(req.request.method).toBe('GET');
    req.flush(mockProfile);

    expect(result).toEqual(mockProfile);
  });

  it('should fetch widget catalog from /api/widget-catalog', () => {
    const mockCatalog = { kpi: [{ id: 'test', title: 'Test' }] };
    let result: unknown;

    repository.fetchWidgetCatalog().subscribe((data) => (result = data));

    const req = httpTesting.expectOne('/api/widget-catalog');
    expect(req.request.method).toBe('GET');
    req.flush(mockCatalog);

    expect(result).toEqual(mockCatalog);
  });

  it('should fetch widget data from /api/{type}/{variantId}', () => {
    const mockData = { value: 42 };
    let result: unknown;

    repository.fetchWidgetData('kpi', 'fellowship-count').subscribe((data) => (result = data));

    const req = httpTesting.expectOne('/api/kpi/fellowship-count');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(result).toEqual(mockData);
  });

  it('should handle different widget types', () => {
    repository.fetchWidgetData('radar-chart', 'fellowship-skills').subscribe();
    const req = httpTesting.expectOne('/api/radar-chart/fellowship-skills');
    expect(req.request.url).toBe('/api/radar-chart/fellowship-skills');
    req.flush({});
  });

  it('should fetch user layout from /api/user-layout', () => {
    const mockLayout = [{ type: 'kpi' as const, variantId: 'fellowship-count', x: 0, y: 0 }];
    let result: unknown;

    repository.fetchUserLayout().subscribe((data) => (result = data));

    const req = httpTesting.expectOne('/api/user-layout');
    expect(req.request.method).toBe('GET');
    req.flush(mockLayout);

    expect(result).toEqual(mockLayout);
  });

  it('should save user layout via PUT /api/user-layout', () => {
    const layout = [{ type: 'kpi' as const, variantId: 'fellowship-count', x: 0, y: 0 }];

    repository.saveUserLayout(layout).subscribe();

    const req = httpTesting.expectOne('/api/user-layout');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(layout);
    req.flush(null);
  });
});
