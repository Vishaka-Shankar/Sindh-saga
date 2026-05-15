/**
 * colors.ts — Ajrak-inspired Sindhi heritage palette for SindhSaga.
 * Deep red, indigo, black, and warm cream — balanced for modern UI.
 */

export const SagaColors = {
  /** Ajrak crimson */
  crimson: '#9B1B30',
  crimsonDark: '#7A1526',
  crimsonLight: '#C42E48',

  /** Traditional indigo / neel */
  indigo: '#1E3A5F',
  indigoDark: '#152A45',
  indigoLight: '#2D4F7C',

  /** Neutrals */
  black: '#1A1A1A',
  charcoal: '#2D2D2D',
  cream: '#FAF7F2',
  creamDark: '#F0EBE3',
  white: '#FFFFFF',

  /** Semantic aliases (used across components) */
  primary: '#9B1B30',
  primaryDark: '#7A1526',
  secondary: '#1E3A5F',
  background: '#FAF7F2',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#5C5C5C',
  textOnDark: '#FFFFFF',
  textMutedOnDark: 'rgba(255,255,255,0.82)',
  border: '#E8E0D4',
  borderAccent: '#9B1B30',
  gold: '#C9A227',
  error: '#DC2626',

  /** Subtle pattern overlay */
  patternTint: 'rgba(30, 58, 95, 0.06)',
  patternTintWarm: 'rgba(155, 27, 48, 0.05)',
} as const;

export const Gradients = {
  hero: ['#1E3A5F', '#9B1B30', '#7A1526'] as const,
  heroSoft: ['#2D4F7C', '#9B1B30'] as const,
  cardAccent: ['#FAF7F2', '#F0EBE3'] as const,
};
