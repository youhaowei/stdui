import * as React from "react";
import { cn } from "../lib/utils";
import { Skeleton } from "../primitives/skeleton";
import { Surface, type SurfaceProps } from "../primitives/surface";
import { ButtonGroup, type ItemAction } from "./button-group";

export interface SectionProps extends Omit<SurfaceProps, "children"> {
  /** Section title */
  title: string;
  /** Optional description or metadata */
  description?: string;
  /** Optional actions shown on the right of header */
  actions?: ItemAction[];
  /** Optional custom element on right side of header (alternative to actions) */
  headerRight?: React.ReactNode;
  /** Section content */
  children: React.ReactNode;
  /** Show loading skeleton instead of content */
  isLoading?: boolean;
  /** Height of loading skeleton (default: 200px) */
  loadingHeight?: number;
}

/**
 * Section - Standardized section with title, description, and content
 *
 * Provides consistent layout for sections with:
 * - Title (text-sm font-semibold)
 * - Optional description (text-xs muted)
 * - Optional action buttons using ButtonGroup (right-aligned)
 * - Built on Surface component for consistent elevation
 *
 * @example
 * ```tsx
 * <Section
 *   title="Projects"
 *   description="Items in this collection"
 *   actions={[
 *     { label: 'Add join', onClick: handleAddJoin, icon: Plus }
 *   ]}
 * >
 *   <ItemList items={items} />
 * </Section>
 * ```
 */
export function Section({
  title,
  description,
  actions,
  headerRight,
  children,
  className,
  elevation = "raised",
  isLoading = false,
  loadingHeight = 200,
  ...surfaceProps
}: SectionProps) {
  return (
    <Surface elevation={elevation} className={cn("space-y-3 p-6", className)} {...surfaceProps}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-fg">{title}</p>
          {description && <p className="text-xs text-neutral-fg-subtle">{description}</p>}
        </div>
        {/* Right side: headerRight takes precedence, falls back to actions */}
        {headerRight ?? (actions && actions.length > 0 && <ButtonGroup actions={actions} />)}
      </div>

      {/* Content or Loading Skeleton */}
      {isLoading ? (
        <Skeleton className="w-full rounded-xl" style={{ height: loadingHeight }} />
      ) : (
        children
      )}
    </Surface>
  );
}
