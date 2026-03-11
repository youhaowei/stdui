---
name: stdui
description: >
  This skill should be used when working with @stdui/react, the stdui design system,
  or any UI component work in a stdui-consuming codebase. Trigger phrases include
  create a component, add a primitive, style a component, fix styling, theme issue,
  dark mode, light mode, design tokens, color system, OKLCH colors, Tailwind tokens,
  add a variant, CVA variants, spacing, shadow, focus ring, Radix UI, or submodule workflow.
  Provides design system principles, token conventions, component patterns, and git submodule workflow.
---

# stdui Design System

stdui is a design system built on Tailwind CSS v4, OKLCH color space, and Radix UI primitives. It ships as `@stdui/react` and is consumed as a git submodule.

## Design Philosophy

### Visual Identity

stdui is **refined and professional** — not playful, not brutalist. The aesthetic is clean, dense, and purposeful. Every pixel has a reason.

- **Neutral-first** — neutrals are the foundation; palette colors are accents, not decoration
- **Information-dense** — compact layouts that respect the user's attention. No wasted space, but never cramped
- **Quiet confidence** — subtle shadows, gentle borders, understated transitions. The UI should feel solid, not flashy

### Core Principles

1. **Even-pixel sizing** — ALL sizes and spacing use even numbers (2, 4, 6, 8, 10, 12, 14, 16...). Never 3, 5, 7, 9, 13, 15. This ensures consistent visual rhythm and subpixel-free rendering.

2. **OKLCH everywhere** — All colors defined in OKLCH (perceptually uniform). Never use hex/rgb/hsl in token definitions. OKLCH ensures equal perceived brightness across hues — a green and blue at the same L value look equally bright.

3. **4px grid** — Spacing follows a 4px base grid. The scale: 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48.

4. **Semantic tokens over raw values** — Use `bg-neutral-bg-subtle` not `bg-gray-100`. Use `text-palette-primary` not `text-black`. Tokens adapt to light/dark mode automatically.

5. **Composition over monoliths** — Small, focused sub-components (Card = Card + CardHeader + CardTitle + CardContent + CardFooter). Each piece is independently useful.

6. **CSS custom properties as the bridge** — Theme store mutates `document.documentElement.style` directly. Tailwind picks up values via `@theme inline` in tokens.css.

### Typography

System fonts by default. Five scales:

| Scale   | Size | Weight | Leading | Use |
|---------|------|--------|---------|-----|
| Display | 24px | 700    | 1.2     | Page titles |
| Heading | 16px | 600    | 1.3     | Section headers |
| Body    | 14px | 400    | 1.5     | Default content |
| Small   | 12px | 400    | 1.4     | Secondary text, hints |
| Caption | 10px | 500    | 1.3     | Labels, micro text |

Code: 12px, SF Mono / Fira Code / ui-monospace.

### Motion

- CSS transitions preferred over JS animation libraries
- Purposeful, not decorative — transitions guide attention (panel open/close, hover feedback)
- Duration: 150ms for micro-interactions, 200ms for panels/modals, 300ms max
- Easing: `ease-in-out` for most; `ease-out` for entrances

### Accessibility

- Focus rings: `focus-visible:ring-2 focus-visible:ring-neutral-ring focus-visible:ring-offset-2`
- `sr-only` for visually hidden but accessible labels (e.g., collapsed sidebar items)
- `aria-hidden="true"` on decorative icons
- Minimum contrast: WCAG AA (4.5:1 for text, 3:1 for large text/UI)
- All interactive elements keyboard-navigable

### Responsive Strategy

- Mobile-first, fluid layouts
- No rigid breakpoints in primitives — components adapt via flex/grid
- Sidebar collapses via state, not media queries (app controls when)

## Component Conventions

### File Structure

- **Primitives** (`src/primitives/`): Base components from Radix UI foundations. Simple, unstyled or lightly styled.
- **Components** (`src/components/`): Enhanced versions that shadow primitives. Feature-rich, opinionated.
- **Fields** (`src/fields/`): Form field wrappers combining label + input + error state.
- **Views** (`src/views/`): Larger composed views (ThemePanel, ColorPicker).

### Pattern: CVA Variants

Use `class-variance-authority` for all variant-based components:

```typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { solid: "...", soft: "...", outline: "...", ghost: "..." },
    color: { primary: "...", secondary: "...", success: "...", danger: "...", warning: "...", info: "..." },
    size: { xs: "...", sm: "...", default: "...", lg: "...", icon: "..." }
  },
  compoundVariants: [
    { variant: "solid", color: "primary", className: "..." }
  ],
  defaultVariants: { variant: "soft", color: "primary", size: "default" }
})
```

### Pattern: Composition

Sub-components as separate exports, not nested:

```typescript
export function Card({ className, ...props }) { /* wrapper */ }
export function CardHeader({ className, ...props }) { /* header slot */ }
export function CardTitle({ className, ...props }) { /* title slot */ }
export function CardContent({ className, ...props }) { /* content slot */ }
```

### Pattern: Polymorphism

Use `asChild` prop (Radix Slot) for element polymorphism:

```tsx
<Button asChild><a href="/link">Link styled as button</a></Button>
```

### Prop Conventions

- `className`: Always accept, merge with `cn()` (clsx + tailwind-merge)
- `variant` / `color` / `size`: CVA-driven
- `ref`: Always forward refs
- `data-slot`: Semantic hook for CSS targeting
- `data-color` / `data-active`: State attributes (set only when truthy)

### New Component Checklist

Before creating any new stdui component:

- [ ] Even-pixel sizes and spacing only
- [ ] Uses semantic tokens (`palette-*`, `neutral-*`), never raw colors
- [ ] `cn()` for class merging
- [ ] Forwards `ref` and spreads `...props`
- [ ] `className` prop accepted
- [ ] Focus states use `focus-visible:ring-2 focus-visible:ring-neutral-ring`
- [ ] Dark mode works via `.dark` class (no separate dark tokens needed if using semantic tokens)
- [ ] Exports from `src/index.ts`

## Token Quick Reference

**Spacing (4px grid):** 0, 2px, 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px

**Palette colors:** primary, secondary, success, danger, warning, info (each has `-fg` variant)

**Neutral scale (light L → dark L):**
- `fg`: 0.145 → 0.985 | `fg-subtle`: 0.556 → 0.708
- `bg`: 1.0 → 0.145 | `bg-subtle` through `bg-strongest`: graduated steps
- `border`: 0.922 → white/10% | `ring`: 0.708 → 0.556

**Shadows:** xs, sm, md, lg (light uses 3-6% opacity; dark uses 20-35%)

**Shape:** radius 10px, surface-inset 8px, inner-radius 8px, inner-gap 4px

**Z-index:** base(0), dropdown(100), sticky(200), modal(300), popover(400), toast(500)

For the full token reference with all CSS custom properties, consult **`references/tokens.md`**.

## Theme System

The theme is managed by a Zustand store that writes CSS custom properties to `document.documentElement.style`:

- **Mode**: system / light / dark (persisted to localStorage)
- **Overrides**: Per-mode palette colors, neutral hue/chroma, surface tint
- **Provider**: `<StduiProvider storageKey="app-name">` — idempotent (detects parent and skips)
- **Hook**: `useTheme()` returns mode, overrides, isDark, and setters
- **Shell background**: `--shell-bg` supports solid + gradient (use `[background:var(--shell-bg)]`, not `bg-shell-bg`)

## Gotchas

- **`bg-*` vs `[background:*]`**: Tailwind's `bg-*` maps to `background-color`, which cannot hold CSS gradients. For `--shell-bg` (which may be a gradient), always use `[background:var(--shell-bg)]`.
- **StduiProvider nesting**: `StduiProvider` is idempotent — if a parent already provides ThemeContext, it skips creating a new store. Safe to use in both library and app code.
- **SSR hydration**: Never read `localStorage` in `useState` initializers. Use `useState(false)` + `useEffect` to sync. The sidebar collapsed state follows this pattern.
- **Clerk + theme**: Clerk's `variables` API does not resolve CSS custom properties. Use CSS overrides with `!important` targeting `.dark .cl-*` classes for dark mode support.
- **Surface tint target**: `--shell-bg` controls the shell ground background, NOT the content surface. The content surface always uses `bg-neutral-bg`.

## Additional Resources

### Reference Files

- **`references/tokens.md`** — Complete CSS custom property reference (all light/dark values)
- **`references/submodule-workflow.md`** — Git submodule conventions for developing alongside stdui
