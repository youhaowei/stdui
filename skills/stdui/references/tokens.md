Values are defined in `packages/ui-core/src/tokens/schema.ts`; `src/styles/tokens.css` is generated.

`cssVar(name)` from `@wystack/ui-core/tokens` returns `var(--name)` and accepts only custom properties the CSS declares in `:root`/`.dark` (`TokenName`). Tailwind bridge keys such as `text-display`, `radius-surface`, `shadow-surface`, and `font-code` (`ThemeKeyName`) are inlined into utilities and never emitted as custom properties — use the utility class, not `cssVar`.

# stdui Token Reference

Complete CSS custom property reference for the stdui design system. Run `bun run --filter @wystack/ui-core build:tokens` after editing the schema; `check:tokens` rejects stale CSS.

## Palette Colors

Semantic accent colors. Each has a foreground variant (`-fg`) for text on that color.

### Light Mode (`:root`)

| Token                    | Value                        |
| ------------------------ | ---------------------------- |
| `--palette-primary`      | `oklch(0.205 0 0)`           |
| `--palette-primary-fg`   | `oklch(0.985 0 0)`           |
| `--palette-secondary`    | `oklch(0.446 0.043 257.281)` |
| `--palette-secondary-fg` | `oklch(1 0 0)`               |
| `--palette-success`      | `oklch(0.648 0.2 131.684)`   |
| `--palette-success-fg`   | `oklch(1 0 0)`               |
| `--palette-danger`       | `oklch(0.577 0.245 27.325)`  |
| `--palette-danger-fg`    | `oklch(1 0 0)`               |
| `--palette-warning`      | `oklch(0.666 0.179 58.318)`  |
| `--palette-warning-fg`   | `oklch(1 0 0)`               |
| `--palette-info`         | `oklch(0.588 0.158 241.966)` |
| `--palette-info-fg`      | `oklch(1 0 0)`               |

### Dark Mode (`.dark`)

| Token                    | Value                        |
| ------------------------ | ---------------------------- |
| `--palette-primary`      | `oklch(0.922 0 0)`           |
| `--palette-primary-fg`   | `oklch(0.205 0 0)`           |
| `--palette-secondary`    | `oklch(0.704 0.04 256.788)`  |
| `--palette-secondary-fg` | `oklch(0.129 0.042 264.695)` |
| `--palette-success`      | `oklch(0.841 0.238 128.85)`  |
| `--palette-success-fg`   | `oklch(0.274 0.072 132.109)` |
| `--palette-danger`       | `oklch(0.704 0.191 22.216)`  |
| `--palette-danger-fg`    | `oklch(1 0 0)`               |
| `--palette-warning`      | `oklch(0.828 0.189 84.429)`  |
| `--palette-warning-fg`   | `oklch(0.279 0.077 45.635)`  |
| `--palette-info`         | `oklch(0.746 0.16 232.661)`  |
| `--palette-info-fg`      | `oklch(0.293 0.066 243.157)` |

### Tailwind Usage

```
text-palette-primary       bg-palette-primary
text-palette-primary-fg    bg-palette-danger/10  (with opacity)
```

## Neutral Scale

Achromatic grays defined in OKLCH. The theme system can tint these by injecting a hue and chroma.

### Light Mode

| Token                     | L value     | Use                      |
| ------------------------- | ----------- | ------------------------ |
| `--neutral-fg`            | 0.145       | Primary text             |
| `--neutral-fg-subtle`     | 0.50        | Secondary/muted text     |
| `--neutral-bg`            | 1.0         | Page background (white)  |
| `--neutral-bg-subtle`     | 0.98        | Slightly off-white       |
| `--neutral-bg-muted`      | 0.96        | Muted sections           |
| `--neutral-bg-emphasis`   | 0.94        | Emphasized areas         |
| `--neutral-bg-bold`       | 0.92        | Bold backgrounds         |
| `--neutral-bg-strongest`  | 0.90        | Strongest gray           |
| `--neutral-bg-dim`        | 0.87        | Darkest light background |
| `--neutral-border`        | 0.922       | Standard borders         |
| `--neutral-border-subtle` | 0.95        | Subtle/light borders     |
| `--neutral-ring`          | 0.708       | Focus ring               |
| `--neutral-ring-glow`     | 0.708 / 30% | Focus glow               |

