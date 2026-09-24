/**
 * Theme import and export.
 *
 * Accepts a base16 / tinted-theming scheme (YAML or JSON), a VS Code colour
 * theme (JSON with comments), or a string produced by `exportPreset`. Every
 * input becomes a `ThemePreset` whose colours are clamped so the app still
 * looks like itself: imported greys contribute only hue and chroma, the
 * lightness ramp stays ours, the surface tint stays inside
 * `SURFACE_TINT_BOUNDS`, and the accent is shifted until it passes WCAG AA.
 * Syntax colours, fonts, alpha, and gradients are ignored.
 */

import { tokens } from "../tokens/schema";
import { contrastRatio, formatOklch, hexToOklch, isInSrgbGamut, parseOklch } from "./oklch";
import {
  NEUTRAL_CHROMA_MAX,
  SURFACE_TINT_BOUNDS,
  contrastFg,
  type ModeOverrides,
  type PaletteColor,
  type ResolvedMode,
  type ThemeAdjustment,
  type ThemeOverrides,
  type ThemePreset,
} from "./tokens";

type Oklch = { l: number; c: number; h: number };
type StatusColor = "danger" | "warning" | "success" | "info";

export type ThemeImportResult = { ok: true; preset: ThemePreset } | { ok: false; error: string };

/** Prefix of the portable string `exportPreset` writes. */
export const THEME_EXPORT_PREFIX = "wystack-theme-v1:";

const MODES: readonly ResolvedMode[] = ["light", "dark"];
const STATUS_COLORS: readonly StatusColor[] = ["danger", "warning", "success", "info"];
/** A status colour is taken only when its hue is this close to ours. */
const STATUS_HUE_TOLERANCE = 30;
const AA = 4.5;
const MAX_NAME_LENGTH = 40;
const UNRECOGNISED = "Not a base16 scheme, VS Code theme, or copied theme.";
const DAMAGED = "This copied theme is incomplete or damaged.";

// -- Public API -------------------------------------------------------------

/** Parse pasted theme text into a clamped, named preset. */
export function importTheme(text: string): ThemeImportResult {
  const trimmed = text.trim();
  if (!trimmed) return fail("Paste a theme to import.");
  try {
    if (trimmed.startsWith(THEME_EXPORT_PREFIX)) return fromExport(trimmed);
    const json = parseJsonc(trimmed);
    if (json !== undefined) {
      if (!isRecord(json)) return fail(UNRECOGNISED);
      if (isRecord(json.colors)) return fromVsCode(json);
      return fromBase16(json);
    }
    const yaml = parseSimpleYaml(trimmed);
    if (yaml) return fromBase16(yaml);
    return fail(UNRECOGNISED);
  } catch (e) {
    return fail(e instanceof ImportError ? e.message : UNRECOGNISED);
  }
}

/** Serialise a preset to a short string that `importTheme` reads back. */
export function exportPreset(preset: ThemePreset) {
  const json = JSON.stringify({
    name: preset.name,
    light: preset.overrides.light ?? {},
    dark: preset.overrides.dark ?? {},
  });
  return THEME_EXPORT_PREFIX + toBase64Url(json);
}

/** User-facing sentence for an import's adjustments, or undefined when none. */
export function describeAdjustments(adjustments: readonly ThemeAdjustment[] | undefined) {
  if (!adjustments || adjustments.length === 0) return undefined;
  const parts: string[] = [];
  if (adjustments.includes("contrast")) parts.push("Adjusted for contrast");
  if (adjustments.includes("softened")) parts.push("Colours softened to fit");
  return parts.join(". ");
}

/**
 * Rebuild persisted imported presets. Stored values pass through the same
 * clamp as a fresh import, so edited storage cannot escape the bounds.
 */
export function readImportedPresets(value: unknown): ThemePreset[] {
  if (!Array.isArray(value)) return [];
  const out: ThemePreset[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item.name !== "string" || !isRecord(item.overrides)) continue;
    const { overrides, adjustments } = clampOverrides(item.overrides);
    const kinds = new Set<ThemeAdjustment>(adjustments);
    if (Array.isArray(item.adjustments)) {
      for (const k of item.adjustments) if (k === "contrast" || k === "softened") kinds.add(k);
    }
    out.push(importedPreset(cleanName(item.name), overrides, [...kinds].sort()));
  }
  return out;
}

