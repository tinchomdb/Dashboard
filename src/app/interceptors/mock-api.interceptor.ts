import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { MOCK_USER_PROFILE, WIDGET_MOCK_DATA } from '../data/mock-data';
import { WidgetType, WIDGET_TYPES } from '../models/widget.model';

const DELAY_MIN = 500;
const DELAY_MAX = 1500;

function randomDelay(): number {
  return Math.floor((Math.random() * (DELAY_MIN + DELAY_MAX)) / 2);
}

function respond(body: unknown) {
  return of(new HttpResponse({ status: 200, body })).pipe(delay(randomDelay()));
}

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  // User profile
  if (req.url === '/api/user-profile') {
    return respond(MOCK_USER_PROFILE);
  }

  // Widget catalog: returns { id, label, title, subtitle } per type
  if (req.url === '/api/widget-catalog') {
    const catalog: Record<string, unknown[]> = {};
    for (const type of WIDGET_TYPES) {
      catalog[type] = WIDGET_MOCK_DATA[type].map(({ id, label, title, subtitle }) => ({
        id,
        label,
        title,
        ...(subtitle ? { subtitle } : {}),
      }));
    }
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
      const { id, label, title, subtitle, ...payload } = entry;
      return respond(payload);
    }
  }

  return next(req);
};
