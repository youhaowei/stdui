import type { ReactNode } from "react"
import { cn } from "../lib/utils"
import { Surface, type SurfaceElevation } from "../primitives/surface"

export interface PanelProps extends React.ComponentProps<"div"> {
  /**
   * The elevation variant for the panel surface.
   * Controls visual depth and shadow effects.
   *
   * @default "raised"
   */
  elevation?: SurfaceElevation
  /** Optional header content (fixed at top, doesn't scroll) */
  header?: ReactNode
  /** Scrollable main content */
  children: ReactNode
  /** Optional footer content (fixed at bottom, doesn't scroll) */
  footer?: ReactNode
}

/**
 * Panel - Reusable panel component with fixed header/footer and scrollable content
 *
 * Provides a consistent panel structure with standardized elevation using Surface:
 * - Optional fixed header at the top
 * - Scrollable content area in the middle
 * - Optional fixed footer at the bottom
 *
 * @example
 * ```tsx
 * <Panel
 *   header={<h2>Controls</h2>}
 *   footer={<Button>Apply</Button>}
 * >
 *   <div>Scrollable content here</div>
 * </Panel>
 * ```
 */
export function Panel({
  elevation = "raised",
  header,
  children,
  footer,
  className,
  ref,
  ...props
}: PanelProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <Surface
      ref={ref}
      elevation={elevation}
      className={cn("flex h-full flex-col", className)}
      {...props}
    >
      {/* Fixed header */}
      {header && (
        <div className="shrink-0 border-b border-neutral-border/60">
          {header}
        </div>
      )}

      {/* Scrollable content */}
      <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>

      {/* Fixed footer */}
      {footer && (
        <div className="shrink-0 border-t border-neutral-border/60">
          {footer}
        </div>
      )}
    </Surface>
  )
}

export interface PanelSectionProps extends React.ComponentProps<"div"> {
  /** Optional section title */
  title?: string
  /** Optional section description */
  description?: string
  /** Section content */
  children: ReactNode
}

/**
 * PanelSection - Section divider component for use within Panel or standalone
 *
 * Provides consistent section styling with optional title/description and
 * automatic border-b dividers between sections.
 *
 * @example
 * ```tsx
 * <Panel>
 *   <PanelSection title="General Settings" description="Basic configuration options">
 *     <div>Settings content</div>
 *   </PanelSection>
 *   <PanelSection title="Advanced">
 *     <div>Advanced options</div>
 *   </PanelSection>
 * </Panel>
 * ```
 */
export function PanelSection({
  title,
  description,
  children,
  className,
  ...props
}: PanelSectionProps) {
  return (
    <div
      className={cn(
        "border-neutral-border/60 [&:not(:last-child)]:border-b",
        className,
      )}
      {...props}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-base font-semibold text-neutral-fg">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-neutral-fg-subtle">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
