import { TestBed } from '@angular/core/testing';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCard],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentRef.setInput('title', 'Orc Armies');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the title', () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentRef.setInput('title', 'Orc Armies');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Orc Armies');
  });

  it('should render the value', () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentRef.setInput('title', 'Test');
    fixture.componentRef.setInput('value', '~150,000');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('~150,000');
  });

  it('should render badge when provided', () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentRef.setInput('title', 'Test');
    fixture.componentRef.setInput('badge', 'Mordor');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Mordor');
  });
});
