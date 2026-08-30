// All chart colors resolve from the centralized tokens in theme/tokens.css.
// Data hues (status/priority) are a CVD-safe palette kept consistent across
// themes; chart chrome (grid/axis/ink/surface) adapts to light/dark.
// To rebrand charts, change the --app-chart-* values in tokens.css.

export const STATUS_COLORS: Record<string, string> = {
  Pending: 'var(--app-chart-pending)',
  'In Progress': 'var(--app-chart-in-progress)',
  Completed: 'var(--app-chart-completed)',
};

export const PRIORITY_COLORS: Record<string, string> = {
  Low: 'var(--app-chart-low)',
  Medium: 'var(--app-chart-medium)',
  High: 'var(--app-chart-high)',
};

export const CHART_BLUE = 'var(--app-chart-blue)';

export const CHART_INK = {
  grid: 'var(--app-chart-grid)',
  axis: 'var(--app-chart-axis)',
  baseline: 'var(--app-chart-baseline)',
  text: 'var(--app-chart-text)',
  strong: 'var(--app-chart-strong)',
  surface: 'var(--app-chart-surface)',
  cursor: 'var(--app-chart-cursor)',
};
