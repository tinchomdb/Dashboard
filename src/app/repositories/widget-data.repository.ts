import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile, WidgetEntry, WidgetType } from '../models/widget.model';

const API_BASE = '/api';

/**
 * Handles all HTTP communication for widget and user data.
 * Single responsibility: API URL construction and HTTP calls.
 */
@Injectable({ providedIn: 'root' })
export class WidgetDataRepository {
  private readonly http = inject(HttpClient);

  fetchUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API_BASE}/user-profile`);
  }

  fetchWidgetCatalog(): Observable<Record<WidgetType, WidgetEntry[]>> {
    return this.http.get<Record<WidgetType, WidgetEntry[]>>(`${API_BASE}/widget-catalog`);
  }

  fetchWidgetData<T = unknown>(type: WidgetType, variantId: string): Observable<T> {
    return this.http.get<T>(`${API_BASE}/${type}/${variantId}`);
  }
}
