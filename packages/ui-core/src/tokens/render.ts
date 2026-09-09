import { tokens, cssVar, type NeutralValue } from "./schema";

type Mode = "light" | "dark";
const entries = Object.entries;
const declaration = (name: string, value: string | number) => `  --${name}: ${value};`;
const block = (selector: string, lines: string[]) => `${selector} {\n${lines.join("\n")}\n}`;
const neutralColor = ({ l, alpha }: NeutralValue) =>
  `oklch(${l} 0 0${alpha === undefined ? "" : ` / ${alpha * 100}%`})`;

function themeBridge() {
  const colors = [
    ...entries(tokens.palette).flatMap(([name]) => [`palette-${name}`, `palette-${name}-fg`]),
    ...entries(tokens.neutral).map(([name]) => `neutral-${name}`),
    "neutral-ring-glow",
    "surface-base",
    "shell-bg",
    ...Object.keys(tokens.utility),
    ...Object.keys(tokens.chart).map((name) => `chart-${name}`),
  ];
  return block("@theme inline", [
    declaration("color-*", "initial"),
    ...colors.map((name) => declaration(`color-${name}`, `var(--${name})`)),
    declaration("color-white", "#fff"),
    declaration("color-black", "#000"),
    declaration("spacing", cssVar("space-1")),
    declaration("radius", cssVar("radius")),
    ...(["surface", "inner", "control"] as const).map((name) =>
      declaration(`radius-${name}`, cssVar(`${name}-radius`)),
    ),
    declaration("shadow-surface", cssVar(`shadow-${tokens.shadows.surface}`)),
    ...entries(tokens.typography).flatMap(([name, style]) => [
      declaration(`text-${name}`, style.size),
      ...("lineHeight" in style
        ? [declaration(`text-${name}--line-height`, style.lineHeight)]
        : []),
      ...("fontWeight" in style
        ? [declaration(`text-${name}--font-weight`, style.fontWeight)]
        : []),
      ...("fontFamily" in style ? [declaration(`font-${name}`, style.fontFamily)] : []),
    ]),
  ]);
}

function modeBlock(mode: Mode) {
  return block(mode === "light" ? ":root" : ".dark", [
    ...entries(tokens.palette).flatMap(([name, values]) => [
      declaration(`palette-${name}`, values[mode].value),
      declaration(`palette-${name}-fg`, values[mode].fg),
    ]),
    ...entries(tokens.neutral).map(([name, values]) =>
      declaration(`neutral-${name}`, neutralColor(values[mode])),
    ),
    declaration(
      "neutral-ring-glow",
      neutralColor({ l: tokens.neutral.ring[mode].l, alpha: tokens.ringGlowAlpha[mode] }),
    ),
    declaration("surface-base", tokens.surface.base[mode]),
    ...(mode === "light"
      ? entries(tokens.spacing).map(([name, value]) =>
          declaration(`space-${name.replaceAll(".", "\\.")}`, value),
        )
      : []),
    ...entries(tokens.shadows).flatMap(([name, values]) =>
      typeof values === "string"
        ? []
        : [declaration(name === "inner" ? "inner-shadow" : `shadow-${name}`, values[mode])],
    ),
    ...(mode === "light"
      ? [
          ...entries(tokens.radius).map(([name, value]) =>
            declaration(name === "base" ? "radius" : `${name}-radius`, value),
          ),
          declaration("surface-inset", tokens.surfaceInset),
          declaration("inner-gap", tokens.innerGap),
          declaration("surface-shadow", cssVar(`shadow-${tokens.shadows.surface}`)),
          ...entries(tokens.zIndex).map(([name, value]) => declaration(`z-${name}`, value)),
        ]
      : []),
    declaration("shell-bg", tokens.shell.bg[mode]),
    declaration("topbar-height", tokens.shell.topbarHeight),
    ...entries(tokens.utility).map(([name, values]) => declaration(name, values[mode])),
    ...entries(tokens.chart).map(([name, values]) => declaration(`chart-${name}`, values[mode])),
  ]);
}

export function renderTokens() {
  return [
    "/* GENERATED — edit src/tokens/schema.ts. Run bun run build:tokens. */",
    '@import "tailwindcss";',
    '@import "./base.css";',
    "",
    "/* Framework packages provide their own @source directives. */",
    "@custom-variant dark (&:is(.dark *));",
    "",
    themeBridge(),
    "",
    modeBlock("light"),
    "",
    modeBlock("dark"),
    "",
  ].join("\n");
}
