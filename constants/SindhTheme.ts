/**
 * constants/SindhTheme.ts
 * Central design token file for Sindh Saga — Sindhi heritage colour palette,
 * typography scale, and spacing tokens.
 *
 * Import anywhere:
 *   import { COLORS, FONTS, SPACING, RADIUS } from '../constants/SindhTheme';
 */

// ---------------------------------------------------------------------------
// Colour palette
// ---------------------------------------------------------------------------
export const COLORS = {
  // ── Primary brand palette (Ajrak-inspired) ─────────────────────────────
  ajrakRed:      '#9E2A2B',   // Primary brand red
  ajrakRedLight: '#C4504F',   // Lighter variant for hover / active
  ajrakRedDark:  '#6E1A1B',   // Deeper for text on light backgrounds

  // ── Secondary (deep indigo, like the indigo dye in Ajrak) ──────────────
  deepBlue:      '#1D3557',
  deepBlueLight: '#2E5280',
  deepBlueDark:  '#0F1E36',

  // ── Accent / highlight ─────────────────────────────────────────────────
  golden:        '#C9A96E',   // Mirror-work gold
  goldenLight:   '#F2C46D',   // Bright highlight
  goldenDark:    '#9A7540',

  // ── Neutral / surface ──────────────────────────────────────────────────
  cream:         '#FDFAF6',   // App background
  sand:          '#F2E9E4',   // Card / surface alt
  warmGray:      '#E8DECE',   // Borders and dividers
  brown:         '#7C5C3A',   // Heritage / archaeology tones
  brownLight:    '#A8825A',
  brownDark:     '#503C25',

  // ── Category colours ──────────────────────────────────────────────────
  foodOrange:    '#B5560A',
  musicGreen:    '#2E5E4E',
  festivalPurple:'#6B2D8B',

  // ── Text ───────────────────────────────────────────────────────────────
  textPrimary:   '#1A1107',
  textSecondary: '#4A3E30',
  textMuted:     '#8A7B6A',
  textOnDark:    '#FFFFFF',
  textOnDarkMuted: 'rgba(255,255,255,0.72)',

  // ── Status ─────────────────────────────────────────────────────────────
  success:       '#2E7D52',
  warning:       '#B8730A',
  error:         '#9E2A2B',
  info:          '#1D3557',

  // ── Overlay ────────────────────────────────────────────────────────────
  overlayLight:  'rgba(253,250,246,0.92)',
  overlayDark:   'rgba(0,0,0,0.68)',
};

// Category → primary colour lookup
export const CATEGORY_ACCENT: Record<string, string> = {
  Crafts:    COLORS.ajrakRed,
  Clothing:  COLORS.deepBlue,
  Food:      COLORS.foodOrange,
  Music:     COLORS.musicGreen,
  Heritage:  COLORS.brown,
  History:   COLORS.brown,
  Festival:  COLORS.festivalPurple,
};

// ---------------------------------------------------------------------------
// Ajrak-pattern block sequence
// ---------------------------------------------------------------------------
export const AJRAK_PALETTE = [
  COLORS.ajrakRed,
  COLORS.goldenLight,
  COLORS.deepBlue,
  COLORS.golden,
  COLORS.ajrakRed,
  COLORS.sand,
  COLORS.deepBlue,
  COLORS.ajrakRed,
  COLORS.goldenLight,
  COLORS.deepBlue,
  COLORS.golden,
  COLORS.ajrakRed,
];

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------
export const FONTS = {
  displayLarge:  { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.8 },
  displayMedium: { fontSize: 26, fontWeight: '700' as const, letterSpacing: -0.4 },
  displaySmall:  { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.2 },
  headingLarge:  { fontSize: 20, fontWeight: '700' as const },
  headingMedium: { fontSize: 17, fontWeight: '600' as const },
  headingSmall:  { fontSize: 15, fontWeight: '600' as const },
  bodyLarge:     { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium:    { fontSize: 14, fontWeight: '400' as const, lineHeight: 21 },
  bodySmall:     { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },
  label:         { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.5 },
  caption:       { fontSize: 11, fontWeight: '400' as const, color: COLORS.textMuted },

  // Sindhi / Arabic script
  sindhiLarge:   { fontSize: 24, fontWeight: '600' as const, textAlign: 'right' as const },
  sindhiMedium:  { fontSize: 18, fontWeight: '500' as const, textAlign: 'right' as const },
  sindhiSmall:   { fontSize: 14, fontWeight: '400' as const, textAlign: 'right' as const },
};

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------
export const SPACING = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  xxl: 32,
  xxxl: 48,
};

// ---------------------------------------------------------------------------
// Border radius
// ---------------------------------------------------------------------------
export const RADIUS = {
  sm:   6,
  md:   10,
  lg:   16,
  xl:   24,
  pill: 999,
};

// ---------------------------------------------------------------------------
// Shadows (cross-platform)
// ---------------------------------------------------------------------------
import { Platform } from 'react-native';

export const SHADOWS = {
  small: Platform.select({
    ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
    android: { elevation: 3 },
    web:     { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    default: {},
  }),
  medium: Platform.select({
    ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 12 },
    android: { elevation: 6 },
    web:     { boxShadow: '0 4px 18px rgba(0,0,0,0.12)' },
    default: {},
  }),
  large: Platform.select({
    ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 20 },
    android: { elevation: 10 },
    web:     { boxShadow: '0 8px 32px rgba(0,0,0,0.16)' },
    default: {},
  }),
};
