import { createTheme } from '@mantine/core';
import { mantinePalettes, semanticColors, gradients } from './colors';
import { radius } from './radius';
import { shadows } from './shadows';
import { fontFamily, fontSize, fontWeight, lineHeight } from './typography';
import { spacing } from './spacing';
import { breakpoints } from './breakpoints';
import { transitions, durations, easings } from './transitions';

export const theme = createTheme({
  primaryColor: 'primary',
  colors: mantinePalettes,
  fontFamily: fontFamily.sans,
  fontFamilyMonospace: fontFamily.mono,
  headings: {
    fontFamily: fontFamily.sans,
    fontWeight: String(fontWeight.bold),
    sizes: {
      h1: { fontSize: fontSize['4xl'], lineHeight: String(lineHeight.tight) },
      h2: { fontSize: fontSize['3xl'], lineHeight: String(lineHeight.tight) },
      h3: { fontSize: fontSize['2xl'], lineHeight: String(lineHeight.snug) },
      h4: { fontSize: fontSize.xl, lineHeight: String(lineHeight.snug) },
      h5: { fontSize: fontSize.lg, lineHeight: String(lineHeight.normal) },
      h6: { fontSize: fontSize.base, lineHeight: String(lineHeight.normal) },
    },
  },
  defaultRadius: 'md',
  radius: {
    xs: radius.xs,
    sm: radius.sm,
    md: radius.md,
    lg: radius.lg,
    xl: radius.xl,
  },
  shadows: {
    xs: shadows.xs,
    sm: shadows.sm,
    md: shadows.md,
    lg: shadows.lg,
    xl: shadows.xl,
  },
  breakpoints: {
    xs: breakpoints.xs || '30em',
    sm: breakpoints.sm || '48em',
    md: breakpoints.md || '64em',
    lg: breakpoints.lg || '74em',
    xl: breakpoints.xl || '90em',
  },
  spacing: {
    xs: spacing[2],
    sm: spacing[3],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
        size: 'sm',
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
        shadow: 'sm',
        withBorder: true,
      },
    },
    Paper: {
      defaultProps: {
        radius: 'lg',
        shadow: 'sm',
        withBorder: true,
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
        size: 'sm',
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: 'md',
        size: 'sm',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
        size: 'sm',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
        size: 'sm',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'lg',
        centered: true,
        padding: 'lg',
      },
    },
    Badge: {
      defaultProps: {
        radius: 'xl',
        size: 'sm',
        variant: 'light',
      },
    },
    Tooltip: {
      defaultProps: {
        radius: 'sm',
        offset: 8,
      },
    },
  },
  other: {
    colors: semanticColors,
    gradients,
    transitions,
    durations,
    easings,
  },
});

export default theme;
