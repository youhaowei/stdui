# Building with @wystack/ui

`@wystack/ui` (global `window.WyStackUI`) is a **product-register** design system — calm, functional, dense enough for real analysis. No decorative personality. Built on a **surface system**: shadow-lifted panels on a `bg-surface-base` canvas, no borders on surfaces, geometry from `--surface-radius` / `--surface-inset`.

## Wrap every design in the provider

Components read theme + tokens from a provider. Without it, tokens resolve to nothing and you get unstyled output. Wrap the whole tree once, outermost:

```jsx
<WyStackUI.StduiProvider defaultMode="light">
  <WyStackUI.TooltipProvider>
    {/* your design */}
  </WyStackUI.TooltipProvider>
</WyStackUI.StduiProvider>
```

`StduiProvider` sets the theme (`light` | `dark` | `system`) and toggles `.dark` on the root. `TooltipProvider` is required for any tooltip.

## Style with the token classes — never raw color

This is a **Tailwind-preset** system. Style with these class families (real names — use them, do not invent off-token hex or generic Tailwind palette colors):

| Family | Classes | Use |
|---|---|---|
| **Surface** | `bg-surface-base` | the canvas behind shadow-lifted panels |
| **Neutral bg** | `bg-neutral-bg` `-subtle` `-muted` `-dim` `-emphasis` | backgrounds, from quietest to strongest |
| **Neutral fg** | `text-neutral-fg` `text-neutral-fg-subtle` | primary / secondary text |
| **Neutral border** | `border-neutral-border` `-subtle`, `border-neutral-ring`, `ring-neutral-ring` | dividers, focus rings |
| **Palette** (status/intent) | `bg-palette-{primary,secondary,success,danger,warning,info}` + matching `text-palette-*` / `border-palette-*` | filled intent surfaces |
| **Palette fg** | `text-palette-{primary,success,danger,warning,info,secondary}-fg` | text ON a palette surface |

Geometry: `--radius-{sm,md,lg,xl}`, `--surface-radius`, `--surface-inset`. Prefer the component's own props over re-styling; reach for these classes only for your own layout glue.

## Read the real source before styling

The compiled token + component CSS is in `_ds/wystack-ui/styles.css` and its `@import` closure — read it to see the exact token values. Each component has a `.prompt.md` (usage) and `.d.ts` (props API) next to its preview card.

## Components

Build with these (group/Name): **ButtonPrimitive, Badge, Card, Alert, Dialog, Input, Textarea, Checkbox, Switch, Tabs, Progress, Separator, Skeleton, Surface, Stack, Toggle, TooltipPrimitive, EmptyState, ErrorState, LoadingState, Spinner.** `StduiProvider` and `TooltipProvider` ship in the bundle (no card — they're the wrap, not content).

## One idiomatic build

```jsx
<WyStackUI.StduiProvider defaultMode="light">
  <WyStackUI.TooltipProvider>
    <div className="bg-surface-base min-h-screen p-6">
      <WyStackUI.Card>
        <WyStackUI.CardHeader>
          <WyStackUI.CardTitle>Revenue</WyStackUI.CardTitle>
          <WyStackUI.CardDescription className="text-neutral-fg-subtle">
            Last 30 days
          </WyStackUI.CardDescription>
        </WyStackUI.CardHeader>
        <WyStackUI.CardContent>
          <WyStackUI.Stack gap="md">
            <WyStackUI.Badge variant="solid" color="success">+12%</WyStackUI.Badge>
            <WyStackUI.ButtonPrimitive>View report</WyStackUI.ButtonPrimitive>
          </WyStackUI.Stack>
        </WyStackUI.CardContent>
      </WyStackUI.Card>
    </div>
  </WyStackUI.TooltipProvider>
</WyStackUI.StduiProvider>
```
