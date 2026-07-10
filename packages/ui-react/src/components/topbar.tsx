import type { ReactNode } from "react";
import { cn } from "../lib/utils";

// ---------- TopBar ----------

export interface TopBarProps {
  /** Left section — title, back button, etc. */
  left?: ReactNode;
  /** Center section — filters, search, etc. */
  center?: ReactNode;
  /** Right section — actions, buttons, etc. */
  right?: ReactNode;
  /** Height in px (default: 40) */
  height?: number;
  className?: string;
}

export function TopBar({ left, center, right, height = 40, className }: TopBarProps) {
  return (
    <header
      style={{ height }}
      className={cn("relative flex shrink-0 items-center select-none", className)}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">{left}</div>
      {center && <div>{center}</div>}
      <div className="flex items-center gap-0.5 shrink-0">{right}</div>
    </header>
  );
}
