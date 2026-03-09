import * as React from "react"

import { cn } from "../lib/utils"

export type SurfaceElevation = "plain" | "raised" | "floating" | "inset"

export interface SurfaceProps extends React.ComponentProps<"div"> {
  /**
   * The elevation variant determining the surface's visual depth and shadow.
   *
   * - `plain`: Minimal flat surface with border only, no shadow
   * - `raised`: Standard elevated surface with subtle shadow (default)
   * - `floating`: Prominent elevation with backdrop blur and stronger shadow
   * - `inset`: Sunken appearance with inset shadow for recessed areas
   *
   * @default "raised"
   */
  elevation?: SurfaceElevation
  /**
   * Adds hover interaction states for clickable or interactive surfaces.
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
        // Base styles
        "rounded-xl border transition-colors",
        // Elevation variants
        {
          // Plain: Minimal flat surface, border only
          "border-neutral-border bg-neutral-bg": elevation === "plain",
          // Raised: Standard card appearance
          "border-neutral-border/60 bg-neutral-bg-subtle/80 shadow-sm":
            elevation === "raised",
          // Floating: Elevated panel with glassmorphism
          "border-neutral-border/60 bg-neutral-bg-subtle/70 shadow-lg backdrop-blur supports-backdrop-filter:bg-neutral-bg-subtle/60":
            elevation === "floating",
          // Inset: Sunken surface with inset shadow
          "border-neutral-border bg-neutral-bg-dim/30 shadow-inner":
            elevation === "inset",
        },
        // Interactive states
        interactive &&
          "cursor-pointer hover:border-neutral-border hover:bg-neutral-bg-subtle/50",
        className,
      )}
      {...props}
    />
  )
}

export { Surface }
