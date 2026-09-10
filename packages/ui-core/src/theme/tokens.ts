import { tokens, type NeutralTokenName, type PaletteColor } from "../tokens/schema";
export type { PaletteColor } from "../tokens/schema";
export type ThemeMode = "system" | "light" | "dark";
export type ResolvedMode = "light" | "dark";
export type SurfaceTintStyle = "solid" | "gradient2" | "gradient3";

export interface ModeOverrides {
  palette?: Partial<Record<PaletteColor, string>>;
  neutralHue?: number;
  neutralChroma?: number;
  surfaceBase?: string;
  surfaceTintStyle?: SurfaceTintStyle;
}

export interface ThemeOverrides {
  light?: ModeOverrides;
  dark?: ModeOverrides;
}

// -- Neutral token definitions ---------------------------------------------

export interface NeutralTokenDef {
  light: { l: number; alpha?: number };
  dark: { l: number; alpha?: number };
}

export const NEUTRAL_TOKENS: Record<NeutralTokenName, NeutralTokenDef> = tokens.neutral;
export const NEUTRAL_TOKEN_NAMES = Object.keys(tokens.neutral) as NeutralTokenName[];
export const PALETTE_COLORS = Object.keys(tokens.palette) as PaletteColor[];
