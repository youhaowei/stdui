import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const cardVariants = cva("rounded-lg text-neutral-fg", {
  variants: {
    variant: {
      outlined: "bg-neutral-bg border",
      elevated: "bg-neutral-bg shadow-sm border border-neutral-border-subtle",
    },
  },
  defaultVariants: { variant: "outlined" },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

function Card({
  className,
  variant,
  ref,
  ...props
}: CardProps & { ref?: React.Ref<HTMLDivElement> }) {
  return <div ref={ref} className={cn(cardVariants({ variant, className }))} {...props} />;
}

function CardHeader({ className, ref, ...props }: React.ComponentProps<"div">) {
  return <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

function CardTitle({ className, ref, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ref, ...props }: React.ComponentProps<"div">) {
  return <div ref={ref} className={cn("text-sm text-neutral-fg-subtle", className)} {...props} />;
}

function CardContent({ className, ref, ...props }: React.ComponentProps<"div">) {
  return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />;
}

function CardFooter({ className, ref, ...props }: React.ComponentProps<"div">) {
  return <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}

export { Card, cardVariants, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
