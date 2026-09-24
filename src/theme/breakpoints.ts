export const breakpoints = {
  xs: '0',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
} as const;

export const breakpointValues = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1440,
} as const;

export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`,
  'max-sm': `(max-width: ${Math.max(0, breakpointValues.sm - 1)}px)`,
  'max-md': `(max-width: ${Math.max(0, breakpointValues.md - 1)}px)`,
  'max-lg': `(max-width: ${Math.max(0, breakpointValues.lg - 1)}px)`,
  'max-xl': `(max-width: ${Math.max(0, breakpointValues.xl - 1)}px)`,
} as const;

export const containerMaxWidth = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
} as const;
