You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices. Favor simplicity and readability

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- Don't use magic numbers or strings; define them as constants or enums
- Use interfaces to define object shapes and types
- Use type aliases for complex types and unions

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use Angular CLI for generating components, services, and other artifacts to ensure consistency.
- Use Angular's built-in features and avoid third-party libraries unless necessary
- Keep the application structure organized and modular, following the feature module pattern
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Use PrimeNG for UI components. PrimeNG v21+ is fully standalone and does not require NgModules.
- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.
- Split components in 3 files
- Keep UI components dumb and agnostic of the application state. They should only receive data via inputs and emit events via outputs.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead
- Favor signals over RxJS for state management

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Style

- Use Tailwind CSS for styling.
- Use semantic naming for classes and avoid utility classes in templates.
- Put tokens as CSS variables (:root and theme files). Use semantic names (e.g. --color-primary, --surface-1, --radius-md, --font-ui). Tailwind v4 exposes tokens as CSS variables so utilities like bg-primary map to them.
- All design values must come from CSS variables (design tokens). No hardcoded colors, spacing, font sizes, border radius, shadows.
- No Hardcoded Utilities: Do not use literal color names (e.g., bg-blue-500) or specific spacing (e.g., p-4). Use only semantic tokens defined in our theme (e.g., bg-surface-main, text-text-secondary, p-spacing-md).
- Use Tailwind's @ container queries (e.g., @md:flex-row) for responsiveness rather than standard screen-size breakpoints (md:flex-row)

## Directives

- Use directives to encapsulate reusable behavior and logic
- Keep directives focused on a single responsibility

## Testing

- Create unit tests for components, services, and directives using Jasmine and Karma
- Run tests frequently during development to catch issues early
