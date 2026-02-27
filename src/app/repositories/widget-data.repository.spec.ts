import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { WidgetDataRepository } from './widget-data.repository';

describe('WidgetDataRepository', () => {
  let repository: WidgetDataRepository;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    repository = TestBed.inject(WidgetDataRepository);
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
    const mockCatalog = { kpi: [{ id: 'test', label: 'Test', title: 'Test' }] };
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
});
