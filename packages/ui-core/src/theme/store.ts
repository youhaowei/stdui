import { tokens } from "../tokens/schema";
import { createStore } from "zustand/vanilla";
import { formatOklch, parseOklch } from "./oklch";
import {
  type ThemeMode,
  type ResolvedMode,
  type ModeOverrides,
  type ThemeOverrides,
  type ThemePreset,
  NEUTRAL_TOKENS,
  NEUTRAL_TOKEN_NAMES,
  PALETTE_COLORS,
  SURFACE_TINT_BOUNDS,
  contrastFg,
} from "./tokens";
import { readImportedPresets } from "./theme-import";

// -- Config ----------------------------------------------------------------

export interface ThemeStoreConfig {
  storageKey?: string;
  target?: HTMLElement;
}

interface ThemeState {
  mode: ThemeMode;
  overrides: ThemeOverrides;
  /** Presets the user imported; built-ins live in `THEME_PRESETS`. */
  importedPresets: ThemePreset[];
  /** Id of the preset last applied, so identical presets stay distinguishable. */
  presetId: string | null;
  setMode: (mode: ThemeMode) => void;
  /** Applies overrides; pass the preset id when they come from a preset. */
  setOverrides: (overrides: ThemeOverrides, presetId?: string) => void;
  resetOverrides: () => void;
  /**
   * Adds an imported preset, replacing one with the same id. State updates
   * even when storage fails; `persisted: false` means it lasts this session only.
   */
  addImportedPreset: (preset: ThemePreset) => { persisted: boolean };
}

// -- Helpers ---------------------------------------------------------------

function getStorageKey(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

/** Writes to localStorage (or removes when `value` is null); false when storage is unavailable. */
function persist(key: string, value: string | null) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function getStoredPresetId(prefix: string): string | null {
  try {
    return localStorage.getItem(getStorageKey(prefix, "theme-preset"));
  } catch {
    return null;
  }
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

function getStoredPresets(prefix: string): ThemePreset[] {
  try {
    const stored = localStorage.getItem(getStorageKey(prefix, "theme-presets"));
    if (stored) return readImportedPresets(JSON.parse(stored));
  } catch {
    /* ignore */
  }
  return [];
}

function getSystemPrefersDark() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveIsDark(mode: ThemeMode) {
  return mode === "dark" || (mode === "system" && getSystemPrefersDark());
}

// -- Apply functions -------------------------------------------------------

function applyTheme(target: HTMLElement, mode: ThemeMode) {
  const isDark = resolveIsDark(mode);
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
  neutralHue: number | undefined,
  neutralChroma: number | undefined,
) {
  if (neutralHue != null || neutralChroma != null) {
    const hue = neutralHue ?? 0;
    const chroma = neutralChroma ?? 0;
    for (const token of NEUTRAL_TOKEN_NAMES) {
      const def = NEUTRAL_TOKENS[token]?.[modeKey];
      if (!def) continue;
      style.setProperty(`--neutral-${token}`, formatOklch(def.l, chroma, hue, def.alpha));
    }
    const ringDef = NEUTRAL_TOKENS["ring"]?.[modeKey];
    if (ringDef) {
      style.setProperty(
        "--neutral-ring-glow",
        formatOklch(ringDef.l, chroma, hue, tokens.ringGlowAlpha[modeKey]),
      );
    }
  } else {
    for (const token of NEUTRAL_TOKEN_NAMES) {
      style.removeProperty(`--neutral-${token}`);
    }
    style.removeProperty("--neutral-ring-glow");
  }
}

function applySurfaceOverrides(
  style: CSSStyleDeclaration,
  isDark: boolean,
  surfaceBase: string | undefined,
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

  const bounds = SURFACE_TINT_BOUNDS[isDark ? "dark" : "light"];
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const baseL = clamp(parsedSurface?.l ?? (isDark ? 0.3 : 0.8), bounds.minL, bounds.maxL);
  const baseC = clamp(parsedSurface?.c ?? 0, 0, bounds.maxC);
  // The shell sits a step below the surface it frames.
  const shellL = clamp(baseL - (isDark ? 0.03 : 0.02), isDark ? 0.1 : 0.82, bounds.maxL);
  style.setProperty("--shell-bg", formatOklch(shellL, baseC, parsedSurface?.h ?? 0));
}

function applyOverrides(target: HTMLElement, overrides: ThemeOverrides, mode: ThemeMode) {
  const style = target.style;
  const isDark = resolveIsDark(mode);
  const modeKey: ResolvedMode = isDark ? "dark" : "light";
  const modeOverrides = overrides[modeKey] ?? {};

  applyPaletteOverrides(style, modeOverrides.palette);
  applyNeutralOverrides(style, modeKey, modeOverrides.neutralHue, modeOverrides.neutralChroma);
  applySurfaceOverrides(style, isDark, modeOverrides.surfaceBase);
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

  return createStore<ThemeState>()((set, get) => {
    const initialMode = getStoredTheme(prefix);
    const initialOverrides = getStoredOverrides(prefix);

    if (target) {
      applyTheme(target, initialMode);
      applyOverrides(target, initialOverrides, initialMode);

      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", () => {
        const { mode, overrides } = get();
        applyTheme(target, mode);
        if (mode === "system") {
          applyOverrides(target, overrides, "system");
        }
      });
    }

    return {
      mode: initialMode,
      overrides: initialOverrides,
      importedPresets: getStoredPresets(prefix),
      presetId: getStoredPresetId(prefix),

      setMode: (mode) => {
        if (target) {
          applyTheme(target, mode);
          applyOverrides(target, get().overrides, mode);
        }
        set({ mode });
        persist(getStorageKey(prefix, "theme"), mode);
      },

      setOverrides: (overrides, presetId) => {
        if (target) {
          applyOverrides(target, overrides, get().mode);
        }
        set({ overrides, presetId: presetId ?? null });
        persist(getStorageKey(prefix, "theme-overrides"), JSON.stringify(overrides));
        persist(getStorageKey(prefix, "theme-preset"), presetId ?? null);
      },

      resetOverrides: () => {
        if (target) {
          clearAllOverrideStyles(target);
        }
        set({ overrides: {}, presetId: null });
        persist(getStorageKey(prefix, "theme-overrides"), null);
        persist(getStorageKey(prefix, "theme-preset"), null);
      },

      addImportedPreset: (preset) => {
        const importedPresets = [
          ...get().importedPresets.filter((p) => p.id !== preset.id),
          preset,
        ];
        set({ importedPresets });
        const persisted = persist(
          getStorageKey(prefix, "theme-presets"),
          JSON.stringify(importedPresets),
        );
        return { persisted };
      },
    };
  });
}
