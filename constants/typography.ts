/**
 * typography.ts — Type scale for consistent hierarchy across screens.
 */

export const Typography = {
  hero: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.5 },
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 22, fontWeight: '700' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  subtitle: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 23 },
  caption: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  overline: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
  decorative: { fontSize: 20, fontWeight: '600' as const, letterSpacing: 0.5 },
};
