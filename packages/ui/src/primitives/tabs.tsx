import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { cn } from "../lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      ref={ref}
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-9 w-fit items-center justify-center rounded-lg bg-neutral-bg-muted p-1 text-neutral-fg-subtle",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  activeClassName,
  ref,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Tab> & { activeClassName?: string }) {
  return (
    <TabsPrimitive.Tab
      ref={ref}
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all cursor-pointer",
        "text-neutral-fg-subtle",
        activeClassName ?? "data-[active]:bg-neutral-bg data-[active]:text-neutral-fg data-[active]:border-neutral-border/60 data-[active]:shadow-[var(--inner-shadow)]",
        "focus-visible:border-neutral-ring focus-visible:ring-[3px] focus-visible:ring-neutral-ring/50 focus-visible:outline-1 focus-visible:outline-neutral-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Panel>) {
  return (
    <TabsPrimitive.Panel
      ref={ref}
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
