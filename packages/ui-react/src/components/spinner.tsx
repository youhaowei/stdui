import { cva, type VariantProps } from "class-variance-authority";

const colorVariants = {
  current: "text-current",
  primary: "text-palette-primary",
  secondary: "text-neutral-fg-subtle",
  warning: "text-palette-warning",
  danger: "text-palette-danger",
  success: "text-palette-success",
} as const;

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-5",
      lg: "size-8",
    },
    color: colorVariants,
  },
});

export interface SpinnerProps
  extends Omit<React.ComponentProps<"svg">, "color">, VariantProps<typeof spinnerVariants> {}

/**
 * Spinner - Loading indicator component
 *
 * A spinning loader with a transparent track and a spinning segment.
 * Supports size and color variants matching the Button component.
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner color="primary" size="lg" />
 * <Spinner color="danger" size="sm" />
 * ```
 */
export function Spinner({ className, size = "md", color = "current", ...props }: SpinnerProps) {
  return (
    <svg
      role="status"
      aria-label="Loading"
      data-slot="spinner"
      data-size={size}
      data-color={color}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={spinnerVariants({ size, color, className })}
      {...props}
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}
