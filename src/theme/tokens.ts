import { colors, semanticColors, gradients } from './colors';
import { spacing, layout } from './spacing';
import { shadows, darkShadows } from './shadows';
import { radius } from './radius';
import {
  typography,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
} from './typography';
import { breakpoints } from './breakpoints';
import {
  transitions,
  durations,
  easings,
  animationPresets,
} from './transitions';

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
  loading: 1800,
} as const;

export const sizes = {
  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    '2xl': 32,
  },
  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
    '2xl': 72,
  },
  button: {
    sm: { height: 32, paddingX: 12, fontSize: 13 },
    md: { height: 40, paddingX: 16, fontSize: 14 },
    lg: { height: 48, paddingX: 24, fontSize: 15 },
  },
  input: {
    sm: { height: 32, paddingX: 10, fontSize: 13 },
    md: { height: 40, paddingX: 12, fontSize: 14 },
    lg: { height: 48, paddingX: 14, fontSize: 15 },
  },
} as const;

export const token = {
  surface: 'var(--app-surface)',
  surface2: 'var(--app-surface-2)',
  text: 'var(--app-text)',
  border: 'var(--app-border)',
  primary: 'var(--app-primary)',
} as const;

export const designTokens = {
  colors: {
    ...colors,
    ...semanticColors,
    ...gradients,
  },
  spacing,
  layout,
  shadows,
  darkShadows,
  radius,
  typography,
  breakpoints,
  transitions,
  durations,
  easings,
  animationPresets,
  zIndex,
  sizes,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  token,
} as const;
