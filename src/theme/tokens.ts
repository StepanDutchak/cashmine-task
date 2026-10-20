export const colors = {
  background: '#F5F6F8',
  surface: '#FFFFFF',
  text: '#111827',
  textMuted: '#5B6472',
  border: '#E3E6EA',
  primary: '#0B7A5C',
  primarySoft: 'rgba(11, 122, 92, 0.1)',
  onPrimary: '#FFFFFF',
  danger: '#B42318',
  dangerSoft: 'rgba(180, 35, 24, 0.08)',
  warning: '#8A5300',
  warningSoft: 'rgba(181, 109, 0, 0.12)',
  skeleton: '#E6E9ED',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const fontWeight = {
  regular: '400',
  semibold: '600',
  bold: '700',
} as const;

export const layout = {
  maxContentWidth: 480,
  minTouchTarget: 44,
} as const;