/**
 * Clamp one mode's overrides into the ranges the app supports, reporting what
 * had to change. Values already in range come back unchanged.
 */
export function clampModeOverrides(mode: ResolvedMode, input: unknown) {
  const adjustments = new Set<ThemeAdjustment>();
  const out: ModeOverrides = {};
  if (!isRecord(input)) return { overrides: out, adjustments };

  if (isFiniteNumber(input.neutralHue)) out.neutralHue = round(mod360(input.neutralHue), 1);
  if (isFiniteNumber(input.neutralChroma)) {
    const c = clamp(input.neutralChroma, 0, NEUTRAL_CHROMA_MAX);
    if (c !== input.neutralChroma) adjustments.add("softened");
    out.neutralChroma = round(c, 4);
  }

  const surface = tryParseOklch(input.surfaceBase);
  if (surface) {
    const bounds = SURFACE_TINT_BOUNDS[mode];
    const l = clamp(surface.l, bounds.minL, bounds.maxL);
    const c = clamp(surface.c, 0, bounds.maxC);
    if (l !== surface.l || c !== surface.c) adjustments.add("softened");
    out.surfaceBase = formatOklch(l, c, surface.h);
  }

  if (isRecord(input.palette)) {
    const palette: Partial<Record<PaletteColor, string>> = {};
    const primary = tryParseOklch(input.palette.primary);
    if (primary) {
      const fixed = fixAccent(mode, primary, out.neutralHue ?? 0, out.neutralChroma ?? 0);
      if (fixed.adjusted) adjustments.add("contrast");
      if (fixed.softened) adjustments.add("softened");
      palette.primary = fixed.value;
    }
    for (const name of STATUS_COLORS) {
      const color = tryParseOklch(input.palette[name]);
      const fitted = color && fitStatus(mode, name, color);
      if (!fitted) continue;
      if (fitted.softened) adjustments.add("softened");
      palette[name] = fitted.value;
    }
    if (Object.keys(palette).length > 0) out.palette = palette;
  }

  return { overrides: out, adjustments };
}

// -- Formats ------------------------------------------------------------------

class ImportError extends Error {}

function fail(error: string): ThemeImportResult {
  return { ok: false, error };
}

function fromExport(text: string): ThemeImportResult {
  let data: unknown;
  try {
    data = JSON.parse(fromBase64Url(text.slice(THEME_EXPORT_PREFIX.length).trim()));
  } catch {
    return fail(DAMAGED);
  }
  // Both modes are always written, even when empty (Default); a missing one means damage.
  if (!isRecord(data) || typeof data.name !== "string") return fail(DAMAGED);
  if (!isRecord(data.light) || !isRecord(data.dark)) return fail(DAMAGED);
  const { overrides, adjustments } = clampOverrides({ light: data.light, dark: data.dark });
  return { ok: true, preset: importedPreset(cleanName(data.name), overrides, adjustments) };
}

interface ThemeSource {
  name: string;
  variant: ResolvedMode;
  surface?: Oklch;
  greys: Oklch[];
  primary?: Oklch;
  status: Partial<Record<StatusColor, Oklch>>;
}

const BASE16_SLOTS: readonly string[] = Array.from(
  { length: 16 },
  (_, i) => `base0${i.toString(16)}`,
);

function fromBase16(data: Record<string, unknown>): ThemeImportResult {
  const palette = isRecord(data.palette) ? data.palette : data;
  const colors: Record<string, Oklch> = {};
  for (const [key, value] of Object.entries(palette)) {
    const slot = key.toLowerCase();
    if (!BASE16_SLOTS.includes(slot)) continue;
    const color = parseHex(value, true);
    if (!color) return fail(`${key} is not a hex colour.`);
    colors[slot] = color;
  }
  const missing = BASE16_SLOTS.filter((slot) => !colors[slot]);
  if (missing.length === BASE16_SLOTS.length) return fail(UNRECOGNISED);
  if (missing.length > 0) {
    const names = missing.map((slot) => `base0${slot.slice(5).toUpperCase()}`);
    return fail(`This base16 scheme is missing ${names.join(", ")}.`);
  }

  const bg = colors.base00!;
  const variant = data.variant === "light" || data.variant === "dark" ? data.variant : guess(bg);
  const name = typeof data.name === "string" ? data.name : data.scheme;
  return fromSource({
    name: typeof name === "string" ? name : "Imported theme",
    variant,
    surface: bg,
    greys: ["base01", "base02", "base03", "base04", "base05", "base06"].map((s) => colors[s]!),
    primary: colors.base0d,
    status: {
      danger: colors.base08,
      warning: colors.base0a,
      success: colors.base0b,
      info: colors.base0c,
    },
  });
}

