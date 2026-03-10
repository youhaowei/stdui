import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cva } from "class-variance-authority"

import { cn } from "../lib/utils"

const progressVariants = cva(
  "relative h-4 w-full overflow-hidden rounded-full",
  {
    variants: {
      color: {
        primary: "bg-palette-primary/20",
        secondary: "bg-palette-secondary/20",
        success: "bg-palette-success/20",
        danger: "bg-palette-danger/20",
        warning: "bg-palette-warning/20",
        info: "bg-palette-info/20",
      },
    },
    defaultVariants: {
      color: "primary",
    },
  }
)

const indicatorVariants = cva(
  "h-full w-full flex-1 rounded-full transition-all",
  {
    variants: {
      color: {
        primary: "bg-palette-primary",
        secondary: "bg-palette-secondary",
        success: "bg-palette-success",
        danger: "bg-palette-danger",
        warning: "bg-palette-warning",
        info: "bg-palette-info",
      },
    },
    defaultVariants: {
      color: "primary",
    },
  }
)

type ProgressColor = "primary" | "secondary" | "success" | "danger" | "warning" | "info"

function Progress({
  className,
  value,
  color = "primary",
  ref,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { color?: ProgressColor }) {
  return (
    <ProgressPrimitive.Root
      ref={ref}
      value={value}
      className={cn(progressVariants({ color }), className)}
      {...props}
    >
      <ProgressPrimitive.Track className="relative h-full w-full overflow-hidden rounded-full">
        <ProgressPrimitive.Indicator
          className={indicatorVariants({ color })}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
