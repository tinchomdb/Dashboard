import { TestBed } from '@angular/core/testing';
import { KpiCard } from './kpi-card';

describe('KpiCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiCard],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(KpiCard);
    fixture.componentRef.setInput('title', 'Fellowship Members');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the title', () => {
    const fixture = TestBed.createComponent(KpiCard);
    fixture.componentRef.setInput('title', 'Rings of Power');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Rings of Power');
  });

  it('should render the value', () => {
    const fixture = TestBed.createComponent(KpiCard);
    fixture.componentRef.setInput('title', 'Test');
    fixture.componentRef.setInput('value', 9);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('9');
  });

  it('should render default value when none provided', () => {
    const fixture = TestBed.createComponent(KpiCard);
    fixture.componentRef.setInput('title', 'Test');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('--');
  });
});
