// Shadow strength resolves from the --app-shadow token (softer in light,
// stronger in dark) so elevation adapts with the theme from one place.
export const shadows = {
  sm: '0 1px 3px var(--app-shadow)',
  md: '0 4px 10px var(--app-shadow)',
  lg: '0 8px 30px var(--app-shadow)',
} as const;
