// OKLCH utilities
export { parseOklch, formatOklch, oklchToHex, hexToOklch } from "./oklch";

// Token types and definitions
export type {
  ThemeMode,
  ResolvedMode,
  SurfaceTintStyle,
  PaletteColor,
  ModeOverrides,
  ThemeOverrides,
  NeutralTokenDef,
} from "./tokens";
export { NEUTRAL_TOKENS, NEUTRAL_TOKEN_NAMES, PALETTE_COLORS } from "./tokens";

// Theme defaults
export {
  DEFAULT_PALETTE_LIGHT,
  DEFAULT_PALETTE_DARK,
  DEFAULT_SURFACE_LIGHT,
  DEFAULT_SURFACE_DARK,
  PREVIEW_LEVELS_LIGHT,
  PREVIEW_LEVELS_DARK,
} from "./defaults";

// Theme store
export {
  createThemeStore,
  resolveIsDark,
  safeOklchToHex,
  hasModeOverrides,
  getRecentColors,
  addRecentColor,
} from "./store";
export type { ThemeStoreConfig } from "./store";

// Provider and hook
export { StduiProvider, useTheme } from "./provider";
