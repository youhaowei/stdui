import type { ReactNode, ElementType } from "react";
import { cn } from "../lib/utils";
import { Tooltip } from "./tooltip";
import { useSidebar } from "./sidebar";

// ---------- SidebarItem ----------

export interface SidebarItemProps {
  /** Display label */
  label: string;
  /** Icon component (e.g., Lucide icon) */
  icon?: ElementType<{ className?: string }>;
  /** Whether this item is currently active */
  active?: boolean;
  /** Optional badge (e.g., count indicator) */
  badge?: ReactNode;
  /** Render as a different element (e.g., router Link) */
  as?: ElementType;
  className?: string;
  /** Pass-through props for the `as` component (e.g., `to` for router Link) */
  [key: string]: unknown;
}

export function SidebarItem({
  label,
  icon: Icon,
  active = false,
  badge,
  as: Comp = "a",
  className,
  ...rest
}: SidebarItemProps) {
  const { collapsed } = useSidebar();

  const item = (
    <Comp
      className={cn(
        "relative flex items-center gap-2.5 w-full rounded-lg text-[13px] transition-all duration-150",
        collapsed ? "justify-center px-0 py-2" : "px-2.5 py-[7px]",
        active
          ? "text-neutral-fg font-medium"
          : "text-neutral-fg/50 hover:text-neutral-fg/80 hover:bg-white/30 dark:hover:bg-white/5",
        className,
      )}
      {...rest}
    >
      {Icon && <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />}
      <span className={cn("truncate", collapsed && "sr-only")}>{label}</span>
      {badge && !collapsed && badge}
    </Comp>
  );

  if (collapsed) {
    return (
      <Tooltip content={label} side="right">
        {item}
      </Tooltip>
    );
  }

  return item;
}