function fromVsCode(data: Record<string, unknown>): ThemeImportResult {
  const colors = data.colors as Record<string, unknown>;
  const pick = (...keys: string[]) => {
    for (const key of keys) {
      const color = parseHex(colors[key], false);
      if (color) return color;
    }
    return undefined;
  };
  const editorBg = pick("editor.background");
  if (!editorBg) return fail("This VS Code theme has no editor.background colour.");
  const type = typeof data.type === "string" ? data.type.toLowerCase() : "";
  let variant = guess(editorBg);
  if (type === "dark" || type === "hc" || type === "hcdark") variant = "dark";
  if (type === "light" || type === "hclight") variant = "light";
  const greys = [editorBg, pick("editor.foreground", "foreground"), pick("panel.border")].filter(
    (c): c is Oklch => c != null,
  );
  return fromSource({
    name: typeof data.name === "string" ? data.name : "Imported theme",
    variant,
    surface: pick("sideBar.background", "editor.background"),
    greys,
    primary: pick("focusBorder", "button.background", "textLink.foreground"),
    status: {
      danger: pick("errorForeground", "editorError.foreground"),
      warning: pick("editorWarning.foreground"),
      success: pick("terminal.ansiGreen", "gitDecoration.addedResourceForeground"),
      info: pick("editorInfo.foreground"),
    },
  });
}

/**
 * Map a parsed source onto both modes, so the preset holds up when the
 * system switches. The source's own mode keeps its surface lightness
 * (clamped); the other mode uses our default surface lightness. Hue and
 * chroma carry across, and each mode's accent is fixed for contrast on its
 * own ground.
 */
function fromSource(src: ThemeSource): ThemeImportResult {
  const neutral = meanHueChroma(src.greys);
  const raw: Record<string, unknown> = {};
  for (const mode of MODES) {
    const palette: Record<string, string> = {};
    if (src.primary) palette.primary = formatOklch(src.primary.l, src.primary.c, src.primary.h);
    for (const name of STATUS_COLORS) {
      const color = src.status[name];
      if (color) palette[name] = formatOklch(color.l, color.c, color.h);
    }
    const surfaceL =
      mode === src.variant ? src.surface?.l : parseOklch(tokens.surface.base[mode]).l;
    raw[mode] = {
      neutralHue: neutral.h,
      neutralChroma: neutral.c,
      surfaceBase: src.surface && formatOklch(surfaceL!, src.surface.c, src.surface.h),
      palette,
    };
  }
  const { overrides, adjustments } = clampOverrides(raw);
  return { ok: true, preset: importedPreset(cleanName(src.name), overrides, adjustments) };
}

// -- Clamping ---------------------------------------------------------------

function clampOverrides(input: Record<string, unknown>) {
  const overrides: ThemeOverrides = {};
  const adjustments = new Set<ThemeAdjustment>();
  for (const mode of MODES) {
    const result = clampModeOverrides(mode, input[mode]);
    if (Object.keys(result.overrides).length > 0) overrides[mode] = result.overrides;
    for (const a of result.adjustments) adjustments.add(a);
  }
  return { overrides, adjustments: [...adjustments].sort() };
}

/**
 * Shift the accent's lightness away from the page until it reaches AA both
 * as text on the page background and behind its own text colour.
 */
