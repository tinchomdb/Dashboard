/**
 * Shared PrimeNG Card passthrough (pt) configuration.
 * Uses Tailwind classes via the `class` property.
 * The `!` prefix adds !important to override PrimeNG defaults.
 */
export const CARD_PT_FILL = {
  root: { class: 'h-full overflow-hidden' },
  body: { class: 'h-full flex flex-col !p-sm' },
  title: {
    class: '!text-xs !font-semibold truncate flex-shrink-0 !pr-xl',
  },
  content: { class: 'flex-1 flex items-center justify-center !p-0' },
};

export const CARD_PT_FILL_STRETCH = {
  root: { class: 'h-full overflow-hidden' },
  body: { class: 'h-full flex flex-col' },
  title: {
    class: 'truncate !pr-xl',
  },
  content: { class: 'flex-1 min-h-0 !p-0' },
};
