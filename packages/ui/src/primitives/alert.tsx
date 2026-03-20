import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border border-neutral-border bg-neutral-bg text-neutral-fg px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-[var(--alert-color,currentColor)]",
  {
    variants: {
      color: {
        info:
          "[--alert-color:var(--palette-info)] border-[var(--palette-info)]/30 text-[var(--alert-color)]",
        success:
          "[--alert-color:var(--palette-success)] border-[var(--palette-success)]/30 text-[var(--alert-color)]",
        warning:
          "[--alert-color:var(--palette-warning)] border-[var(--palette-warning)]/30 text-[var(--alert-color)]",
        danger:
          "[--alert-color:var(--palette-danger)] border-[var(--palette-danger)]/30 text-[var(--alert-color)]",
      },
      surface: {
        subtle:
          "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[var(--alert-color)]/5 before:pointer-events-none",
        glass:
          "bg-neutral-bg/80 backdrop-blur-xl before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[var(--alert-color)]/12 before:pointer-events-none",
        solid:
          "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[var(--alert-color)]/20 before:pointer-events-none",
      },
    },
    defaultVariants: {
      surface: "subtle",
    },
  },
)

function Alert({
  className,
  color,
  surface,
  ...props
}: Omit<React.ComponentProps<"div">, "color"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      data-color={color}
      role="alert"
      className={cn(alertVariants({ color, surface }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm text-neutral-fg-subtle [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  )
}

export { Alert, AlertDescription, AlertTitle }
