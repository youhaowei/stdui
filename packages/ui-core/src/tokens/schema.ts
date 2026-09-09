type Modes<T> = { light: T; dark: T };
export type NeutralValue = { l: number; alpha?: number };
type TextStyle = { size: string; lineHeight?: number; fontWeight?: number; fontFamily?: string };
export interface TokenSchema {
  palette: Record<string, Modes<{ value: string; fg: string }>>;
  neutral: Record<string, Modes<NeutralValue>>;
  ringGlowAlpha: Modes<number>;
  /** Foreground used on top of an arbitrary override color: `dark` text on light colors, `light` on dark. */
  contrastFg: { onLight: string; onDark: string };
  surface: { base: Modes<string> };
  shell: { bg: Modes<string>; topbarHeight: string };
  typography: Record<string, TextStyle>;
  spacing: Record<string, string>;
  radius: { base: string; surface: string; inner: string; control: string };
  surfaceInset: string;
  innerGap: string;
  shadows: Record<"xs" | "sm" | "md" | "lg" | "inner", Modes<string>> & { surface: "md" };
  zIndex: Record<string, number>;
  chart: Record<1 | 2 | 3 | 4 | 5, Modes<string>>;
  utility: { scrollbar: Modes<string>; "code-bg": Modes<string> };
}

// Palette literals match the installed Tailwind theme; CSS is the migration authority.
export const tokens = {
  palette: {
    primary: {
      light: {
        value: "oklch(0.205 0 0)",
        fg: "oklch(0.985 0 0)",
      },
      dark: {
        value: "oklch(0.922 0 0)",
        fg: "oklch(0.205 0 0)",
      },
    },
    secondary: {
      light: {
        value: "oklch(0.446 0.043 257.281)",
        fg: "oklch(1 0 0)",
      },
      dark: {
        value: "oklch(0.704 0.04 256.788)",
        fg: "oklch(0.129 0.042 264.695)",
      },
    },
    success: {
      light: {
        value: "oklch(0.648 0.2 131.684)",
        fg: "oklch(1 0 0)",
      },
      dark: {
        value: "oklch(0.841 0.238 128.85)",
        fg: "oklch(0.274 0.072 132.109)",
      },
    },
    danger: {
      light: {
        value: "oklch(0.577 0.245 27.325)",
        fg: "oklch(1 0 0)",
      },
      dark: {
        value: "oklch(0.704 0.191 22.216)",
        fg: "oklch(1 0 0)",
      },
    },
    warning: {
      light: {
        value: "oklch(0.666 0.179 58.318)",
        fg: "oklch(1 0 0)",
      },
      dark: {
        value: "oklch(0.828 0.189 84.429)",
        fg: "oklch(0.279 0.077 45.635)",
      },
    },
    info: {
      light: {
        value: "oklch(0.588 0.158 241.966)",
        fg: "oklch(1 0 0)",
      },
      dark: {
        value: "oklch(0.746 0.16 232.661)",
        fg: "oklch(0.293 0.066 243.157)",
      },
    },
  },
  neutral: {
    fg: {
      light: { l: 0.145 },
      dark: { l: 0.985 },
    },
    "fg-subtle": {
      light: { l: 0.5 },
      dark: { l: 0.708 },
    },
    bg: {
      light: { l: 1.0 },
      dark: { l: 0.145 },
    },
    "bg-subtle": {
      light: { l: 0.98 },
      dark: { l: 0.18 },
    },
    "bg-muted": {
      light: { l: 0.96 },
      dark: { l: 0.23 },
    },
    "bg-emphasis": {
      light: { l: 0.94 },
      dark: { l: 0.27 },
    },
    "bg-bold": {
      light: { l: 0.92 },
      dark: { l: 0.31 },
    },
    "bg-strongest": {
      light: { l: 0.9 },
      dark: { l: 0.35 },
    },
    "bg-dim": {
      light: { l: 0.87 },
      dark: { l: 0.11 },
    },
    border: {
      light: { l: 0.922 },
      dark: { l: 1.0, alpha: 0.15 },
    },
    "border-subtle": {
      light: { l: 0.95 },
      dark: { l: 1.0, alpha: 0.08 },
    },
    ring: {
      light: { l: 0.708 },
      dark: { l: 0.556 },
    },
  },
  ringGlowAlpha: {
    light: 0.3,
    dark: 0.2,
  },
  contrastFg: {
    onLight: "oklch(0.205 0 0)",
    onDark: "oklch(0.985 0 0)",
  },
  surface: {
    base: {
      light: "oklch(0.95 0.006 70)",
      dark: "oklch(0.2 0.005 250)",
    },
  },
  shell: {
    bg: {
      light: "oklch(0.95 0.006 70)",
      dark: "oklch(0.18 0.005 250)",
    },
    topbarHeight: "40px",
  },
  typography: {
    display: {
      size: "24px",
      lineHeight: 1.2,
      fontWeight: 700,
    },
    heading: {
      size: "16px",
      lineHeight: 1.3,
      fontWeight: 600,
    },
    body: {
      size: "14px",
      lineHeight: 1.5,
      fontWeight: 400,
    },
    label: {
      size: "12px",
      lineHeight: 1.4,
      fontWeight: 400,
    },
    caption: {
      size: "10px",
      lineHeight: 1.3,
      fontWeight: 500,
    },
    code: {
      size: "12px",
      fontFamily: '"SF Mono", "Fira Code", ui-monospace, monospace',
    },
  },
  spacing: {
    "0": "0px",
    px: "1px",
    "0.5": "2px",
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "20px",
    "6": "24px",
    "8": "32px",
    "10": "40px",
    "12": "48px",
  },
  radius: {
    base: "0.625rem",
    surface: "10px",
    inner: "8px",
    control: "6px",
  },
  surfaceInset: "8px",
  innerGap: "4px",
  shadows: {
    xs: {
      light: "0 1px 2px oklch(0 0 0 / 4%)",
      dark: "0 1px 2px oklch(0 0 0 / 30%)",
    },
    sm: {
      light: "0 1px 3px oklch(0 0 0 / 6%), 0 1px 2px oklch(0 0 0 / 4%)",
      dark: "0 1px 3px oklch(0 0 0 / 35%), 0 1px 2px oklch(0 0 0 / 25%)",
    },
    md: {
      light:
        "0 0 0 1px oklch(0 0 0 / 3%), 0 1px 2px oklch(0 0 0 / 4%), 0 4px 8px oklch(0 0 0 / 3%), 0 8px 16px oklch(0 0 0 / 2%)",
      dark: "0 0 0 1px oklch(1 0 0 / 8%), 0 1px 2px oklch(0 0 0 / 30%), 0 3px 6px oklch(0 0 0 / 25%), 0 6px 12px oklch(0 0 0 / 20%)",
    },
    lg: {
      light:
        "0 0 0 1px oklch(0 0 0 / 3%), 0 4px 12px oklch(0 0 0 / 6%), 0 12px 24px oklch(0 0 0 / 4%)",
      dark: "0 0 0 1px oklch(1 0 0 / 8%), 0 4px 12px oklch(0 0 0 / 35%), 0 12px 24px oklch(0 0 0 / 25%)",
    },
    inner: {
      light:
        "0 0 0 1px oklch(0 0 0 / 4%), 0 1px 2px oklch(0 0 0 / 6%), 0 2px 4px oklch(0 0 0 / 3%)",
      dark: "0 0 0 1px oklch(1 0 0 / 12%), 0 1px 3px oklch(0 0 0 / 30%), 0 2px 6px oklch(0 0 0 / 22%)",
    },
    surface: "md",
  },
  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    popover: 400,
    toast: 500,
  },
  chart: {
    "1": {
      light: "oklch(0.646 0.222 41.116)",
      dark: "oklch(0.488 0.243 264.376)",
    },
    "2": {
      light: "oklch(0.6 0.118 184.704)",
      dark: "oklch(0.696 0.17 162.48)",
    },
    "3": {
      light: "oklch(0.398 0.07 227.392)",
      dark: "oklch(0.769 0.188 70.08)",
    },
    "4": {
      light: "oklch(0.828 0.189 84.429)",
      dark: "oklch(0.627 0.265 303.9)",
    },
    "5": {
      light: "oklch(0.769 0.188 70.08)",
      dark: "oklch(0.645 0.246 16.439)",
    },
  },
  utility: {
    scrollbar: {
      light: "oklch(0.5 0 0)",
      dark: "oklch(0.5 0 0)",
    },
    "code-bg": {
      light: "oklch(0.16 0 0)",
      dark: "oklch(0.1 0 0)",
    },
  },
} as const satisfies TokenSchema;

