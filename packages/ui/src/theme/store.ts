import { create } from "zustand";
import { formatOklch, parseOklch, oklchToHex } from "./oklch";
import {
  type ThemeMode,
  type ResolvedMode,
  type SurfaceTintStyle,
  type ModeOverrides,
  type ThemeOverrides,
  NEUTRAL_TOKENS,
  NEUTRAL_TOKEN_NAMES,
  PALETTE_COLORS,
} from "./tokens";

// -- Config ----------------------------------------------------------------

export interface ThemeStoreConfig {
  storageKey?: string;
  target?: HTMLElement;
}

interface ThemeState {
  mode: ThemeMode;
  overrides: ThemeOverrides;
  previewMode: ResolvedMode | null;
  setMode: (mode: ThemeMode) => void;
  setOverrides: (overrides: ThemeOverrides) => void;
  resetOverrides: () => void;
  setPreviewMode: (preview: ResolvedMode | null) => void;
}

const MAX_RECENT_COLORS = 12;

// -- Helpers ---------------------------------------------------------------

function getStorageKey(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

function getStoredTheme(prefix: string): ThemeMode {
  try {
    const stored = localStorage.getItem(getStorageKey(prefix, "theme"));
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {
    /* ignore */
  }
  return "system";
}

function getStoredOverrides(prefix: string): ThemeOverrides {
  try {
    const stored = localStorage.getItem(getStorageKey(prefix, "theme-overrides"));
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return {};
}

function getSystemPrefersDark() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveIsDark(mode: ThemeMode, previewMode?: ResolvedMode | null) {
  if (previewMode != null) return previewMode === "dark";
  return mode === "dark" || (mode === "system" && getSystemPrefersDark());
}

function contrastFg(oklchStr: string) {
  try {
    const { l } = parseOklch(oklchStr);
    return l > 0.6 ? "oklch(0.205 0 0)" : "oklch(0.985 0 0)";
  } catch {
    return "oklch(0.985 0 0)";
  }
}

// -- Apply functions -------------------------------------------------------

function applyTheme(target: HTMLElement, mode: ThemeMode, previewMode?: ResolvedMode | null) {
  const isDark = resolveIsDark(mode, previewMode);
  target.classList.toggle("dark", isDark);
}

function applyPaletteOverrides(style: CSSStyleDeclaration, palette: ModeOverrides["palette"]) {
  for (const name of PALETTE_COLORS) {
    const value = palette?.[name];
    if (value) {
      style.setProperty(`--palette-${name}`, value);
      style.setProperty(`--palette-${name}-fg`, contrastFg(value));
    } else {
      style.removeProperty(`--palette-${name}`);
      style.removeProperty(`--palette-${name}-fg`);
    }
  }
}

function applyNeutralOverrides(
  style: CSSStyleDeclaration,
  modeKey: ResolvedMode,
  isDark: boolean,
  neutralHue: number | undefined,
  neutralChroma: number | undefined,
) {
  if (neutralHue != null || neutralChroma != null) {
    const hue = neutralHue ?? 0;
    const chroma = neutralChroma ?? 0;
    for (const token of NEUTRAL_TOKEN_NAMES) {
      const def = NEUTRAL_TOKENS[token][modeKey];
      style.setProperty(`--neutral-${token}`, formatOklch(def.l, chroma, hue, def.alpha));
    }
    const ringDef = NEUTRAL_TOKENS["ring"][modeKey];
    style.setProperty(
      "--neutral-ring-glow",
      formatOklch(ringDef.l, chroma, hue, isDark ? 0.2 : 0.3),
    );
  } else {
    for (const token of NEUTRAL_TOKEN_NAMES) {
      style.removeProperty(`--neutral-${token}`);
    }
    style.removeProperty("--neutral-ring-glow");
  }
}

function buildSurfaceBg(
  tintStyle: SurfaceTintStyle,
  start: string,
  mid: string,
  end: string,
): string {
  const dir = "to bottom";
  if (tintStyle === "gradient3")
    return `linear-gradient(${dir}, ${start} 0%, ${mid} 50%, ${end} 100%)`;
  if (tintStyle === "gradient2") return `linear-gradient(${dir}, ${start} 0%, ${end} 100%)`;
  return start;
}

function applySurfaceOverrides(
  style: CSSStyleDeclaration,
  isDark: boolean,
  surfaceBase: string | undefined,
  surfaceTintStyle: SurfaceTintStyle | undefined,
) {
  if (!surfaceBase) {
    style.removeProperty("--surface-base");
    style.removeProperty("--shell-bg");
    return;
  }

  style.setProperty("--surface-base", surfaceBase);

  let parsedSurface: { l: number; c: number; h: number } | null = null;
  try {
    const { l, c, h } = parseOklch(surfaceBase);
    parsedSurface = { l, c, h };
  } catch {
    /* keep null */
  }

  const tintStyle = surfaceTintStyle ?? "solid";
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const rawL = parsedSurface?.l ?? (isDark ? 0.3 : 0.8);
  const rawC = parsedSurface?.c ?? 0;
  const rawH = parsedSurface?.h ?? 0;
  const minL = isDark ? 0.16 : 0.88;
  const maxL = isDark ? 0.42 : 0.96;
  const maxC = isDark ? 0.07 : 0.04;
  const baseL = clamp(rawL, minL, maxL);
  const baseC = clamp(rawC, 0, maxC);
  const baseH = rawH;
  // All variants start from the same color (top anchor), gradients go darker toward bottom
  const topL = clamp(baseL - (isDark ? 0.03 : 0.02), isDark ? 0.1 : 0.82, maxL);
  const midL = clamp(baseL - (isDark ? 0.06 : 0.04), isDark ? 0.1 : 0.82, maxL);
  const endL = clamp(baseL - (isDark ? 0.1 : 0.06), isDark ? 0.1 : 0.82, maxL);
  const start = formatOklch(topL, baseC, baseH);
  const mid = formatOklch(midL, baseC, baseH);
  const end = formatOklch(endL, baseC, baseH);

  style.setProperty("--shell-bg", buildSurfaceBg(tintStyle, start, mid, end));
}

function applyOverrides(
  target: HTMLElement,
  overrides: ThemeOverrides,
  mode: ThemeMode,
  previewMode?: ResolvedMode | null,
) {
  const style = target.style;
  const isDark = resolveIsDark(mode, previewMode);
  const modeKey: ResolvedMode = isDark ? "dark" : "light";
  const modeOverrides = overrides[modeKey] ?? {};

  applyPaletteOverrides(style, modeOverrides.palette);
  applyNeutralOverrides(
    style,
    modeKey,
    isDark,
    modeOverrides.neutralHue,
    modeOverrides.neutralChroma,
  );
  applySurfaceOverrides(style, isDark, modeOverrides.surfaceBase, modeOverrides.surfaceTintStyle);
}

function clearAllOverrideStyles(target: HTMLElement) {
  const style = target.style;
  for (const name of PALETTE_COLORS) {
    style.removeProperty(`--palette-${name}`);
    style.removeProperty(`--palette-${name}-fg`);
  }
  for (const token of NEUTRAL_TOKEN_NAMES) {
    style.removeProperty(`--neutral-${token}`);
  }
  style.removeProperty("--neutral-ring-glow");
  style.removeProperty("--surface-base");
  style.removeProperty("--shell-bg");
}

// -- Store factory ---------------------------------------------------------

export function createThemeStore(config: ThemeStoreConfig = {}) {
  const prefix = config.storageKey ?? "stdui";
  const target =
    config.target ?? (typeof document !== "undefined" ? document.documentElement : null);

  return create<ThemeState>((set, get) => {
    const initialMode = getStoredTheme(prefix);
    const initialOverrides = getStoredOverrides(prefix);

    if (target) {
      applyTheme(target, initialMode);
      applyOverrides(target, initialOverrides, initialMode);

      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", () => {
        const { mode, overrides, previewMode } = get();
        if (previewMode != null) return;
        applyTheme(target, mode);
        if (mode === "system") {
          applyOverrides(target, overrides, "system");
        }
      });
    }

    return {
      mode: initialMode,
      overrides: initialOverrides,
      previewMode: null,

      setMode: (mode) => {
        localStorage.setItem(getStorageKey(prefix, "theme"), mode);
        const preview = get().previewMode;
        if (target) {
          applyTheme(target, mode, preview);
          applyOverrides(target, get().overrides, mode, preview);
        }
        set({ mode });
      },

      setOverrides: (overrides) => {
        localStorage.setItem(getStorageKey(prefix, "theme-overrides"), JSON.stringify(overrides));
        const { mode, previewMode } = get();
        if (target) {
          applyOverrides(target, overrides, mode, previewMode);
        }
        set({ overrides });
      },

      resetOverrides: () => {
        localStorage.removeItem(getStorageKey(prefix, "theme-overrides"));
        if (target) {
          clearAllOverrideStyles(target);
        }
        set({ overrides: {} });
      },

      setPreviewMode: (preview) => {
        const { mode, overrides } = get();
        if (target) {
          applyTheme(target, mode, preview);
          applyOverrides(target, overrides, mode, preview);
        }
        set({ previewMode: preview });
      },
    };
  });
}

// -- Exported helpers ------------------------------------------------------

export function safeOklchToHex(oklchStr: string) {
  try {
    const { l, c, h } = parseOklch(oklchStr);
    return oklchToHex(l, c, h);
  } catch {
    return "#808080";
  }
}

export function hasModeOverrides(mo: ModeOverrides | undefined) {
  if (!mo) return false;
  return (
    (mo.palette != null && Object.keys(mo.palette).length > 0) ||
    mo.neutralHue != null ||
    mo.neutralChroma != null ||
    mo.surfaceBase != null ||
    mo.surfaceTintStyle != null
  );
}

// -- Recent colors (localStorage-backed) -----------------------------------

export function getRecentColors(prefix = "stdui"): string[] {
  try {
    const stored = localStorage.getItem(getStorageKey(prefix, "recent-colors"));
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return [];
}

export function addRecentColor(oklch: string, prefix = "stdui") {
  const recent = getRecentColors(prefix).filter((c) => c !== oklch);
  recent.unshift(oklch);
  if (recent.length > MAX_RECENT_COLORS) recent.length = MAX_RECENT_COLORS;
  try {
    localStorage.setItem(getStorageKey(prefix, "recent-colors"), JSON.stringify(recent));
  } catch {
    /* ignore */
  }
}
