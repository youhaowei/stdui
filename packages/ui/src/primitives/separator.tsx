import * as React from "react"
import { Separator as SeparatorPrimitive } from "radix-ui"

import { cn } from "../lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ref,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-neutral-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
