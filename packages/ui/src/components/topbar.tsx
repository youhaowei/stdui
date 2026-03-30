import type { ReactNode } from "react"
import { cn } from "../lib/utils"

// ---------- TopBar ----------

export interface TopBarProps {
  /** Left section — title, back button, etc. */
  left?: ReactNode
  /** Center section — filters, search, etc. */
  center?: ReactNode
  /** Right section — actions, buttons, etc. */
  right?: ReactNode
  /** Enable native window drag region. Renders an overlay with the `drag-region`
   *  class and `data-drag-region` attribute that consumers can target with
   *  platform-specific styles (e.g. `-webkit-app-region: drag`). */
  dragRegion?: boolean
  /** Height in px (default: 40) */
  height?: number
  className?: string
}

export function TopBar({
  left,
  center,
  right,
  dragRegion = false,
  height = 40,
  className,
}: TopBarProps) {
  return (
    <header
      style={{ height }}
      className={cn(
        "relative z-50 flex shrink-0 items-center gap-3 px-3 select-none",
        className,
      )}
    >
      {/* Drag overlay — consumers target .drag-region or [data-drag-region]
         with platform-specific styles. */}
      {dragRegion && (
        <div
          className="absolute inset-0 z-0 drag-region"
          data-drag-region=""
        />
      )}

      {/* Left */}
      <div className="flex items-center gap-2 min-w-0 flex-1 relative z-10 pointer-events-none [&_button]:pointer-events-auto [&_input]:pointer-events-auto [&_a]:pointer-events-auto">
        {left}
      </div>

      {/* Center */}
      {center && (
        <div className="relative z-10 pointer-events-auto">
          {center}
        </div>
      )}

      {/* Right */}
      <div className="flex items-center gap-0.5 shrink-0 relative z-10 pointer-events-none [&_button]:pointer-events-auto [&_a]:pointer-events-auto [&_input]:pointer-events-auto">
        {right}
      </div>
    </header>
  )
}
