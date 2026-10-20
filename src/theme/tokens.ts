export const colors = {
  background: '#F2F5F7',
  surface: '#FFFFFF',
  text: '#0F1B2D',
  textMuted: '#5A6676',
  textFaint: '#6E7887',
  border: '#E1E6EB',
  primary: '#0B7A5C',
  primarySoft: 'rgba(11, 122, 92, 0.1)',
  onPrimary: '#FFFFFF',
  hero: '#0B4F3E',
  heroText: '#FFFFFF',
  heroMuted: 'rgba(255, 255, 255, 0.72)',
  heroAccent: '#7EE2B8',
  heroTrack: 'rgba(255, 255, 255, 0.16)',
  danger: '#B42318',
  dangerSoft: 'rgba(180, 35, 24, 0.08)',
  warning: '#8A5300',
  warningSoft: 'rgba(181, 109, 0, 0.12)',
  skeleton: '#E3E8ED',
} as const;

// Shares of the hero composition bar: tints of the hero accent, readable on the hero green.
export const compositionColors = ['#7EE2B8', '#C8F2DF', '#3FB98C', '#A6E9CC'] as const;

export const fonts = {
  display: 'SchibstedGrotesk_700Bold',
  displayMedium: 'SchibstedGrotesk_600SemiBold',
  mono: 'IBMPlexMono_500Medium',
  monoStrong: 'IBMPlexMono_600SemiBold',
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
  xl: 24,
  pill: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  hero: 40,
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
