# stdui Token Reference

Complete CSS custom property reference for the stdui design system. All values defined in `src/styles/tokens.css`.

## Palette Colors

Semantic accent colors. Each has a foreground variant (`-fg`) for text on that color.

### Light Mode (`:root`)

| Token                  | Value                           |
| ---------------------- | ------------------------------- |
| `--palette-primary`    | `oklch(0.205 0 0)` (near black) |
| `--palette-primary-fg` | `oklch(0.985 0 0)` (near white) |
| `--palette-secondary`  | Tailwind `slate-600`            |
| `--palette-success`    | Tailwind `lime-600`             |
| `--palette-danger`     | Tailwind `red-600`              |
| `--palette-warning`    | Tailwind `amber-600`            |
| `--palette-info`       | Tailwind `sky-600`              |
| All `*-fg` variants    | `white` (except primary)        |

### Dark Mode (`.dark`)

| Token                  | Value                           |
| ---------------------- | ------------------------------- |
| `--palette-primary`    | `oklch(0.922 0 0)` (near white) |
| `--palette-primary-fg` | `oklch(0.205 0 0)` (near black) |
| `--palette-secondary`  | Tailwind `slate-400`            |
| `--palette-success`    | Tailwind `lime-400`             |
| `--palette-danger`     | Tailwind `red-400`              |
| `--palette-warning`    | Tailwind `amber-400`            |
| `--palette-info`       | Tailwind `sky-400`              |

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

| Token                    | Value                                           |
| ------------------------ | ----------------------------------------------- |
| `--text-display-size`    | 24px                                            |
| `--text-display-weight`  | 700                                             |
| `--text-display-leading` | 1.2                                             |
| `--text-heading-size`    | 16px                                            |
| `--text-heading-weight`  | 600                                             |
| `--text-heading-leading` | 1.3                                             |
| `--text-body-size`       | 14px                                            |
| `--text-body-weight`     | 400                                             |
| `--text-body-leading`    | 1.5                                             |
| `--text-sm-size`         | 12px                                            |
| `--text-sm-weight`       | 400                                             |
| `--text-sm-leading`      | 1.4                                             |
| `--text-caption-size`    | 10px                                            |
| `--text-caption-weight`  | 500                                             |
| `--text-caption-leading` | 1.3                                             |
| `--text-code-size`       | 12px                                            |
| `--text-code-family`     | "SF Mono", "Fira Code", ui-monospace, monospace |

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

| Token            | Value                                                      |
| ---------------- | ---------------------------------------------------------- |
| `--shadow-xs`    | `0 1px 2px oklch(0 0 0 / 4%)`                              |
| `--shadow-sm`    | `0 1px 3px oklch(0 0 0 / 6%), 0 1px 2px oklch(0 0 0 / 4%)` |
| `--shadow-md`    | Multi-layer: 1px border + 4px + 8px blur                   |
| `--shadow-lg`    | Multi-layer: 1px border + 12px + 24px blur                 |
| `--inner-shadow` | Inset: 1px border + 2px + 4px blur                         |

### Dark Mode

Same structure but higher opacity (20-35% vs 3-6%). Borders use white/8% instead of black.

## Shape

| Token              | Value           | Use                                 |
| ------------------ | --------------- | ----------------------------------- |
| `--radius`         | 0.625rem (10px) | Standard border radius              |
| `--surface-radius` | 10px            | Content surface corners             |
| `--surface-inset`  | 8px             | Padding between shell and surface   |
| `--inner-radius`   | 8px             | Inner element corners               |
| `--inner-gap`      | 4px             | Gap between nested rounded elements |

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

| Token       | Light                 | Dark                   |
| ----------- | --------------------- | ---------------------- |
| `--chart-1` | oklch(0.646 0.222 41) | oklch(0.488 0.243 264) |
| `--chart-2` | oklch(0.6 0.118 185)  | oklch(0.696 0.17 162)  |
| `--chart-3` | oklch(0.398 0.07 227) | oklch(0.769 0.188 70)  |
| `--chart-4` | oklch(0.828 0.189 84) | oklch(0.627 0.265 304) |
| `--chart-5` | oklch(0.769 0.188 70) | oklch(0.645 0.246 16)  |

## Tailwind v4 Bridge

The `@theme inline` block in `tokens.css` maps CSS custom properties to Tailwind utilities:

```css
@theme inline {
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
