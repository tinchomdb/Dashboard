import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UserStateService } from './user-state.service';

describe('UserStateService', () => {
  let service: UserStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty profile', () => {
    expect(service.userProfile().name).toBe('');
    expect(service.userProfile().lastLogin).toBe('');
  });
});
