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
  /** Directions that scroll. Each gets a scrollbar and edge fades. */
  orientation?: "vertical" | "horizontal" | "both";
  /** Classes for the scrolling viewport. */
  viewportClassName?: string;
  /** The scrolling element, for virtualizers and scroll measurement. */
  viewportRef?: React.Ref<HTMLDivElement>;
  /** Scroll events from the viewport, which is the element that scrolls. */
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  /**
   * Height of sticky content at the top of the viewport, such as a table
   * header. The top fade and the vertical scrollbar start below it.
   */
  topInset?: number;
  /** Fade colour; match the surface behind the content. */
  fadeClassName?: string;
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
  ...props
}: ScrollAreaProps) {
  const vertical = orientation !== "horizontal";
  const horizontal = orientation !== "vertical";
  return (
    <ScrollAreaPrimitive.Root className={cn("relative overflow-hidden", className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        onScroll={onScroll}
        className={cn("h-full w-full rounded-[inherit]", viewportClassName)}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {vertical && (
        <>
          <ScrollBar
            className="my-1 mr-0.5"
            style={topInset ? { marginTop: topInset } : undefined}
          />
          <div
            aria-hidden
            className={cn(FADE_TOP, fadeClassName)}
            style={topInset ? { top: topInset } : undefined}
          />
          <div aria-hidden className={cn(FADE_BOTTOM, fadeClassName)} />
        </>
      )}
      {horizontal && (
        <>
          <ScrollBar orientation="horizontal" className="mx-1 mb-0.5" />
          <div aria-hidden className={cn(FADE_LEFT, fadeClassName)} />
          <div aria-hidden className={cn(FADE_RIGHT, fadeClassName)} />
        </>
      )}
    </ScrollAreaPrimitive.Root>
  );
}

/**
 * Thin scrollbar for a Base UI scroll area root. It stays out of layout and
 * shows only while the area scrolls or the pointer is on the bar, so edge
 * fades do the everyday job of marking more content.
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
        "hover:opacity-100 hover:delay-0 data-[scrolling]:opacity-100 data-[scrolling]:delay-0 data-[scrolling]:duration-100",
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
