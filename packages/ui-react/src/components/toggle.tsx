import React, { type ReactNode } from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "../lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../primitives/tabs";
import { Badge } from "../primitives/badge";

function TriggerWithTooltip({ tooltip, children }: { tooltip: string; children: ReactNode }) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger render={<span className="inline-flex">{children}</span>} />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner>
          <TooltipPrimitive.Popup className="z-50 overflow-hidden rounded-md border bg-neutral-bg-emphasis px-3 py-1.5 text-sm text-neutral-fg shadow-md">
            {tooltip}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export interface ToggleOption<T extends string> {
  value: T;
  icon?: ReactNode;
  label?: string;
  badge?: string | number;
  tooltip?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export interface ToggleProps<T extends string> {
  value: T;
  options: ToggleOption<T>[];
  onValueChange: (value: T) => void;
  variant?: "soft" | "outline";
  size?: "default" | "sm";
  className?: string;
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
                activeClassName="data-[active]:bg-palette-primary/10 data-[active]:text-palette-primary data-[active]:border-transparent data-[active]:shadow-none"
                className={cn(
                  "rounded-full",
                  size === "sm" ? "px-2 py-1 text-xs gap-1" : "px-3 py-1.5 text-sm gap-1.5",
                )}
              >
                {option.icon && (
                  <span className={cn("shrink-0", size === "sm" && "[&_svg]:size-3")}>
                    {option.icon}
                  </span>
                )}
                {option.label}
                {option.badge !== undefined && (
                  <Badge variant="soft" className="px-1.5 py-0 text-xs tabular-nums">
                    {option.badge}
                  </Badge>
                )}
              </TabsTrigger>
            );

            if (option.tooltip) {
              return (
                <TriggerWithTooltip key={option.value} tooltip={option.tooltip}>
                  {trigger}
                </TriggerWithTooltip>
              );
            }
            return trigger;
          })}
        </TabsList>
        {options.map((option) => (
          <TabsContent key={option.value} value={option.value} className="hidden" />
        ))}
      </Tabs>
    );
  }

  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as T)}>
      <TabsList
        className={cn(
          // The same well as Input's default: tone, inset shadow, hairline
          // ring, radius, and outer height all match Input at the same size.
          "gap-0.5 rounded-md bg-neutral-bg-subtle p-0.5 shadow-inner ring-[0.5px] ring-neutral-border",
          size === "sm" ? "h-8" : "h-10",
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
              // Flat segments inside the well: the active one is tinted, never
              // raised (no shadow, no border).
              activeClassName="data-[active]:bg-neutral-fg/[0.06] data-[active]:text-neutral-fg data-[active]:shadow-none"
              className={cn(
                "h-full flex-none rounded-sm border-0 py-0 transition-colors duration-150 motion-reduce:transition-none",
                "not-data-[active]:hover:bg-neutral-fg/[0.035] not-data-[active]:hover:text-neutral-fg",
                option.label
                  ? size === "sm"
                    ? "px-2 text-xs gap-1"
                    : "px-3 text-sm gap-1.5"
                  : "aspect-square px-0",
              )}
            >
              {option.icon && (
                <span className={cn("shrink-0", size === "sm" && "[&_svg]:size-3")}>
                  {option.icon}
                </span>
              )}
              {option.label}
              {option.badge !== undefined && (
                <Badge variant="soft" className="px-1.5 py-0 text-xs tabular-nums">
                  {option.badge}
                </Badge>
              )}
            </TabsTrigger>
          );

          if (option.tooltip) {
            return (
              <TriggerWithTooltip key={option.value} tooltip={option.tooltip}>
                {trigger}
              </TriggerWithTooltip>
            );
          }
          return trigger;
        })}
      </TabsList>
      {options.map((option) => (
        <TabsContent key={option.value} value={option.value} className="hidden" />
      ))}
    </Tabs>
  );
}