function fixAccent(mode: ResolvedMode, color: Oklch, neutralHue: number, neutralChroma: number) {
  const ground = formatOklch(tokens.neutral.bg[mode].l, neutralChroma, neutralHue);
  const step = mode === "dark" ? 0.01 : -0.01;
  const passes = (value: string) =>
    contrastRatio(value, ground) >= AA && contrastRatio(value, contrastFg(value)) >= AA;

  let l = color.l;
  let c = fitChroma(l, color.c, color.h);
  let value = formatOklch(l, c, color.h);
  let steps = 0;
  while (steps < 100 && !passes(value)) {
    steps++;
    l = clamp(l + step, 0, 1);
    c = fitChroma(l, color.c, color.h);
    value = formatOklch(l, c, color.h);
  }
  return { value, adjusted: steps > 0, softened: c < round(color.c, 4) };
}

/** Our lightness and at most our chroma, at the imported hue when it is close to ours. */
function fitStatus(mode: ResolvedMode, name: StatusColor, color: Oklch) {
  const ours = parseOklch(tokens.palette[name][mode].value);
  if (hueDistance(color.h, ours.h) > STATUS_HUE_TOLERANCE) return undefined;
  const c = fitChroma(ours.l, Math.min(color.c, ours.c), color.h);
  return { value: formatOklch(ours.l, c, color.h), softened: c < round(color.c, 4) };
}

/**
 * The highest chroma up to `c` that stays inside sRGB at this lightness and
 * hue. Works at the precision `formatOklch` writes (L and C to 4 places, H to
 * 2), so reading a fitted colour back and fitting it again changes nothing.
 */
function fitChroma(l: number, c: number, h: number) {
  const L = round(l, 4);
  const H = round(h, 2);
  let fitted = round(c, 4);
  if (isInSrgbGamut(L, fitted, H)) return fitted;
  let lo = 0;
  let hi = fitted;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (isInSrgbGamut(L, mid, H)) lo = mid;
    else hi = mid;
  }
  fitted = Math.floor(lo * 1e4) / 1e4;
  while (fitted > 0 && !isInSrgbGamut(L, fitted, H)) fitted = round(fitted - 1e-4, 4);
  return fitted;
}

/** Chroma-weighted circular mean hue and plain mean chroma. */
function meanHueChroma(colors: Oklch[]) {
  if (colors.length === 0) return { h: 0, c: 0 };
  let x = 0;
  let y = 0;
  let c = 0;
  for (const color of colors) {
    const rad = (color.h * Math.PI) / 180;
    x += color.c * Math.cos(rad);
    y += color.c * Math.sin(rad);
    c += color.c;
  }
  const h = (Math.atan2(y, x) * 180) / Math.PI;
  return { h: round(mod360(h), 1), c: round(c / colors.length, 4) };
}

// -- Parsing helpers --------------------------------------------------------

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** An opaque hex colour as OKLCH. Translucent colours are skipped: alpha is ignored. */
function parseHex(value: unknown, allowBare: boolean): Oklch | undefined {
  if (typeof value !== "string") return undefined;
  const text = value.trim();
  const match = text.match(HEX);
  if (!match?.[1] || (!allowBare && !text.startsWith("#"))) return undefined;
  let hex = match[1];
  if (hex.length <= 4) hex = [...hex].map((ch) => ch + ch).join("");
  if (hex.length === 8) {
    if (hex.slice(6).toLowerCase() !== "ff") return undefined;
    hex = hex.slice(0, 6);
  }
  const { l, c, h } = hexToOklch(`#${hex}`);
  return c < 1e-4 ? { l, c: 0, h: 0 } : { l, c, h };
}

function tryParseOklch(value: unknown): Oklch | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const { l, c, h } = parseOklch(value);
    if (![l, c, h].every(Number.isFinite)) return undefined;
    return { l: clamp(l, 0, 1), c: Math.max(0, c), h: mod360(h) };
  } catch {
    return undefined;
  }
}

/** JSON with `//` and block comments and trailing commas, as VS Code writes it. */
function parseJsonc(text: string): unknown {
  const body = stripTrailingCommas(stripComments(text)).trim();
  if (!body.startsWith("{") && !body.startsWith("[")) return undefined;
  try {
    return JSON.parse(body);
  } catch {
    throw new ImportError("This looks like JSON but could not be read.");
  }
}

