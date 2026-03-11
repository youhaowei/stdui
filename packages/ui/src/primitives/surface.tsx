import * as React from "react"

import { cn } from "../lib/utils"

export type SurfaceElevation = "flat" | "raised" | "floating" | "inset"

export interface SurfaceProps extends React.ComponentProps<"div"> {
  /**
   * Visual depth level. Each maps to a shadow token from tokens.css.
   *
   * - `flat`: No shadow, subtle border. Inline sections, table containers.
   * - `raised`: Light lift with --shadow-md ring+layers. Cards, panels, main content areas. (default)
   * - `floating`: Dramatic depth with --shadow-lg. Dropdowns, modals, popovers.
   * - `inset`: Recessed with --inner-shadow. Code blocks, input wells.
   */
  elevation?: SurfaceElevation
  /**
   * Adds hover interaction states for clickable surfaces.
   *
   * @default false
   */
  interactive?: boolean
}

function Surface({
  elevation = "raised",
  interactive = false,
  className,
  ...props
}: SurfaceProps) {
  return (
    <div
      data-slot="surface"
      className={cn(
        "rounded-[var(--radius)] bg-neutral-bg transition-colors",
        {
          "border border-neutral-border-subtle":
            elevation === "flat",
          "shadow-[var(--shadow-md)]":
            elevation === "raised",
          "shadow-[var(--shadow-lg)]":
            elevation === "floating",
          "shadow-[var(--inner-shadow)] bg-neutral-bg-dim/30":
            elevation === "inset",
        },
        interactive &&
          "cursor-pointer hover:shadow-[var(--shadow-lg)] hover:bg-neutral-bg-subtle/50",
        className,
      )}
      {...props}
    />
  )
}

export { Surface }
