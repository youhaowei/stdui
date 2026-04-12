/**
 * ThemePanel - Right-side panel for live theme customization.
 *
 * Mode-aware: System shows Light+Dark tabs, Light/Dark shows just that mode.
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  CloseIcon,
  ResetIcon,
  LightModeIcon,
  DarkModeIcon,
  SystemModeIcon,
  ChevronRightIcon,
} from "@stdui/icons";
import { Button } from "../primitives/button";
import { Surface } from "../primitives/surface";
import { useTheme } from "../theme/provider";
import { hasModeOverrides } from "../theme/store";
import type {
  ThemeMode,
  PaletteColor,
  ModeOverrides,
  ResolvedMode,
  SurfaceTintStyle,
  ThemeOverrides,
} from "../theme/tokens";
import { ColorPicker } from "./color-picker";
import { NeutralPicker } from "./neutral-picker";
import {
  DEFAULT_PALETTE_LIGHT,
  DEFAULT_PALETTE_DARK,
  DEFAULT_SURFACE_LIGHT,
  DEFAULT_SURFACE_DARK,
  PREVIEW_LEVELS_LIGHT,
  PREVIEW_LEVELS_DARK,
} from "./theme-defaults";

// ── Constants ────────────────────────────────────────────────────────────────

const PALETTE_ENTRIES: { key: PaletteColor; label: string }[] = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "success", label: "Success" },
  { key: "danger", label: "Danger" },
  { key: "warning", label: "Warning" },
  { key: "info", label: "Info" },
];

const MODE_OPTIONS: { value: ThemeMode; icon: typeof LightModeIcon; label: string }[] = [
  { value: "system", icon: SystemModeIcon, label: "System" },
  { value: "light", icon: LightModeIcon, label: "Light" },
  { value: "dark", icon: DarkModeIcon, label: "Dark" },
];

const SURFACE_TINT_STYLES: { value: SurfaceTintStyle; label: string }[] = [
  { value: "solid", label: "Solid" },
  { value: "gradient2", label: "2-Stop" },
  { value: "gradient3", label: "3-Stop" },
];
const SURFACE_TINT_STYLE_ORDER: SurfaceTintStyle[] = ["solid", "gradient2", "gradient3"];

// ── Component ────────────────────────────────────────────────────────────────

export interface ThemePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemePanel({ isOpen, onClose }: ThemePanelProps) {
  const { mode, overrides, setMode, setOverrides, resetOverrides, setPreviewMode } = useTheme();

  // For system mode, which variant tab is active
  const [activeVariantTab, setActiveVariantTab] = useState<ResolvedMode>(() => {
    if (mode === "dark") return "dark";
    if (mode === "light") return "light";
    return typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Preview mode: temporarily show the selected variant when in system mode
  const handleVariantTab = useCallback(
    (v: ResolvedMode) => {
      setActiveVariantTab(v);
      setPreviewMode(v);
    },
    [setPreviewMode],
  );

  // Clear preview mode when panel closes
  useEffect(() => {
    if (!isOpen) setPreviewMode(null);
  }, [isOpen, setPreviewMode]);

  // Clear preview when leaving system mode
  useEffect(() => {
    if (mode !== "system") setPreviewMode(null);
  }, [mode, setPreviewMode]);

  const hasAnyOverrides = hasModeOverrides(overrides.light) || hasModeOverrides(overrides.dark);

  // Which modes to show controls for
  const visibleModes: ResolvedMode[] =
    mode === "system" ? ["light", "dark"] : [mode as ResolvedMode];

  if (!isOpen) return null;

  return (
    <Surface
      elevation="raised"
      className="flex-shrink-0 flex flex-col select-none w-72 animate-[panel-in_200ms_ease-out]"
    >
      {/* Header */}
      <div className="flex items-center h-10 px-3 gap-2 shrink-0">
        <h2 className="text-sm font-semibold text-neutral-fg flex-1 select-none">Appearance</h2>
        {hasAnyOverrides && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 text-neutral-fg-subtle hover:text-neutral-fg"
            onClick={resetOverrides}
            aria-label="Reset to defaults"
          >
            <ResetIcon className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-neutral-fg-subtle hover:text-neutral-fg"
          onClick={onClose}
          aria-label="Close theme panel"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0 text-sm">
        <div className="p-3 space-y-4">
          {/* ── Theme Mode ────────────────────────────── */}
          <div>
            <SectionLabel>Theme</SectionLabel>
            <div className="flex gap-1 mt-1">
              {MODE_OPTIONS.map(({ value, icon: Icon, label }) => (
                <Button
                  key={value}
                  variant={mode === value ? "solid" : "outline"}
                  color={mode === value ? "primary" : "secondary"}
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => setMode(value)}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* ── Variant tabs (system mode only) ───────── */}
          {mode === "system" && (
            <>
              <div className="flex gap-1">
                {(["light", "dark"] as ResolvedMode[]).map((v) => {
                  const Icon = v === "light" ? LightModeIcon : DarkModeIcon;
                  return (
                    <Button
                      key={v}
                      variant={activeVariantTab === v ? "soft" : "ghost"}
                      color="secondary"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => handleVariantTab(v)}
                    >
                      <Icon className="h-3 w-3" />
                      {v === "light" ? "Light" : "Dark"}
                    </Button>
                  );
                })}
              </div>
              <ModeControls
                modeKey={activeVariantTab}
                overrides={overrides}
                setOverrides={setOverrides}
              />
            </>
          )}

          {/* ── Single mode controls ──────────────────── */}
          {mode !== "system" &&
            visibleModes.map((modeKey) => (
              <ModeControls
                key={modeKey}
                modeKey={modeKey}
                overrides={overrides}
                setOverrides={setOverrides}
              />
            ))}
        </div>
      </div>
    </Surface>
  );
}

