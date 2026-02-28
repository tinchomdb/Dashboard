import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { MOCK_USER_PROFILE, WIDGET_MOCK_DATA } from '../data/mock-data';
import { DEFAULT_LAYOUT } from '../data/default-layout';
import {
  UserDashboardLayout,
  WidgetCatalogGroup,
  WidgetType,
  WIDGET_TYPE_CONFIG,
  WIDGET_TYPES,
} from '../models/widget.model';

const DELAY_MIN = 1000;
const DELAY_MAX = 2000;
const LAYOUT_STORAGE_KEY = 'dashboard-user-layout';
const LAST_LOGIN_STORAGE_KEY = 'dashboard-last-login';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  // User profile: inject persisted last-login, then store current timestamp
  if (req.url === '/api/user-profile') {
    const lastLogin = readLastLogin();
    storeLastLogin();
    return respond({ ...MOCK_USER_PROFILE, lastLogin }, 0);
  }

  // User layout: read from localStorage, fall back to default
  if (req.url === '/api/user-layout' && req.method === 'GET') {
    return respond(readStoredLayout(), 0);
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

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function randomDelay(): number {
  return DELAY_MIN + Math.floor(Math.random() * (DELAY_MAX - DELAY_MIN));
}

function respond(body: unknown, delayMS = randomDelay()) {
  return of(new HttpResponse({ status: 200, body })).pipe(delay(delayMS));
}

/**
 * Reads persisted layout from localStorage and validates its shape.
 * Returns DEFAULT_LAYOUT when nothing is stored or data is invalid.
 */
function readStoredLayout(): UserDashboardLayout {
  const raw = localStorage.getItem(LAYOUT_STORAGE_KEY);
  if (!raw) return DEFAULT_LAYOUT;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isValidLayout(parsed) ? parsed : DEFAULT_LAYOUT;
  } catch {
    return DEFAULT_LAYOUT;
  }
}

/**
 * Reads the persisted last-login timestamp from localStorage.
 * Returns the mock default on first visit.
 */
function readLastLogin(): string {
  return localStorage.getItem(LAST_LOGIN_STORAGE_KEY) ?? MOCK_USER_PROFILE.lastLogin;
}

/** Stores the current date/time as last-login for the next session. */
function storeLastLogin(): void {
  const now = new Date();
  const formatted =
    now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    }) +
    ' at ' +
    now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  localStorage.setItem(LAST_LOGIN_STORAGE_KEY, formatted);
}

function isValidLayout(value: unknown): value is UserDashboardLayout {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const { columns, widgets } = value as Record<string, unknown>;

  if (typeof columns !== 'number' || columns < 1 || !Array.isArray(widgets)) {
    return false;
  }

  return widgets.every((w) => {
    if (typeof w !== 'object' || w === null) return false;
    const { type, variantId, x, y } = w as Record<string, unknown>;
    return (
      typeof type === 'string' &&
      (WIDGET_TYPES as readonly string[]).includes(type) &&
      typeof variantId === 'string' &&
      typeof x === 'number' &&
      typeof y === 'number'
    );
  });
}