### Dark Mode

| Token                     | L value     | Use                          |
| ------------------------- | ----------- | ---------------------------- |
| `--neutral-fg`            | 0.985       | Primary text (near white)    |
| `--neutral-fg-subtle`     | 0.708       | Secondary text               |
| `--neutral-bg`            | 0.145       | Page background (near black) |
| `--neutral-bg-subtle`     | 0.18        | Slightly lighter             |
| `--neutral-bg-muted`      | 0.23        | Muted sections               |
| `--neutral-bg-emphasis`   | 0.27        | Emphasized areas             |
| `--neutral-bg-bold`       | 0.31        | Bold backgrounds             |
| `--neutral-bg-strongest`  | 0.35        | Strongest gray               |
| `--neutral-bg-dim`        | 0.11        | Darkest background           |
| `--neutral-border`        | white / 15% | Borders (alpha-based)        |
| `--neutral-border-subtle` | white / 8%  | Subtle borders               |
| `--neutral-ring`          | 0.556       | Focus ring                   |
| `--neutral-ring-glow`     | 0.556 / 20% | Focus glow                   |

### Tailwind Usage

```
text-neutral-fg          bg-neutral-bg
text-neutral-fg-subtle   bg-neutral-bg-subtle
border-neutral-border    ring-neutral-ring
```

## Typography

Tailwind's default `text-xs` through `text-2xl` remain unchanged. Semantic utilities set size, line height, and weight together:

| Utility        | Size | Line height | Weight    |
| -------------- | ---- | ----------- | --------- |
| `text-display` | 24px | 1.2         | 700       |
| `text-heading` | 16px | 1.3         | 600       |
| `text-body`    | 14px | 1.5         | 400       |
| `text-label`   | 12px | 1.4         | 400       |
| `text-caption` | 10px | 1.3         | 500       |
| `text-code`    | 12px | inherited   | inherited |

Use `text-code font-code` for code. `--font-code` is `"SF Mono", "Fira Code", ui-monospace, monospace`. The old `--text-*-size/weight/leading` properties are removed.

## Spacing (4px Grid)

| Token         | Value             |
| ------------- | ----------------- |
| `--space-0`   | 0px               |
| `--space-px`  | 1px (border only) |
| `--space-0.5` | 2px               |
| `--space-1`   | 4px               |
| `--space-2`   | 8px               |
| `--space-3`   | 12px              |
| `--space-4`   | 16px              |
| `--space-5`   | 20px              |
| `--space-6`   | 24px              |
| `--space-8`   | 32px              |
| `--space-10`  | 40px              |
| `--space-12`  | 48px              |

`--spacing` (Tailwind base) maps to `--space-1` (4px).

## Shadows

### Light Mode

| Token            | Value                                                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| `--shadow-xs`    | `0 1px 2px oklch(0 0 0 / 4%)`                                                                                         |
| `--shadow-sm`    | `0 1px 3px oklch(0 0 0 / 6%), 0 1px 2px oklch(0 0 0 / 4%)`                                                            |
| `--shadow-md`    | `0 0 0 1px oklch(0 0 0 / 3%), 0 1px 2px oklch(0 0 0 / 4%), 0 4px 8px oklch(0 0 0 / 3%), 0 8px 16px oklch(0 0 0 / 2%)` |
| `--shadow-lg`    | `0 0 0 1px oklch(0 0 0 / 3%), 0 4px 12px oklch(0 0 0 / 6%), 0 12px 24px oklch(0 0 0 / 4%)`                            |
| `--inner-shadow` | `0 0 0 1px oklch(0 0 0 / 4%), 0 1px 2px oklch(0 0 0 / 6%), 0 2px 4px oklch(0 0 0 / 3%)`                               |

### Dark Mode

