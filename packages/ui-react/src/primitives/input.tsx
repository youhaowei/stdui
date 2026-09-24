import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md text-base ring-offset-neutral-bg transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-fg placeholder:text-neutral-fg-subtle focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        // The well: a recessed, borderless field with an inset shadow and a
        // hairline ring. Shared with Toggle's default so value controls on one
        // toolbar read as one family. Keyboard focus swaps the hairline for
        // the full focus ring.
        default:
          "border-0 bg-neutral-bg-subtle shadow-inner ring-[0.5px] ring-neutral-border focus-visible:ring-2 focus-visible:ring-neutral-ring",
        // Borderless, reads as plain text; reveals border + subtle bg on
        // hover/focus. For inline-editable property fields (Linear/Notion style).
        // Keyboard focus additionally gets a ring: without it, focus and hover
        // are visually identical.
        ghost:
          "border border-transparent bg-transparent shadow-none hover:border-neutral-border hover:bg-neutral-bg-subtle focus:border-neutral-border focus:bg-neutral-bg focus-visible:ring-2 focus-visible:ring-neutral-ring",
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-2 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type InputProps = Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>;

function Input({ className, type, variant, size, ref, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  );
}

export { Input, inputVariants };
export type { InputProps };
