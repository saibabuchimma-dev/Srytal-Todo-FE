/**
 * Typed accessors for the centralized color tokens defined in tokens.css.
 * Use these anywhere you need a color in JS/TSX (inline styles, Mantine
 * `style` props) so every color flows from one source and adapts to the
 * active light/dark theme automatically.
 *
 * Example:
 *   import { token } from '@/theme/tokens';
 *   <Box style={{ background: token.surface, color: token.text }} />
 */
export const token = {
  // Surfaces / text / borders
  bg: 'var(--app-bg)',
  surface: 'var(--app-surface)',
  surface2: 'var(--app-surface-2)',
  surfaceHover: 'var(--app-surface-hover)',
  border: 'var(--app-border)',
  text: 'var(--app-text)',
  textMuted: 'var(--app-text-muted)',

  // Brand primary
  primary: 'var(--app-primary)',
  primaryHover: 'var(--app-primary-hover)',

  // Accent (tinted badges, selected states)
  accent: 'var(--app-accent)',
  accentFg: 'var(--app-accent-fg)',
  accentSoft: 'var(--app-accent-soft)',

  // Semantic
  success: 'var(--app-success)',
  warning: 'var(--app-warning)',
  danger: 'var(--app-danger)',

  // Brand / login surfaces
  brandGradient: 'var(--app-brand-gradient)',
  brandOn: 'var(--app-brand-on)',
  overlay: 'var(--app-overlay)',
  glassBg: 'var(--app-glass-bg)',
  glassBorder: 'var(--app-glass-border)',
} as const;

export type ColorToken = keyof typeof token;
