import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "../lib/utils"
import { Button as PrimitiveButton } from "../primitives/button"
import { Spinner } from "./spinner"

export interface ButtonProps {
  label: string
  onClick?: () => void
  /**
   * Button style variant - controls the visual appearance (solid, outline, ghost, link)
   */
  variant?: "solid" | "outline" | "ghost" | "link"
  /**
   * Button color - controls the color scheme
   */
  color?: "primary" | "secondary" | "warning" | "danger" | "success"
  icon?: LucideIcon
  size?: "sm" | "md" | "lg"
  asChild?: boolean
  children?: ReactNode
  className?: string
  tooltip?: string
  /**
   * Icon-only mode - when true, shows only icon (if available) with sr-only label.
   * Automatically uses icon size variant based on size prop.
   */
  iconOnly?: boolean
  /**
   * Whether the button is disabled
   */
  disabled?: boolean
  /**
   * Loading state - disables button and shows spinner.
   * Replaces icon if present, or shows spinner alongside text.
   */
  loading?: boolean
}

/**
 * ItemAction extends ButtonProps with grouping and nesting support for ActionGroup
 */
export interface ItemAction extends ButtonProps {
  /**
   * Optional href for link buttons - handled by ActionGroup component
   */
  href?: string
  /**
   * Optional group identifier - actions with the same group value will be visually connected
   * as a button group (no gaps, connected borders). Actions without a group remain separate.
   */
  group?: string
  /**
   * Optional nested actions - renders as a dropdown menu.
   * When present, this action becomes a dropdown trigger.
   */
  actions?: ItemAction[]
}

type ButtonSize = "sm" | "default" | "lg" | "icon"

/**
 * Button - Enhanced button component with icon and icon-only mode support
 *
 * Provides a high-level API for rendering buttons with icons, labels, and tooltips.
 *
 * Features:
 * - Separated variant (style) and color (intent) props for flexible styling
 * - Icon + label rendering with automatic padding adjustment
 * - Icon-only mode (shows icon with sr-only label)
 * - Tooltip support
 * - asChild prop for rendering as Link or other components (Radix Slot pattern)
 * - Loading state support
 *
 * @example
 * ```tsx
 * <Button label="Save" onClick={handleSave} icon={Save} />
 * <Button label="Delete" onClick={handleDelete} icon={Trash2} color="danger" />
 * <Button label="Remove" variant="outline" color="danger" />
 * <Button label="Delete" icon={Trash2} color="danger" iconOnly />
 * <Button label="Saving" loading />
 * ```
 */
export function Button({
  label,
  onClick,
  variant = "solid",
  color = "primary",
  icon: Icon,
  size,
  asChild,
  children,
  className,
  tooltip,
  iconOnly = false,
  disabled,
  loading = false,
}: ButtonProps) {
  const shouldShowLabel = !iconOnly || !Icon

  // Map button size to spinner size (default to "md")
  const spinnerSize = size || "md"

  const buttonContent = children || (
    <>
      {loading ? (
        <Spinner size={spinnerSize} aria-hidden />
      ) : (
        Icon && <Icon aria-hidden />
      )}
      {shouldShowLabel ? label : <span className="sr-only">{label}</span>}
    </>
  )

  const getButtonSize = (): ButtonSize => {
    // If iconOnly mode with an icon or loading spinner, use icon size variant
    if (iconOnly && (Icon || loading)) {
      return "icon"
    }
    // Map size prop to primitive sizes
    if (size === "sm") return "sm"
    if (size === "lg") return "lg"
    return "default"
  }

  const buttonSize = getButtonSize()

  return (
    <PrimitiveButton
      variant={variant}
      color={color}
      size={buttonSize}
      className={cn("flex items-center justify-center", className)}
      title={tooltip || (iconOnly ? label : undefined)}
      aria-label={iconOnly ? label : undefined}
      onClick={onClick}
      asChild={asChild}
      disabled={disabled || loading}
    >
      {buttonContent}
    </PrimitiveButton>
  )
}
