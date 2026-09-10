import { tokens } from "../tokens/schema";
import {
  PALETTE_COLORS,
  NEUTRAL_TOKEN_NAMES,
  type PaletteColor,
  type ResolvedMode,
} from "./tokens";

function paletteDefaults(mode: ResolvedMode): Record<PaletteColor, string> {
  return Object.fromEntries(
    PALETTE_COLORS.map((name) => [name, tokens.palette[name][mode].value]),
  ) as Record<PaletteColor, string>;
}
function previewLevels(mode: ResolvedMode) {
  const levels = NEUTRAL_TOKEN_NAMES.filter((name) => name === "bg" || name.startsWith("bg-")).map(
    (name) => tokens.neutral[name][mode].l,
  );
  return levels.sort((a, b) => (mode === "light" ? b - a : a - b));
}
export const DEFAULT_PALETTE_LIGHT = paletteDefaults("light");
export const DEFAULT_PALETTE_DARK = paletteDefaults("dark");
export const DEFAULT_SURFACE_LIGHT = tokens.surface.base.light;
export const DEFAULT_SURFACE_DARK = tokens.surface.base.dark;
export const PREVIEW_LEVELS_LIGHT = previewLevels("light");
export const PREVIEW_LEVELS_DARK = previewLevels("dark");
