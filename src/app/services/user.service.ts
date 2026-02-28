import { Injectable, inject, signal } from '@angular/core';
import { DashboardRepository } from '../repositories/dashboard.repository';
import { UserProfile } from '../models/user.model';

/**
 * Manages user profile state.
 * Self-initialising: loads the profile on construction.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly repository = inject(DashboardRepository);

  readonly userProfile = signal<UserProfile>({ name: '', lastLogin: '' });

  constructor() {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.repository.fetchUserProfile().subscribe({
      next: (profile) => this.userProfile.set(profile),
      error: (err) => console.error('Failed to load user profile', err),
    });
  }
}
