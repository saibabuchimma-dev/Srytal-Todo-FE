// Kept for backwards compatibility. Values now resolve from the centralized
// tokens in theme/tokens.css so there are no competing static colors.
export const colors = {
  primary: 'var(--app-primary)',
  secondary: 'var(--app-accent)',

  success: 'var(--app-success)',
  warning: 'var(--app-warning)',
  error: 'var(--app-danger)',

  gray: 'var(--app-text-muted)',

  background: 'var(--app-bg)',
  white: 'var(--app-surface)',
} as const;
