/**
 * colors.ts — Global Sindh Saga palette (Ajrak · truck art · Ruli).
 * Deep Indigo · Brick Red · Ivory Cream · Gold Accent
 */

export const SagaColors = {
  deepIndigo: '#1B2A6B',
  indigoDark: '#141F52',
  indigoLight: '#2A3D8F',

  brickRed: '#C0392B',
  brickDark: '#962D22',
  brickLight: '#D44635',

  ivory: '#FAF3E0',
  ivoryDark: '#EDE4CC',
  ivoryWarm: '#F5ECD6',

  gold: '#D4A017',
  goldLight: '#E8B84A',

  white: '#FFFFFF',
  black: '#1A1A1A',
  charcoal: '#2C2C2C',

  /** Semantic tokens */
  primary: '#C0392B',
  primaryDark: '#962D22',
  secondary: '#1B2A6B',
  background: '#FAF3E0',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#5A5348',
  textOnDark: '#FAF3E0',
  textMutedOnDark: 'rgba(250, 243, 224, 0.78)',
  border: '#DDD3BC',
  borderAccent: '#C0392B',
  overlay: 'rgba(27, 42, 107, 0.72)',
  error: '#DC2626',

  /** Ruli / truck-art accent strips */
  ruliGreen: '#2E7D4F',
  ruliOrange: '#E67E22',
  ruliMagenta: '#8E44AD',
  ruliCyan: '#16A085',

  patternTint: 'rgba(27, 42, 107, 0.08)',
  patternTintWarm: 'rgba(192, 57, 43, 0.06)',
} as const;

export const Gradients = {
  hero: ['#1B2A6B', '#2A3D8F', '#C0392B'] as const,
  heroOverlay: ['rgba(27,42,107,0.85)', 'rgba(27,42,107,0.55)'] as const,
  footer: ['#141F52', '#1B2A6B'] as const,
  card: ['#FFFFFF', '#FAF3E0'] as const,
  goldShine: ['#D4A017', '#E8B84A'] as const,
};
