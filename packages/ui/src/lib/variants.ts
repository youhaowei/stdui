export const colorVariants = {
  current: "text-current",
  primary: "text-palette-primary",
  secondary: "text-palette-secondary",
  success: "text-palette-success",
  danger: "text-palette-danger",
  warning: "text-palette-warning",
  info: "text-palette-info",
} as const;

export type ColorVariant = keyof typeof colorVariants;

export const sizeScale = ["xs", "sm", "default", "lg"] as const;

export type SizeVariant = (typeof sizeScale)[number];