| Token            | Value                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `--shadow-xs`    | `0 1px 2px oklch(0 0 0 / 30%)`                                                                                           |
| `--shadow-sm`    | `0 1px 3px oklch(0 0 0 / 35%), 0 1px 2px oklch(0 0 0 / 25%)`                                                             |
| `--shadow-md`    | `0 0 0 1px oklch(1 0 0 / 8%), 0 1px 2px oklch(0 0 0 / 30%), 0 3px 6px oklch(0 0 0 / 25%), 0 6px 12px oklch(0 0 0 / 20%)` |
| `--shadow-lg`    | `0 0 0 1px oklch(1 0 0 / 8%), 0 4px 12px oklch(0 0 0 / 35%), 0 12px 24px oklch(0 0 0 / 25%)`                             |
| `--inner-shadow` | `0 0 0 1px oklch(1 0 0 / 12%), 0 1px 3px oklch(0 0 0 / 30%), 0 2px 6px oklch(0 0 0 / 22%)`                               |

## Shape

| Token              | Value           | Use                                 |
| ------------------ | --------------- | ----------------------------------- |
| `--radius`         | 0.625rem (10px) | Standard border radius              |
| `--surface-radius` | 10px            | Content surface corners             |
| `--surface-inset`  | 8px             | Padding between shell and surface   |
| `--inner-radius`   | 8px             | Inner element corners               |
| `--inner-gap`      | 4px             | Gap between nested rounded elements |

`rounded-surface`, `rounded-inner`, and `rounded-control` use 10px, 8px, and 6px respectively. `--control-radius` is 6px. `shadow-surface` and the legacy `--surface-shadow` both reference `var(--shadow-md)`.

## Z-Index

| Token          | Value | Use                 |
| -------------- | ----- | ------------------- |
| `--z-base`     | 0     | Default stacking    |
| `--z-dropdown` | 100   | Dropdown menus      |
| `--z-sticky`   | 200   | Sticky headers      |
| `--z-modal`    | 300   | Modal overlays      |
| `--z-popover`  | 400   | Popovers, tooltips  |
| `--z-toast`    | 500   | Toast notifications |

## Layout

| Token             | Value                                        | Use                               |
| ----------------- | -------------------------------------------- | --------------------------------- |
| `--shell-bg`      | oklch(0.95 0.006 70) / oklch(0.18 0.005 250) | Shell ground (supports gradients) |
| `--surface-base`  | oklch(0.95 0.006 70) / oklch(0.2 0.005 250)  | Surface base color                |
| `--topbar-height` | 40px                                         | Top bar height                    |

## Utility

| Token         | Light           | Dark           |
| ------------- | --------------- | -------------- |
| `--scrollbar` | oklch(0.5 0 0)  | oklch(0.5 0 0) |
| `--code-bg`   | oklch(0.16 0 0) | oklch(0.1 0 0) |

## Chart Colors

5 distinct OKLCH hues for data visualization. Different palettes for light and dark mode.

| Token       | Light                       | Dark                         |
| ----------- | --------------------------- | ---------------------------- |
| `--chart-1` | `oklch(0.646 0.222 41.116)` | `oklch(0.488 0.243 264.376)` |
| `--chart-2` | `oklch(0.6 0.118 184.704)`  | `oklch(0.696 0.17 162.48)`   |
| `--chart-3` | `oklch(0.398 0.07 227.392)` | `oklch(0.769 0.188 70.08)`   |
| `--chart-4` | `oklch(0.828 0.189 84.429)` | `oklch(0.627 0.265 303.9)`   |
| `--chart-5` | `oklch(0.769 0.188 70.08)`  | `oklch(0.645 0.246 16.439)`  |

## Tailwind v4 Bridge

The default color palette is closed with `--color-*: initial`. Use semantic colors; numbered defaults such as `text-amber-500` do not compile. White and black remain available for `bg-white`, `bg-black`, and `border-white`.

The `@theme inline` block in `tokens.css` maps CSS custom properties to Tailwind utilities:

```css
@theme inline {
  --color-*: initial;
  --color-palette-primary: var(--palette-primary);
  --color-neutral-bg: var(--neutral-bg);
  --color-shell-bg: var(--shell-bg);
  --spacing: var(--space-1);
  --radius: var(--radius);
}
```

This enables utilities like `bg-palette-primary`, `text-neutral-fg`, `rounded-*`, etc.

### Dark Mode Variant

```css
@custom-variant dark (&:is(.dark *));
```

Enables `dark:bg-neutral-bg-subtle`, `dark:text-neutral-fg`, etc. The `.dark` class is toggled on `<html>` by the theme store.
