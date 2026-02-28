# Dynamic Dashboard

A fully interactive, widget-based analytics dashboard built with **Angular 21**, **PrimeNG 21**, **Tailwind CSS 4**, and **Chart.js** — showcasing modern frontend architecture, clean code practices, and attention to design fidelity.

![Dashboard Design Reference](dashboard.png)

> **Context:** This project was bult with a focus on code quality and maintainability. The data theme is Lord of the Rings — because if you're going to build a dashboard, the least you can do is track the Fellowship's KPIs.

---

## Features

### Grid-Based Drag-and-Drop Layout

- Widgets live in a responsive grid powered by [angular-gridster2](https://github.com/tiberiuzuld/angular-gridster2)
- **Drag-and-drop** repositioning via a dedicated drag handle per widget
- **Resizable** widgets with live visual feedback during resize
- **Auto-compaction** (`CompactUpAndLeft`) keeps the layout tidy after every move
- **Collision resolution** — a custom algorithm repositions widgets when column count changes, guaranteeing zero overlap

### 9 Widget Types

| Type                 | Size | Description                                      |
| -------------------- | ---- | ------------------------------------------------ |
| KPI Card             | 1×1  | Single large numeric value with fluid typography |
| Stat Card            | 1×2  | Value with contextual severity badge             |
| Bar Chart            | 3×3  | Vertical bar chart                               |
| Horizontal Bar Chart | 3×3  | Stacked horizontal bar chart                     |
| Line Chart           | 3×3  | Area/line chart with fill and curve tension      |
| Radar Chart          | 3×5  | Multi-dataset radar chart                        |
| Pie Chart            | 2×3  | Pie chart with side legend                       |
| Doughnut Chart       | 2×3  | Doughnut variant                                 |
| Polar Area Chart     | 2×3  | Polar area chart                                 |

### Widget Management

- **Add widgets** from a categorized popup menu listing all available variants from the server-loaded catalog
- **Remove widgets** via a per-widget action toolbar
- **Download charts as PNG** — chart widgets expose a download button that triggers a browser-native file download
- **Filter by widget type** — a popover with checkboxes to show/hide specific widget categories

### Configurable Column Count

An InputNumber control in the header lets the user set the grid between 1 and 12 columns. The collision resolution algorithm automatically reflows widgets to fit without overlap.

### Loading Skeletons

Each widget renders a PrimeNG `Skeleton` loader (title + subtitle + body) while data is being fetched from the mock API, providing a polished loading experience.

### Layout Persistence

The user's widget arrangement is saved to `localStorage` via a mock PUT endpoint and restored on page reload — with full validation and graceful fallback to the default layout if the stored data is invalid.

### User Profile & Last Login

A greeting header displays the user's name and their last login timestamp, persisted across sessions via `localStorage`.

---

## Tech Stack

| Technology                                                            | Version | Role                                      |
| --------------------------------------------------------------------- | ------- | ----------------------------------------- |
| [Angular](https://angular.dev)                                        | 21      | Core framework                            |
| [TypeScript](https://www.typescriptlang.org)                          | 5.9     | Language                                  |
| [PrimeNG](https://primeng.org)                                        | 21      | UI component library                      |
| [Tailwind CSS](https://tailwindcss.com)                               | 4       | Utility-first styling                     |
| [Chart.js](https://www.chartjs.org)                                   | 4.5     | Chart rendering (via PrimeNG `<p-chart>`) |
| [angular-gridster2](https://github.com/tiberiuzuld/angular-gridster2) | 21      | Drag-and-drop grid                        |
| [Vitest](https://vitest.dev)                                          | 4       | Unit testing                              |
| [esbuild](https://esbuild.github.io)                                  | —       | Build toolchain (via `@angular/build`)    |

---

## Architecture

```
src/app/
├── models/            Type definitions, constants, discriminated unions
├── data/              Static default layout & mock data
├── repositories/      HTTP abstraction (thin data-access layer)
├── services/          Business logic & reactive state (signals)
├── interceptors/      Mock API interceptor (simulates backend)
├── views/             Smart page-level components
└── components/
    ├── dashboard-header/   Toolbar (dumb component)
    └── widget-host/        Widget container + type routing
        ├── kpi-card/       KPI display (dumb)
        ├── stat-card/      Stat + badge display (dumb)
        ├── chart-card/     Chart.js wrapper (dumb)
        └── shared/         Reusable PrimeNG Card passthrough configs
```

### Layered Separation of Concerns

The application follows a strict **Repository → Service → View → Component** layering:

| Layer                | Responsibility                                                                               | Knows About      |
| -------------------- | -------------------------------------------------------------------------------------------- | ---------------- |
| **Repository**       | Pure HTTP calls — single responsibility, no business logic                                   | HTTP client only |
| **Service**          | Owns all state (signals), grid configuration, CRUD, layout persistence, collision resolution | Repository       |
| **View (Smart)**     | Injects services, exposes signals to template, delegates user events                         | Service          |
| **Component (Dumb)** | Receives data via `input()`, emits events via `output()` — zero knowledge of app state       | Nothing          |

This separation means every layer can be tested in isolation, and dumb components are fully reusable with no coupling to application logic.

---

## Code Quality & Best Practices

### Modern Angular APIs

- **Signal-based inputs/outputs** — `input()`, `input.required()`, `output()` instead of decorators
- **Signals for state** — `signal()` and `computed()` for all reactive state, no BehaviorSubjects
- **`inject()` function** — functional dependency injection, no constructor parameter lists
- **Native control flow** — `@if`, `@for`, `@switch` instead of structural directives
- **Standalone components** — Angular 21 default, no NgModules anywhere
- **`OnPush` change detection** on every component
- **Lazy-loaded routes** — the dashboard page is loaded via `loadComponent()`

### Strict TypeScript

- **`strict: true`** with all additional strict flags enabled (`noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`)
- **Strict templates** — `strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers`
- **`as const` assertions** for literal union types (`WIDGET_TYPES`)
- **Discriminated unions** — `WidgetData = KpiData | StatData | ChartData` with proper type narrowing
- **No `any`** — `unknown` is used where type is uncertain, with explicit narrowing
- **Named constants** — `DEFAULT_COLUMNS`, `DELAY_MIN`, `DELAY_MAX`, etc. — no magic numbers or strings

### Design Token System

All design values flow through CSS custom properties defined in Tailwind's `@theme` block:

- Semantic naming: `--color-primary`, `--color-surface-ground`, `--spacing-md`, `--font-size-display-xl`
- **Zero hardcoded values** — no `bg-blue-500` or `p-4`, only semantic tokens like `bg-surface-main` and `text-text-secondary`
- PrimeNG Card layouts customized via the **Passthrough (PT) API** with shared config objects

### Responsive Design via Container Queries

Instead of media queries tied to viewport width, the dashboard uses **CSS Container Queries**:

- **Header** uses `@container` at 800px to switch between column and row layout
- **KPI cards** scale through 5 typography breakpoints based on their own container size
- **Stat cards** scale through 3 breakpoints for value + badge sizing

This means widgets adapt to their allocated grid space, not the screen size — crucial for a resizable grid layout.

### Accessibility (WCAG AA)

- `aria-label` on all icon-only buttons (filter, add, drag, download, remove, actions toggle)
- Proper `<label>` elements linked to form controls via `for`/`inputId`
- Semantic HTML: `<header>`, `<h1>`, `<p>`, `<main>`
- `lang="en"` on the root `<html>` element

### Immutable State Updates

All signal updates produce new object/array references — never mutating in place:

```typescript
this.widgets.update((list) => list.filter((w) => w.id !== id)); // remove
this.widgets.update((list) => [...list, newWidget]); // add
this.typeFilter.update((set) => {
  const s = new Set(set); /* ... */
}); // toggle
```

### Mock API Interceptor

A functional `HttpInterceptorFn` simulates a realistic backend:

- **Randomized delays** (1–2 seconds) on data endpoints for skeleton testing
- **Instant responses** for user profile and layout (for smooth page load UX)
- **`localStorage` persistence** with type-guarded validation and graceful fallback
- **Dynamic widget catalog** built at runtime from type configs × mock data
- **Pass-through** for unrecognized URLs

---

## Testing

**66+ unit tests** across 10 spec files using **Vitest** with Angular TestBed:

| Area               | Tests | What's Covered                                                                            |
| ------------------ | ----- | ----------------------------------------------------------------------------------------- |
| **Models**         | 7     | Widget type definitions, config labels/dimensions, mock data integrity                    |
| **Repository**     | 6     | All HTTP endpoints (GET/PUT), correct URLs and methods                                    |
| **Service**        | 17    | Initialization, CRUD, column clamping, collision resolution, grid options, type filtering |
| **Interceptor**    | 11    | All mock endpoints, localStorage persistence, invalid data fallbacks, pass-through        |
| **Dashboard Page** | 4     | Component creation, header rendering, gridster container, widget count                    |
| **Header**         | 9     | Welcome message, last login, column changes, filter items, menu items, add widget         |
| **Widget Host**    | 8     | Skeleton state, card type routing, remove events, drag handle, download button            |
| **KPI Card**       | 4     | Title, value rendering, fallback display                                                  |
| **Stat Card**      | 4     | Title, value, badge rendering                                                             |
| **App**            | 2     | Bootstrap, router outlet                                                                  |

**Testing patterns used:**

- `HttpTestingController` for HTTP layer isolation
- `vi.useFakeTimers()` for deterministic async testing
- `fixture.componentRef.setInput()` for signal-based inputs
- Helper functions (`flushInitRequests()`) to reduce test boilerplate

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 11+

### Install & Run

```bash
npm install
npm start
```

The dev server starts at `http://localhost:4200`.

### Run Tests

```bash
npm test
```

### Build for Production

```bash
npm run build
```

---

## Project Decisions

| Decision                                    | Rationale                                                                                                |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Signals over RxJS for state**             | Simpler mental model, less boilerplate, better Angular 21 integration. RxJS is only used for HTTP calls. |
| **Repository + Service layering**           | Clear separation between data fetching and business logic — each testable in isolation.                  |
| **Container Queries over media queries**    | Widgets need to respond to their own size in a resizable grid, not the viewport.                         |
| **Mock interceptor over in-memory-web-api** | Lighter, more transparent, easier to customize delays and edge cases.                                    |
| **Vitest over Karma/Jasmine**               | Modern, fast, better DX with native ESM support and Angular 21's new `@angular/build:unit-test` builder. |
| **PrimeNG Passthrough API**                 | Full layout control over PrimeNG Card internals without fighting the framework's DOM structure.          |
| **Lord of the Rings theme**                 | Makes the demo memorable and showcases realistic, varied data shapes across all widget types.            |

---

## Time Investment

This project was built as a time-boxed assessment. The scope focuses on demonstrating:

1. **Clean architecture** — layered, testable, maintainable
2. **Modern Angular** — signals, standalone, OnPush, native control flow
3. **Attention to detail** — design fidelity, loading states, accessibility, responsive behavior
4. **Code quality** — strict typing, no magic values, immutable updates, thorough tests

Rather than implementing every possible dashboard feature, the goal was to show depth and quality in the features that were built.
