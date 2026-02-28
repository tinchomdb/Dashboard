import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { MOCK_USER_PROFILE, WIDGET_MOCK_DATA } from '../data/mock-data';
import { DEFAULT_LAYOUT } from '../data/default-layout';
import {
  WidgetCatalogGroup,
  WidgetLayoutItem,
  WidgetType,
  WIDGET_TYPE_CONFIG,
  WIDGET_TYPES,
} from '../models/widget.model';

const DELAY_MIN = 1000;
const DELAY_MAX = 2000;
const LAYOUT_STORAGE_KEY = 'dashboard-user-layout';

function randomDelay(): number {
  return DELAY_MIN + Math.floor(Math.random() * (DELAY_MAX - DELAY_MIN));
}

function respond(body: unknown) {
  return of(new HttpResponse({ status: 200, body })).pipe(delay(randomDelay()));
}

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  // User profile
  if (req.url === '/api/user-profile') {
    return respond(MOCK_USER_PROFILE);
  }

  // User layout: read from localStorage, fall back to default
  if (req.url === '/api/user-layout' && req.method === 'GET') {
    const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
    const layout: WidgetLayoutItem[] = stored ? JSON.parse(stored) : DEFAULT_LAYOUT;
    return respond(layout);
  }

  // User layout save: persist to localStorage
  if (req.url === '/api/user-layout' && req.method === 'PUT') {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(req.body));
    return of(new HttpResponse({ status: 204, body: null })).pipe(delay(randomDelay()));
  }

  // Widget catalog: returns grouped menu-ready catalog
  if (req.url === '/api/widget-catalog') {
    const catalog: WidgetCatalogGroup[] = WIDGET_TYPES.map((type) => {
      const config = WIDGET_TYPE_CONFIG[type];
      return {
        label: config.label,
        icon: config.icon,
        items: WIDGET_MOCK_DATA[type].map((entry) => ({
          label: entry.title,
          type,
          variantId: entry.id,
        })),
      };
    });
    return respond(catalog);
  }

  // Widget data endpoints: /api/{type}/{variantId}
  const urlSegments = req.url.split('/');
  const typeSegment = urlSegments[2] as WidgetType;
  const variantId = urlSegments[3];

  const entries = WIDGET_MOCK_DATA[typeSegment];
  if (entries) {
    const entry = entries.find((e) => e.id === variantId);
    if (entry) {
      const { id, ...payload } = entry;
      return respond(payload);
    }
  }

  return next(req);
};
