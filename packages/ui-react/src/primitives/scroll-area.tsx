import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";

import { cn } from "../lib/utils";

// Fades read the overflow attributes Base UI sets on the root. The direct-child
// selector keeps a nested scroll area's state from leaking into these fades.
const FADE =
  "pointer-events-none absolute z-10 opacity-0 transition-opacity duration-150 motion-reduce:transition-none";
const FADE_TOP = `${FADE} inset-x-0 top-0 h-6 bg-linear-to-b to-transparent [[data-overflow-y-start]>&]:opacity-100`;
const FADE_BOTTOM = `${FADE} inset-x-0 bottom-0 h-6 bg-linear-to-t to-transparent [[data-overflow-y-end]>&]:opacity-100`;
const FADE_LEFT = `${FADE} inset-y-0 left-0 w-6 bg-linear-to-r to-transparent [[data-overflow-x-start]>&]:opacity-100`;
const FADE_RIGHT = `${FADE} inset-y-0 right-0 w-6 bg-linear-to-l to-transparent [[data-overflow-x-end]>&]:opacity-100`;

interface ScrollAreaProps extends Omit<
  React.ComponentProps<typeof ScrollAreaPrimitive.Root>,
  "onScroll"
> {
  /**
   * Directions that get a scrollbar and edge fades. The viewport still
   * scrolls natively on both axes.
   */
  orientation?: "vertical" | "horizontal" | "both";
  /** Classes for the scrolling viewport. */
  viewportClassName?: string;
  /** The scrolling element, for virtualizers and scroll measurement. */
  viewportRef?: React.Ref<HTMLDivElement>;
  /** Scroll events from the viewport, which is the element that scrolls. */
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  /**
   * Height of sticky content at the top of the viewport, such as a table
   * header. The vertical scrollbar starts below it, and the top fade extends
   * under it so content dissolves as it scrolls behind. Content that should
   * sit above the fade needs a z-index above 10. Vertical orientations only.
   */
  topInset?: number;
  /** Fade colour; match the surface behind the content. */
  fadeClassName?: string;
  /**
   * "overlay" (default) shows the thin bar on hover and while scrolling.
   * "none" leaves only the edge fades, for strips too small for a bar.
   */
  scrollbar?: "overlay" | "none";
}

/**
 * Scroll area with a thin scrollbar that shows while scrolling and fades on
 * each edge that has more content past it.
 */
function ScrollArea({
  className,
  children,
  orientation = "vertical",
  viewportClassName,
  viewportRef,
  onScroll,
  topInset = 0,
  fadeClassName = "from-neutral-bg",
  scrollbar = "overlay",
  ...props
}: ScrollAreaProps) {
  const vertical = orientation !== "horizontal";
  const horizontal = orientation !== "vertical";
  return (
    <ScrollAreaPrimitive.Root
      // flex-col with min-h-0 on the viewport lets a root sized only by
      // max-height scroll; a percentage height would resolve to auto there.
      // isolate keeps the fades and bars from stacking against the page.
      className={cn("relative isolate flex flex-col overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        onScroll={onScroll}
        className={cn("h-full min-h-0 w-full rounded-[inherit]", viewportClassName)}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {vertical && (
        <>
          {scrollbar === "overlay" && (
            <ScrollBar
              // In "both", stop short of the horizontal bar so the two tracks
              // don't overlap in the corner.
              className={cn("my-1 mr-0.5", horizontal && "mb-2.5")}
              style={topInset ? { marginTop: topInset + 4 } : undefined}
            />
          )}
          <div
            aria-hidden
            className={cn(FADE_TOP, fadeClassName)}
            style={topInset ? { height: topInset + 24 } : undefined}
          />
          <div aria-hidden className={cn(FADE_BOTTOM, fadeClassName)} />
        </>
      )}
      {horizontal && (
        <>
          {scrollbar === "overlay" && (
            <ScrollBar
              orientation="horizontal"
              className={cn("mx-1 mb-0.5", vertical && "mr-2.5")}
            />
          )}
          <div aria-hidden className={cn(FADE_LEFT, fadeClassName)} />
          <div aria-hidden className={cn(FADE_RIGHT, fadeClassName)} />
        </>
      )}
    </ScrollAreaPrimitive.Root>
  );
}

/**
 * Thin scrollbar for a Base UI scroll area root. It stays out of layout and
 * shows faintly while the pointer is over the area (after a short delay, so
 * passing over doesn't flash it) and fully while the area scrolls.
 */
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Scrollbar>) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      orientation={orientation}
      className={cn(
        "z-20 flex touch-none rounded-full p-0.5 opacity-0 transition-opacity delay-300 duration-300 select-none motion-reduce:transition-none",
        // Hover shows the bar at 70% and scrolling at full strength. The
        // targets differ on purpose: with the same target, a delayed hover
        // transition already under way would also delay the scroll reveal.
        "data-[hovering]:opacity-70 data-[hovering]:delay-150 data-[hovering]:duration-200 data-[scrolling]:opacity-100 data-[scrolling]:delay-0 data-[scrolling]:duration-100",
        orientation === "vertical" ? "w-2" : "h-2 flex-col",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        className={cn(
          "rounded-full bg-neutral-fg/20 transition-colors hover:bg-neutral-fg/35",
          orientation === "vertical" ? "w-full" : "h-full",
        )}
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export { ScrollArea, ScrollBar };
export type { ScrollAreaProps };
