export type ThemeMode = "system" | "light" | "dark";
export type ResolvedMode = "light" | "dark";
export type SurfaceTintStyle = "solid" | "gradient2" | "gradient3";

export type PaletteColor = "primary" | "secondary" | "success" | "danger" | "warning" | "info";

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

export const NEUTRAL_TOKENS: Record<string, NeutralTokenDef> = {
  fg: { light: { l: 0.145 }, dark: { l: 0.985 } },
  "fg-subtle": { light: { l: 0.556 }, dark: { l: 0.708 } },
  bg: { light: { l: 1.0 }, dark: { l: 0.145 } },
  "bg-subtle": { light: { l: 0.98 }, dark: { l: 0.17 } },
  "bg-muted": { light: { l: 0.96 }, dark: { l: 0.19 } },
  "bg-emphasis": { light: { l: 0.94 }, dark: { l: 0.22 } },
  "bg-bold": { light: { l: 0.92 }, dark: { l: 0.24 } },
  "bg-strongest": { light: { l: 0.9 }, dark: { l: 0.26 } },
  "bg-dim": { light: { l: 0.87 }, dark: { l: 0.12 } },
  border: { light: { l: 0.922 }, dark: { l: 1, alpha: 0.1 } },
  "border-subtle": { light: { l: 0.95 }, dark: { l: 1, alpha: 0.06 } },
  ring: { light: { l: 0.708 }, dark: { l: 0.556 } },
};

export const NEUTRAL_TOKEN_NAMES = Object.keys(NEUTRAL_TOKENS);

export const PALETTE_COLORS: PaletteColor[] = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
];
