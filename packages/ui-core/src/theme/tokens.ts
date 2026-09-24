import { tokens, type NeutralTokenName, type PaletteColor } from "../tokens/schema";
export type { PaletteColor } from "../tokens/schema";
export type ThemeMode = "system" | "light" | "dark";
export type ResolvedMode = "light" | "dark";

export interface ModeOverrides {
  palette?: Partial<Record<PaletteColor, string>>;
  neutralHue?: number;
  neutralChroma?: number;
  surfaceBase?: string;
}

export interface ThemeOverrides {
  light?: ModeOverrides;
  dark?: ModeOverrides;
}

/** What an import changed so the result still looks like the app. */
export type ThemeAdjustment = "contrast" | "softened";

/**
 * A named look: overrides for both modes. Built-in presets ship with the
 * package; imported ones are persisted by the theme store.
 */
export interface ThemePreset {
  id: string;
  name: string;
  overrides: ThemeOverrides;
  imported?: boolean;
  /** Present on imported presets whose colours were clamped. */
  adjustments?: ThemeAdjustment[];
}

/** Bounds a surface tint must stay inside, per mode. */
export const SURFACE_TINT_BOUNDS = {
  light: { minL: 0.88, maxL: 0.96, maxC: 0.04 },
  dark: { minL: 0.16, maxL: 0.42, maxC: 0.07 },
} as const;

/** Highest chroma the neutral ramp may carry. */
export const NEUTRAL_CHROMA_MAX = 0.03;

// -- Neutral token definitions ---------------------------------------------

export interface NeutralTokenDef {
  light: { l: number; alpha?: number };
  dark: { l: number; alpha?: number };
}

export const NEUTRAL_TOKENS: Record<NeutralTokenName, NeutralTokenDef> = tokens.neutral;
export const NEUTRAL_TOKEN_NAMES = Object.keys(tokens.neutral) as NeutralTokenName[];
export const PALETTE_COLORS = Object.keys(tokens.palette) as PaletteColor[];

/** Text colour that reads on an arbitrary `oklch(...)` fill: dark on light fills, light on dark. */
export function contrastFg(oklchStr: string) {
  const m = oklchStr.match(/oklch\(\s*([\d.]+)/);
  const l = m?.[1] != null ? parseFloat(m[1]) : NaN;
  return l > 0.6 ? tokens.contrastFg.onLight : tokens.contrastFg.onDark;
}
