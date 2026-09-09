import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { tokens, cssVar } from "./schema";
import { renderTokens } from "./render";
import { NEUTRAL_TOKENS } from "../theme/tokens";

const generated = renderTokens();
const modeBlock = (selector: string) => generated.split(`${selector} {\n`)[1].split("\n}")[0];

describe("token schema contract", () => {
  it("keeps the shipped CSS identical to formatted schema output", () => {
    const formatted = execFileSync(
      "bun",
      ["x", "--no-install", "oxfmt", "--stdin-filepath", "tokens.css"],
      { input: generated, encoding: "utf8" },
    );
    expect(readFileSync(new URL("../styles/tokens.css", import.meta.url), "utf8")).toBe(formatted);
  });

  it("emits every neutral in both modes", () => {
    for (const selector of [":root", ".dark"]) {
      for (const name of Object.keys(tokens.neutral)) {
        expect(modeBlock(selector)).toContain(`--neutral-${name}: oklch(`);
      }
    }
  });

  it("uses the same neutral lightness and alpha for tinting and CSS", () => {
    for (const mode of ["light", "dark"] as const) {
      const css = modeBlock(mode === "light" ? ":root" : ".dark");
      for (const name of ["bg", "bg-muted", "fg-subtle", "border"] as const) {
        const match = css.match(
          new RegExp(`--neutral-${name}: oklch\\(([\\d.]+) 0 0(?: / ([\\d.]+)%)?\\)`),
        );
        expect(match).not.toBeNull();
        expect(Number(match![1])).toBe(NEUTRAL_TOKENS[name][mode].l);
        expect(match![2] === undefined ? undefined : Number(match![2]) / 100).toBe(
          NEUTRAL_TOKENS[name][mode].alpha,
        );
      }
    }
  });

  it("closes the default palette before declaring semantic colors and white/black", () => {
    const theme = modeBlock("@theme inline");
    expect(theme.match(/--color-[^;]+;/)?.[0]).toBe("--color-*: initial;");
    expect(theme).toContain("--color-white: #fff;");
    expect(theme).toContain("--color-black: #000;");
  });

  it("references known custom properties, including escaped fractional spacing", () => {
    expect(cssVar("neutral-bg")).toBe("var(--neutral-bg)");
    expect(cssVar("space-0.5")).toBe("var(--space-0\\.5)");
    // @ts-expect-error Unknown tokens must fail consumer typechecking.
    cssVar("neutral-missing");
  });
});
