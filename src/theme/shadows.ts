export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
  sm: '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)',
  md: '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.08)',
  lg: '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.08)',
  xl: '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.08)',
  '2xl': '0 25px 50px -12px rgba(15, 23, 42, 0.12)',
  inner: 'inset 0 2px 4px 0 rgba(15, 23, 42, 0.05)',
  card: '0 2px 8px 0 rgba(15, 23, 42, 0.06), 0 1px 3px 0 rgba(15, 23, 42, 0.08)',
  cardHover:
    '0 8px 24px 0 rgba(15, 23, 42, 0.1), 0 4px 12px 0 rgba(15, 23, 42, 0.08)',
  dropdown:
    '0 4px 20px 0 rgba(15, 23, 42, 0.12), 0 2px 8px 0 rgba(15, 23, 42, 0.08)',
  modal:
    '0 25px 50px -12px rgba(15, 23, 42, 0.2), 0 8px 16px -4px rgba(15, 23, 42, 0.1)',
  focus: '0 0 0 3px rgba(79, 70, 229, 0.35)',
  focusDanger: '0 0 0 3px rgba(220, 38, 38, 0.35)',
} as const;

export const darkShadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.2)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
  card: '0 2px 8px 0 rgba(0, 0, 0, 0.25), 0 1px 3px 0 rgba(0, 0, 0, 0.3)',
  cardHover:
    '0 8px 24px 0 rgba(0, 0, 0, 0.35), 0 4px 12px 0 rgba(0, 0, 0, 0.25)',
  dropdown: '0 4px 20px 0 rgba(0, 0, 0, 0.4), 0 2px 8px 0 rgba(0, 0, 0, 0.3)',
  modal:
    '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 8px 16px -4px rgba(0, 0, 0, 0.35)',
  focus: '0 0 0 3px rgba(129, 140, 248, 0.45)',
  focusDanger: '0 0 0 3px rgba(248, 113, 113, 0.45)',
} as const;