export type NeutralTokenName = keyof typeof tokens.neutral;
export type PaletteColor = keyof typeof tokens.palette;
export type RadiusName = keyof typeof tokens.radius;
export type TextStyleName = keyof typeof tokens.typography;
export type SpacingName = keyof typeof tokens.spacing;
export type ShadowName = keyof typeof tokens.shadows;
export type ZIndexName = keyof typeof tokens.zIndex;
export type ChartName = keyof typeof tokens.chart;
export type UtilityName = keyof typeof tokens.utility;
export type TokenName =
  | `palette-${PaletteColor}${"" | "-fg"}`
  | `neutral-${NeutralTokenName | "ring-glow"}`
  | "surface-base"
  | "shell-bg"
  | "topbar-height"
  | `text-${TextStyleName}`
  | `text-${Exclude<TextStyleName, "code">}--${"line-height" | "font-weight"}`
  | "font-code"
  | `space-${SpacingName}`
  | "spacing"
  | "radius"
  | `${Exclude<RadiusName, "base">}-radius`
  | `radius-${Exclude<RadiusName, "base">}`
  | "surface-inset"
  | "inner-gap"
  | `shadow-${Exclude<ShadowName, "inner">}`
  | "inner-shadow"
  | "surface-shadow"
  | `z-${ZIndexName}`
  | `chart-${ChartName}`
  | UtilityName;

/** Reference a known custom property without the leading --. */
export function cssVar<N extends TokenName>(name: N): `var(--${string})` {
  return `var(--${name.replaceAll(".", "\\.")})`;
}
