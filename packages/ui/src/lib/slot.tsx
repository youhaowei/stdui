import * as React from "react"
import { cn } from "./utils"

/**
 * Minimal Slot implementation that replaces @radix-ui/react-slot.
 * Merges parent props onto a single child element (className, style, event handlers, ref).
 */
function Slot({
  children,
  ref,
  ...props
}: React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }) {
  if (!React.isValidElement(children)) {
    return null
  }

  const childProps = children.props as Record<string, unknown>

  // Merge className
  const mergedClassName = cn(
    props.className as string | undefined,
    childProps.className as string | undefined,
  )

  // Merge style
  const mergedStyle = {
    ...(props.style as React.CSSProperties | undefined),
    ...(childProps.style as React.CSSProperties | undefined),
  }

  // Merge event handlers and other props
  const mergedProps: Record<string, unknown> = { ...props }
  for (const key of Object.keys(childProps)) {
    if (key === "className" || key === "style") continue
    if (key in mergedProps && typeof mergedProps[key] === "function" && typeof childProps[key] === "function") {
      const parentHandler = mergedProps[key] as (...args: unknown[]) => void
      const childHandler = childProps[key] as (...args: unknown[]) => void
      mergedProps[key] = (...args: unknown[]) => {
        childHandler(...args)
        parentHandler(...args)
      }
    } else {
      mergedProps[key] = childProps[key]
    }
  }

  return React.cloneElement(children, {
    ...mergedProps,
    className: mergedClassName || undefined,
    style: Object.keys(mergedStyle).length > 0 ? mergedStyle : undefined,
    ref,
  } as React.HTMLAttributes<HTMLElement>)
}

export { Slot }
