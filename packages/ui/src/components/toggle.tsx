import React, { type ReactNode } from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"
import { cn } from "../lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../primitives/tabs"
import { Badge } from "../primitives/badge"
import { TooltipContent } from "../primitives/tooltip"

function TriggerWithTooltip({
  tooltip,
  children,
}: {
  tooltip: string
  children: ReactNode
}) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>
        <span className="inline-flex">{children}</span>
      </TooltipPrimitive.Trigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </TooltipPrimitive.Root>
  )
}

export interface ToggleOption<T extends string> {
  value: T
  icon?: ReactNode
  label?: string
  badge?: string | number
  tooltip?: string
  ariaLabel?: string
  disabled?: boolean
}

export interface ToggleProps<T extends string> {
  value: T
  options: ToggleOption<T>[]
  onValueChange: (value: T) => void
  variant?: "soft" | "outline"
  size?: "default" | "sm"
  className?: string
}

export function Toggle<T extends string>({
  value,
  options,
  onValueChange,
  variant = "soft",
  size = "default",
  className,
}: ToggleProps<T>) {
  if (variant === "outline") {
    return (
      <Tabs value={value} onValueChange={(v) => onValueChange(v as T)}>
        <TabsList
          className={cn(
            "bg-transparent border border-neutral-border/60 rounded-full h-auto",
            size === "sm" ? "p-0.5" : "p-1",
            className,
          )}
        >
          {options.map((option) => {
            const trigger = (
              <TabsTrigger
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                aria-label={option.ariaLabel || option.tooltip || option.label}
                activeClassName="data-[state=active]:bg-palette-primary/10 data-[state=active]:text-palette-primary data-[state=active]:border-transparent data-[state=active]:shadow-none"
                className={cn(
                  "rounded-full",
                  size === "sm" ? "px-2 py-1 text-xs gap-1" : "px-3 py-1.5 text-sm gap-1.5",
                )}
              >
                {option.icon && <span className={cn("shrink-0", size === "sm" && "[&_svg]:size-3")}>{option.icon}</span>}
                {option.label}
                {option.badge !== undefined && (
                  <Badge
                    variant="soft"
                    className="px-1.5 py-0 text-xs tabular-nums"
                  >
                    {option.badge}
                  </Badge>
                )}
              </TabsTrigger>
            )

            if (option.tooltip) {
              return (
                <TriggerWithTooltip key={option.value} tooltip={option.tooltip}>
                  {trigger}
                </TriggerWithTooltip>
              )
            }
            return trigger
          })}
        </TabsList>
        {options.map((option) => (
          <TabsContent key={option.value} value={option.value} className="hidden" />
        ))}
      </Tabs>
    )
  }

  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as T)}>
      <TabsList
        className={cn(
          "h-auto",
          size === "sm" ? "p-0.5 rounded-lg" : "p-1 rounded-xl",
          className,
        )}
      >
        {options.map((option) => {
          const trigger = (
            <TabsTrigger
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              aria-label={option.ariaLabel || option.tooltip || option.label}
              className={cn(
                size === "sm" ? "px-2 py-1 text-xs gap-1 rounded-md" : "px-4 py-2 text-sm gap-2 rounded-lg",
              )}
            >
              {option.icon && <span className={cn("shrink-0", size === "sm" && "[&_svg]:size-3")}>{option.icon}</span>}
              {option.label}
              {option.badge !== undefined && (
                <Badge
                  variant="soft"
                  className="px-1.5 py-0 text-xs tabular-nums"
                >
                  {option.badge}
                </Badge>
              )}
            </TabsTrigger>
          )

          if (option.tooltip) {
            return (
              <TriggerWithTooltip key={option.value} tooltip={option.tooltip}>
                {trigger}
              </TriggerWithTooltip>
            )
          }
          return trigger
        })}
      </TabsList>
      {options.map((option) => (
        <TabsContent key={option.value} value={option.value} className="hidden" />
      ))}
    </Tabs>
  )
}
