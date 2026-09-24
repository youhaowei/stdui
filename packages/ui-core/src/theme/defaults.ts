import { tokens } from "../tokens/schema";
import { PALETTE_COLORS, type PaletteColor, type ResolvedMode } from "./tokens";

function paletteDefaults(mode: ResolvedMode): Record<PaletteColor, string> {
  return Object.fromEntries(
    PALETTE_COLORS.map((name) => [name, tokens.palette[name][mode].value]),
  ) as Record<PaletteColor, string>;
}
export const DEFAULT_PALETTE_LIGHT = paletteDefaults("light");
export const DEFAULT_PALETTE_DARK = paletteDefaults("dark");
export const DEFAULT_SURFACE_LIGHT = tokens.surface.base.light;
export const DEFAULT_SURFACE_DARK = tokens.surface.base.dark;
