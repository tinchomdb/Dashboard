import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDashboardLayout, WidgetCatalogGroup, WidgetType } from '../models/widget.model';
import { UserProfile } from '../models/user.model';

const API_BASE = '/api';

@Injectable({ providedIn: 'root' })
export class DashboardRepository {
  private readonly http = inject(HttpClient);

  fetchUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API_BASE}/user-profile`);
  }

  fetchWidgetCatalog(): Observable<WidgetCatalogGroup[]> {
    return this.http.get<WidgetCatalogGroup[]>(`${API_BASE}/widget-catalog`);
  }

  fetchWidgetData<T = unknown>(type: WidgetType, variantId: string): Observable<T> {
    return this.http.get<T>(`${API_BASE}/${type}/${variantId}`);
  }

  fetchUserLayout(): Observable<UserDashboardLayout> {
    return this.http.get<UserDashboardLayout>(`${API_BASE}/user-layout`);
  }

  saveUserLayout(layout: UserDashboardLayout): Observable<void> {
    return this.http.put<void>(`${API_BASE}/user-layout`, layout);
  }
}
