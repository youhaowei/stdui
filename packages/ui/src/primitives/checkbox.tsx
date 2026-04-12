import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "@stdui/icons";

import { cn } from "../lib/utils";

function Checkbox({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-palette-primary ring-offset-neutral-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-palette-primary data-[checked]:text-palette-primary-fg",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn("grid place-content-center text-current")}>
        <CheckIcon className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
