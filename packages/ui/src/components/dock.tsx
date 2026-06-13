import type { ReactNode } from "react";
import { useCallback } from "react";

import { cn } from "../lib/utils";
import { Surface } from "../primitives/surface";

export type DockSide = "left" | "right" | "bottom";

/**
 * How the dock occupies space relative to its siblings:
 * - `separate` — in the layout flow; expanding reflows the siblings beside it.
 * - `overlay` — absolutely positioned against the edge, hovering over siblings
 *   without reflowing them. Same width/extent and edge inset as `separate`, so
 *   toggling mode never changes the panel's size or alignment.
 */
export type DockMode = "separate" | "overlay";

export interface DockProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** Which edge the dock is anchored to. */
  side: DockSide;
  /** Open (expanded) vs. collapsed to zero extent. */
  open: boolean;
  /** Presentation relative to siblings. @default "separate" */
  mode?: DockMode;
  /** Expanded width in px for left/right docks. Ignored for `bottom`. */
  width?: number;
  /** Expanded height in px for the `bottom` dock. Ignored for left/right. */
  height?: number;
  /**
   * Wrap the content in a floating `Surface` (rounded, shadow-lifted,
   * vibrancy). The default for a shell side panel — set `false` for a bare
   * collapsing container when the content brings its own chrome.
   *
   * @default true
   */
  surface?: boolean;
  /**
   * Allow the user to drag the inner edge to resize. Reports the new px extent
   * via `onResize`; the caller owns the value (controlled width/height).
   *
   * @default false
   */
  resizable?: boolean;
  /** New px extent during a resize drag (width for left/right, height for bottom). */
  onResize?: (extent: number) => void;
  /** Min px extent when resizing. @default 280 */
  minExtent?: number;
  /** Max px extent when resizing. @default 640 */
  maxExtent?: number;
  /** Dock content. */
  children: ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

const edgeMargin: Record<DockSide, string> = {
  left: "m-[0_0_var(--surface-inset)_var(--surface-inset)]",
  right: "m-[0_var(--surface-inset)_var(--surface-inset)_0]",
  bottom: "m-[var(--surface-inset)_var(--surface-inset)_var(--surface-inset)]",
};

/** Where the resize handle sits — the edge that faces the Stage. */
const handlePosition: Record<DockSide, string> = {
  left: "right-0 top-0 bottom-0 w-1 cursor-col-resize",
  right: "left-0 top-0 bottom-0 w-1 cursor-col-resize",
  bottom: "left-0 right-0 top-0 h-1 cursor-row-resize",
};

/** Overlay anchoring — pin to the dock's edge, fill the cross axis. */
const overlayAnchor: Record<DockSide, string> = {
  left: "absolute inset-y-0 left-0 z-30",
  right: "absolute inset-y-0 right-0 z-30",
  bottom: "absolute inset-x-0 bottom-0 z-30",
};

/** Wires a pointer-drag resize: tracks movement and reports the clamped extent. */
function beginResize(opts: {
  isHorizontal: boolean;
  startPos: number;
  startExtent: number;
  dir: 1 | -1;
  minExtent: number;
  maxExtent: number;
  onResize: (extent: number) => void;
}) {
  const { isHorizontal, startPos, startExtent, dir, minExtent, maxExtent, onResize } = opts;
  const onMove = (ev: PointerEvent) => {
    const pos = isHorizontal ? ev.clientX : ev.clientY;
    const delta = (pos - startPos) * dir;
    onResize(Math.min(maxExtent, Math.max(minExtent, startExtent + delta)));
  };
  const onUp = () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
}

/**
 * Dock — a collapsing edge panel for an app shell. Holds whatever a docked
 * region needs: navigation, an assistant, an appearance panel. Collapses to
 * zero extent with a transition, goes `inert` + `aria-hidden` when closed, and
 * can present either in-flow (`separate`) or floating over siblings (`overlay`)
 * with identical size and edge alignment in both modes.
 *
 * Presentational and generic — the caller owns open/collapsed state, the
 * mode, and (when `resizable`) the persisted extent. The host row must be
 * `relative` for `overlay` mode to anchor correctly.
 */
export function Dock({
  side,
  open,
  mode = "separate",
  width,
  height,
  surface = true,
  resizable = false,
  onResize,
  minExtent = 280,
  maxExtent = 640,
  className,
  children,
  ref,
  ...props
}: DockProps) {
  const isHorizontal = side === "left" || side === "right";
  const isOverlay = mode === "overlay";

  const extent = isHorizontal ? (width ?? "auto") : (height ?? "auto");

  // In `separate` mode, collapsing to 0 extent is what reflows siblings. In
  // `overlay` mode the panel is out of flow, so it stays at full extent and
  // visibility is owned by mount (caller renders it only when open).
  const resolvedExtent = isOverlay || open ? extent : 0;
  const collapseStyle = isHorizontal
    ? { width: resolvedExtent }
    : { height: resolvedExtent };

  const onHandleDown = useCallback(
    (e: React.PointerEvent) => {
      if (!resizable || !onResize) return;
      e.preventDefault();
      const startPos = isHorizontal ? e.clientX : e.clientY;
      const startExtent = typeof extent === "number" ? extent : 0;
      // A right/bottom dock grows when the inner edge is dragged toward the
      // Stage (left/up = larger); a left dock grows dragging right.
      const dir = side === "right" || side === "bottom" ? -1 : 1;
      beginResize({
        isHorizontal,
        startPos,
        startExtent,
        dir,
        minExtent,
        maxExtent,
        onResize,
      });
    },
    [resizable, onResize, isHorizontal, extent, side, minExtent, maxExtent],
  );

  // Body chrome:
  // - overlay: always an opaque, shadow-lifted, backdrop-blurred card, inset on
  //   every side and rounded — it floats over the Stage, so it must read as a
  //   distinct surface and stay legible regardless of `surface`.
  // - separate + surface: a vibrancy Surface, inset on the three outer edges
  //   (the inner edge meets the layout gap).
  // - separate + !surface: bare — the content brings its own chrome.
  let body: ReactNode;
  if (isOverlay) {
    body = (
      <Surface
        elevation="floating"
        className={cn(
          "flex min-h-0 flex-1 flex-col bg-neutral-bg/95 backdrop-blur supports-backdrop-filter:bg-neutral-bg/85",
          "m-[var(--surface-inset)]",
        )}
      >
        {children}
      </Surface>
    );
  } else if (surface) {
    body = (
      <Surface
        vibrancy
        className={cn("flex min-h-0 flex-1 flex-col", edgeMargin[side])}
      >
        {children}
      </Surface>
    );
  } else {
    body = children;
  }

  return (
    <div
      ref={ref}
      role="complementary"
      className={cn(
        "relative flex shrink-0 flex-col overflow-hidden",
        !isOverlay &&
          "transition-[width,height] duration-200 ease-in-out motion-reduce:transition-none",
        isOverlay && overlayAnchor[side],
        className,
      )}
      style={collapseStyle}
      aria-hidden={!open}
      inert={!open ? true : undefined}
      {...props}
    >
      {/* Resize handle on the Stage-facing edge. */}
      {resizable && open && (
        <div
          role="separator"
          aria-orientation={isHorizontal ? "vertical" : "horizontal"}
          aria-label="Resize panel"
          onPointerDown={onHandleDown}
          className={cn(
            "absolute z-10 hover:bg-neutral-border/60 active:bg-palette-primary/40",
            handlePosition[side],
          )}
        />
      )}
      {body}
    </div>
  );
}
