import { Injectable, inject, signal } from '@angular/core';
import { WidgetDataRepository } from '../repositories/widget-data.repository';
import { UserProfile } from '../models/widget.model';

/**
 * Manages user profile state.
 * Self-initialising: loads the profile on construction.
 */
@Injectable({ providedIn: 'root' })
export class UserStateService {
  private readonly repository = inject(WidgetDataRepository);

  readonly userProfile = signal<UserProfile>({ name: '', lastLogin: '' });

  constructor() {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.repository.fetchUserProfile().subscribe({
      next: (profile) => this.userProfile.set(profile),
    });
  }
}
