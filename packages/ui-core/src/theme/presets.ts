import { tokens } from "../tokens/schema";
import { formatOklch } from "./oklch";
import type { ModeOverrides, ResolvedMode, ThemeOverrides, ThemePreset } from "./tokens";

/**
 * The curated looks. Each one sets both modes, uses a solid surface tint, and
 * keeps the neutral chroma low. Every accent passes 4.5:1 against the page
 * background and its own text in its mode (`presets.test.ts` holds this).
 */
export const THEME_PRESETS: readonly ThemePreset[] = [
  { id: "default", name: "Default", overrides: {} },
  {
    id: "graphite",
    name: "Graphite",
    overrides: {
      light: { neutralHue: 0, neutralChroma: 0, surfaceBase: "oklch(0.95 0 0)" },
      dark: { neutralHue: 0, neutralChroma: 0, surfaceBase: "oklch(0.2 0 0)" },
    },
  },
  {
    id: "slate",
    name: "Slate",
    overrides: {
      light: {
        neutralHue: 250,
        neutralChroma: 0.01,
        surfaceBase: "oklch(0.94 0.014 250)",
        palette: { primary: "oklch(0.5 0.13 258)" },
      },
      dark: {
        neutralHue: 250,
        neutralChroma: 0.01,
        surfaceBase: "oklch(0.21 0.016 255)",
        palette: { primary: "oklch(0.74 0.11 258)" },
      },
    },
  },
  {
    id: "sand",
    name: "Sand",
    overrides: {
      light: {
        neutralHue: 70,
        neutralChroma: 0.006,
        surfaceBase: "oklch(0.945 0.02 75)",
        palette: { primary: "oklch(0.52 0.12 45)" },
      },
      dark: {
        neutralHue: 70,
        neutralChroma: 0.006,
        surfaceBase: "oklch(0.21 0.012 70)",
        palette: { primary: "oklch(0.76 0.1 55)" },
      },
    },
  },
  {
    id: "sage",
    name: "Sage",
    overrides: {
      light: {
        neutralHue: 150,
        neutralChroma: 0.006,
        surfaceBase: "oklch(0.945 0.016 150)",
        palette: { primary: "oklch(0.5 0.09 155)" },
      },
      dark: {
        neutralHue: 150,
        neutralChroma: 0.006,
        surfaceBase: "oklch(0.21 0.012 155)",
        palette: { primary: "oklch(0.76 0.09 155)" },
      },
    },
  },
  {
    id: "mist",
    name: "Mist",
    overrides: {
      light: {
        neutralHue: 220,
        neutralChroma: 0.006,
        surfaceBase: "oklch(0.95 0.012 215)",
        palette: { primary: "oklch(0.5 0.09 225)" },
      },
      dark: {
        neutralHue: 220,
        neutralChroma: 0.006,
        surfaceBase: "oklch(0.21 0.014 225)",
        palette: { primary: "oklch(0.76 0.09 220)" },
      },
    },
  },
];

function canonicalMode(mo: ModeOverrides | undefined) {
  if (!mo) return undefined;
  const out: Record<string, unknown> = {};
  if (mo.neutralHue != null) out.neutralHue = mo.neutralHue;
  if (mo.neutralChroma != null) out.neutralChroma = mo.neutralChroma;
  if (mo.surfaceBase != null) out.surfaceBase = mo.surfaceBase;
  const palette = Object.entries(mo.palette ?? {})
    .filter(([, v]) => v != null)
    .sort(([a], [b]) => a.localeCompare(b));
  if (palette.length > 0) out.palette = Object.fromEntries(palette);
  return Object.keys(out).length > 0 ? out : undefined;
}

function canonical(overrides: ThemeOverrides) {
  return JSON.stringify({
    light: canonicalMode(overrides.light),
    dark: canonicalMode(overrides.dark),
  });
}

/** The first preset whose overrides equal these, or undefined for a custom state. */
export function findPreset(overrides: ThemeOverrides, presets: readonly ThemePreset[]) {
  const key = canonical(overrides);
  return presets.find((p) => canonical(p.overrides) === key);
}

/** Colours for drawing a preset thumbnail in one mode. */
export function presetSwatch(preset: ThemePreset, mode: ResolvedMode) {
  const mo = preset.overrides[mode] ?? {};
  const hue = mo.neutralHue ?? 0;
  const chroma = mo.neutralChroma ?? 0;
  return {
    surface: mo.surfaceBase ?? tokens.surface.base[mode],
    panel: formatOklch(tokens.neutral.bg[mode].l, chroma, hue),
    line: formatOklch(tokens.neutral["fg-subtle"][mode].l, chroma, hue),
    accent: mo.palette?.primary ?? tokens.palette.primary[mode].value,
  };
}