// ── ModeControls — the color settings for a single light/dark mode ───────────

function ModeControls({
  modeKey,
  overrides,
  setOverrides,
}: {
  modeKey: ResolvedMode;
  overrides: ThemeOverrides;
  setOverrides: (o: ThemeOverrides) => void;
}) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const modeOverrides = overrides[modeKey] ?? {};
  const defaultPalette = modeKey === "light" ? DEFAULT_PALETTE_LIGHT : DEFAULT_PALETTE_DARK;
  const defaultSurface = modeKey === "light" ? DEFAULT_SURFACE_LIGHT : DEFAULT_SURFACE_DARK;
  const previewLevels = modeKey === "light" ? PREVIEW_LEVELS_LIGHT : PREVIEW_LEVELS_DARK;
  const surfaceTintStyle = modeOverrides.surfaceTintStyle ?? "solid";
  const surfaceTintBounds =
    modeKey === "dark"
      ? { maxChroma: 0.07, hueStripChroma: 0.06, minLightness: 0.16, maxLightness: 0.42 }
      : { maxChroma: 0.04, hueStripChroma: 0.03, minLightness: 0.88, maxLightness: 0.96 };
  const surfaceTintPreviewBackground = "var(--shell-bg)";

  const neutralHue = modeOverrides.neutralHue ?? 0;
  const neutralChroma = modeOverrides.neutralChroma ?? 0;

  // Only colors the user has actually customized (overrides only, not defaults)
  const usedColors = useMemo(() => {
    const result: { light: string[]; dark: string[] } = { light: [], dark: [] };
    for (const m of ["light", "dark"] as const) {
      const mo = overrides[m] ?? {};
      if (mo.palette) {
        for (const v of Object.values(mo.palette)) {
          if (v) result[m].push(v);
        }
      }
      if (mo.surfaceBase) result[m].push(mo.surfaceBase);
    }
    return result;
  }, [overrides]);

  const updateModeOverride = useCallback(
    (patch: Partial<ModeOverrides>) => {
      const currentMode = overrides[modeKey] ?? {};
      setOverrides({ ...overrides, [modeKey]: { ...currentMode, ...patch } });
    },
    [modeKey, overrides, setOverrides],
  );

  const updatePalette = useCallback(
    (color: PaletteColor, value: string) => {
      const currentMode = overrides[modeKey] ?? {};
      setOverrides({
        ...overrides,
        [modeKey]: { ...currentMode, palette: { ...currentMode.palette, [color]: value } },
      });
    },
    [modeKey, overrides, setOverrides],
  );

  const toggleSection = useCallback((section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  }, []);
  const cycleSurfaceTintStyle = useCallback(() => {
    const currentIndex = SURFACE_TINT_STYLE_ORDER.indexOf(surfaceTintStyle);
    const next = SURFACE_TINT_STYLE_ORDER[(currentIndex + 1) % SURFACE_TINT_STYLE_ORDER.length];
    updateModeOverride({ surfaceTintStyle: next });
  }, [surfaceTintStyle, updateModeOverride]);

  return (
    <div className="space-y-4">
      {/* ── Accent Colors ─────────────────────────── */}
      <CollapsibleSection
        label="Accent Colors"
        expanded={expandedSection === "palette"}
        onToggle={() => toggleSection("palette")}
      >
        <div className="space-y-2">
          {PALETTE_ENTRIES.map(({ key, label }) => (
            <ColorPicker
              key={key}
              label={label}
              value={modeOverrides.palette?.[key] ?? defaultPalette[key]}
              onChange={(v) => updatePalette(key, v)}
              usedColors={usedColors}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* ── Neutral Tones ─────────────────────────── */}
      <CollapsibleSection
        label="Neutral Tones"
        expanded={expandedSection === "neutrals"}
        onToggle={() => toggleSection("neutrals")}
      >
        <NeutralPicker
          hue={neutralHue}
          chroma={neutralChroma}
          onHueChange={(v) => updateModeOverride({ neutralHue: v })}
          onChromaChange={(v) => updateModeOverride({ neutralChroma: v })}
          onBatchChange={(h, c) => updateModeOverride({ neutralHue: h, neutralChroma: c })}
          previewLevels={previewLevels}
          isDark={modeKey === "dark"}
        />
      </CollapsibleSection>

      {/* ── Surface Tint ──────────────────────────── */}
      <div>
        <SectionLabel>Surface Tint</SectionLabel>
        <div className="mt-1">
          <ColorPicker
            value={modeOverrides.surfaceBase ?? defaultSurface}
            onChange={(v) => updateModeOverride({ surfaceBase: v })}
            previewBackground={surfaceTintPreviewBackground}
            onPreviewClick={cycleSurfaceTintStyle}
            maxChroma={surfaceTintBounds.maxChroma}
            hueStripChroma={surfaceTintBounds.hueStripChroma}
            minLightness={surfaceTintBounds.minLightness}
            maxLightness={surfaceTintBounds.maxLightness}
            showUsedColors={false}
            showRecentColors={false}
            showHexValue={false}
            usedColors={usedColors}
          />
        </div>
        <div className="mt-2 flex gap-1">
          {SURFACE_TINT_STYLES.map(({ value, label }) => (
            <Button
              key={value}
              variant={surfaceTintStyle === value ? "soft" : "outline"}
              color={surfaceTintStyle === value ? "primary" : "secondary"}
              size="sm"
              className="flex-1"
              onClick={() => updateModeOverride({ surfaceTintStyle: value })}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium text-neutral-fg-subtle">{children}</label>;
}

function CollapsibleSection({
  label,
  expanded,
  onToggle,
  children,
}: {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1.5 w-full py-1 text-xs font-medium text-neutral-fg-subtle cursor-pointer hover:text-neutral-fg transition-colors"
      >
        <ChevronRightIcon
          className={`h-3 w-3 transition-transform duration-150 ${expanded ? "rotate-90" : ""}`}
        />
        {label}
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-1 pb-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