/** Walks `text`, calling `visit` for each character outside a string literal. */
function scanOutsideStrings(text: string, visit: (i: number) => number | void) {
  let out = "";
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (inString) {
      out += ch;
      if (ch === "\\") out += text[++i] ?? "";
      else if (ch === '"') inString = false;
      continue;
    }
    const skipTo = visit(i);
    if (skipTo !== undefined) {
      i = skipTo;
      continue;
    }
    if (ch === '"') inString = true;
    out += ch;
  }
  return out;
}

function stripComments(text: string) {
  return scanOutsideStrings(text, (i) => {
    if (text[i] === "/" && text[i + 1] === "/") {
      const end = text.indexOf("\n", i);
      return (end === -1 ? text.length : end) - 1;
    }
    if (text[i] === "/" && text[i + 1] === "*") {
      const end = text.indexOf("*/", i + 2);
      return end === -1 ? text.length : end + 1;
    }
    return undefined;
  });
}

function stripTrailingCommas(text: string) {
  return scanOutsideStrings(text, (i) => {
    if (text[i] !== ",") return undefined;
    const next = text.slice(i + 1).match(/\S/)?.[0];
    return next === "}" || next === "]" ? i : undefined;
  });
}

/**
 * The subset of YAML base16 schemes use: `key: value` lines, one level of
 * nesting (`palette:`), quoted or bare values, and `#` comments.
 */
function parseSimpleYaml(text: string): Record<string, unknown> | undefined {
  const root: Record<string, unknown> = {};
  let section: Record<string, unknown> | undefined;
  let matched = 0;
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    // Skip blanks, comments, and YAML document markers (`---`, `...`).
    if (!trimmed || trimmed.startsWith("#") || /^(---|\.\.\.)(\s|$)/.test(trimmed)) continue;
    const m = line.match(/^(\s*)([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!m) return undefined;
    matched++;
    const [, indent = "", key = "", rawValue = ""] = m;
    const value = yamlScalar(rawValue);
    if (indent.length > 0) {
      if (section) section[key] = value;
    } else if (value === "") {
      section = {};
      root[key] = section;
    } else {
      section = undefined;
      root[key] = value;
    }
  }
  return matched > 0 ? root : undefined;
}

function yamlScalar(raw: string) {
  const text = raw.trim();
  const quote = text[0];
  if (quote === '"' || quote === "'") {
    const end = text.indexOf(quote, 1);
    return end === -1 ? text.slice(1) : text.slice(1, end);
  }
  // A bare `#abc123` is a colour here, not a comment.
  const first = text.split(/\s/)[0] ?? "";
  if (HEX.test(first)) return first;
  return text.replace(/\s+#.*$/, "").trim();
}

// -- Small helpers ----------------------------------------------------------

function importedPreset(
  name: string,
  overrides: ThemeOverrides,
  adjustments: ThemeAdjustment[],
): ThemePreset {
  const id = `imported:${slug(name)}-${hash(name)}`;
  const preset: ThemePreset = { id, name, overrides, imported: true };
  if (adjustments.length > 0) preset.adjustments = adjustments;
  return preset;
}

function cleanName(name: string) {
  const cleaned = name.replace(/\s+/g, " ").trim().slice(0, MAX_NAME_LENGTH).trim();
  return cleaned || "Imported theme";
}

function slug(name: string) {
  const s = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return s || "theme";
}

/** Short FNV-1a hash, so names that slug alike ("A+B", "A B") keep distinct ids. */
function hash(text: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36).slice(0, 6);
}

function guess(bg: Oklch): ResolvedMode {
  return bg.l < 0.5 ? "dark" : "light";
}

function hueDistance(a: number, b: number) {
  const d = Math.abs(mod360(a) - mod360(b));
  return Math.min(d, 360 - d);
}

function mod360(h: number) {
  return ((h % 360) + 360) % 360;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function round(v: number, decimals: number) {
  const f = 10 ** decimals;
  return Math.round(v * f) / f;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toBase64Url(text: string) {
  let binary = "";
  for (const b of new TextEncoder().encode(text)) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text: string) {
  const b64 = text.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(binary, (ch) => ch.charCodeAt(0)));
}
