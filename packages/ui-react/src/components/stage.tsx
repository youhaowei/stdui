import type { ReactNode } from "react";

import { cn } from "../lib/utils";
import { Surface, type SurfaceElevation } from "../primitives/surface";

export interface StageProps extends React.ComponentProps<"div"> {
  /**
   * Visual depth of the stage surface.
   *
   * @default "raised"
   */
  elevation?: SurfaceElevation;
  /** Stage content — rendered inside a flex-column `<main>`. */
  children: ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Stage — the primary content surface of an app shell. The one always-present,
 * flex-filling region the rest of the layout (docks, top bar) flanks. Holds the
 * page or artifact; side panels are `Dock`s, not Stages.
 *
 * Presentational and generic: a flex-filling `Surface` with a min width so the
 * content never collapses below readability, an isolation context for stacked
 * overlays inside it, and an inner scroll column. Apps own the role ("this is
 * the dashboard area"); the primitive only owns the shape.
 */
export function Stage({
  elevation = "raised",
  children,
  className,
  ref,
  ...props
}: StageProps) {
  return (
    <Surface
      ref={ref}
      elevation={elevation}
      className={cn(
        "relative isolate flex min-w-0 flex-1 flex-col overflow-hidden",
        className,
      )}
      {...props}
    >
      <main className="flex min-h-0 flex-1 flex-col overflow-auto">
        {children}
      </main>
    </Surface>
  );
}
