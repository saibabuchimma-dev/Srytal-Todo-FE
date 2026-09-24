export const transitions = {
  fast: '150ms ease-out',
  normal: '200ms ease-out',
  slow: '300ms ease-out',
  slower: '400ms ease-out',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  springFast: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  springSlow: 'cubic-bezier(0.25, 1, 0.5, 1)',
} as const;

export const durations = {
  instant: 0,
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 400,
  modal: 200,
  dropdown: 150,
  toast: 300,
  page: 300,
} as const;

export const easings = {
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  springFast: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  springSlow: 'cubic-bezier(0.25, 1, 0.5, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

export const animationPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: durations.normal / 1000, ease: easings.easeOut },
  },
  fadeOut: {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    transition: { duration: durations.fast / 1000, ease: easings.easeIn },
  },
  slideInFromTop: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: durations.normal / 1000, ease: easings.spring },
  },
  slideInFromBottom: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: durations.normal / 1000, ease: easings.spring },
  },
  slideInFromLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: durations.normal / 1000, ease: easings.spring },
  },
  slideInFromRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: durations.normal / 1000, ease: easings.spring },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: durations.fast / 1000, ease: easings.spring },
  },
  scaleOut: {
    initial: { opacity: 1, scale: 1 },
    animate: { opacity: 0, scale: 0.95 },
    transition: { duration: durations.fast / 1000, ease: easings.easeIn },
  },
  staggerContainer: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: durations.normal / 1000, ease: easings.spring },
  },
  cardHover: {
    initial: { y: 0 },
    animate: { y: -4 },
    transition: { duration: durations.normal / 1000, ease: easings.easeOut },
  },
  buttonPress: {
    initial: { scale: 1 },
    whileTap: { scale: 0.97 },
    transition: { duration: 100, ease: easings.easeOut },
  },
} as const;
