/**
 * Shared PrimeNG Card passthrough (pt) configuration.
 * Uses Tailwind classes via the `class` property.
 * The `!` prefix adds !important to override PrimeNG defaults.
 */
export const CARD_PT_FILL = {
  root: { class: 'h-full overflow-hidden' },
  body: { class: 'h-full flex flex-col !p-sm' },
  title: { class: '!text-xs !font-semibold truncate !m-0' },
  content: { class: 'flex-1 flex items-center justify-center !p-0' },
};

export const CARD_PT_FILL_STRETCH = {
  root: { class: 'h-full overflow-hidden' },
  body: { class: 'h-full flex flex-col' },
  content: { class: 'flex-1 min-h-0 !p-0' },
};
