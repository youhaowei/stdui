import { afterEach, describe, expect, it, vi } from "vitest";
import { THEME_PRESETS, selectedPreset } from "./presets";
import { createThemeStore } from "./store";
import { exportPreset, importTheme } from "./theme-import";
import type { ThemePreset } from "./tokens";

function importOf(name: string, from: ThemePreset): ThemePreset {
  const result = importTheme(exportPreset({ ...from, name }));
  if (!result.ok) throw new Error(result.error);
  return result.preset;
}

const slate = THEME_PRESETS.find((p) => p.id === "slate")!;

describe("theme store", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("keeps imported presets whose names slug alike side by side", () => {
    const store = createThemeStore({ storageKey: "t1" });
    store.getState().addImportedPreset(importOf("A+B", slate));
    store.getState().addImportedPreset(importOf("A B", slate));
    expect(store.getState().importedPresets.map((p) => p.name)).toEqual(["A+B", "A B"]);
  });

  it("updates state and reports it when storage writes fail", () => {
    const throwing = {
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
      removeItem: () => {},
    };
    vi.stubGlobal("localStorage", throwing);
    const store = createThemeStore({ storageKey: "t2" });
    const preset = importOf("Mine", slate);

    expect(store.getState().addImportedPreset(preset)).toEqual({ persisted: false });
    store.getState().setOverrides(preset.overrides, preset.id);

    expect(store.getState().importedPresets).toEqual([preset]);
    expect(store.getState().presetId).toBe(preset.id);
  });
});

describe("selectedPreset", () => {
  const copy = importOf("Slate copy", slate);
  const presets = [...THEME_PRESETS, copy];

  it("selects the applied preset by id when a built-in has the same colours", () => {
    expect(selectedPreset(slate.overrides, copy.id, presets)?.id).toBe(copy.id);
    expect(selectedPreset(slate.overrides, "slate", presets)?.id).toBe("slate");
  });

  it("falls back to matching colours when no id is stored or the id is stale", () => {
    expect(selectedPreset(slate.overrides, null, presets)?.id).toBe("slate");
    expect(selectedPreset({}, copy.id, presets)?.id).toBe("default");
    expect(selectedPreset({ light: { neutralHue: 1 } }, null, presets)).toBeUndefined();
  });
});
