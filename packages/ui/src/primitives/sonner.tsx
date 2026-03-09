import { Toaster as Sonner } from "sonner"
import { useTheme } from "../theme"

type ToasterProps = React.ComponentProps<typeof Sonner>

function Toaster({ ...props }: ToasterProps) {
  const { resolvedMode } = useTheme()

  return (
    <Sonner
      theme={resolvedMode as ToasterProps["theme"]}
      position="top-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-neutral-bg group-[.toaster]:text-neutral-fg group-[.toaster]:border-neutral-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-neutral-fg-subtle",
          actionButton:
            "group-[.toast]:bg-palette-primary group-[.toast]:text-palette-primary-fg",
          cancelButton:
            "group-[.toast]:bg-neutral-bg-dim group-[.toast]:text-neutral-fg-subtle",
          success:
            "group-[.toaster]:bg-neutral-bg group-[.toaster]:text-neutral-fg group-[.toaster]:border-palette-success/50 group-[.toaster]:shadow-lg [&>[data-icon]]:text-palette-success",
          error:
            "group-[.toaster]:bg-neutral-bg group-[.toaster]:text-neutral-fg group-[.toaster]:border-palette-danger/50 group-[.toaster]:shadow-lg [&>[data-icon]]:text-palette-danger",
          warning:
            "group-[.toaster]:bg-neutral-bg group-[.toaster]:text-neutral-fg group-[.toaster]:border-palette-warning/50 group-[.toaster]:shadow-lg [&>[data-icon]]:text-palette-warning",
          info: "group-[.toaster]:bg-neutral-bg group-[.toaster]:text-neutral-fg group-[.toaster]:border-palette-info/50 group-[.toaster]:shadow-lg [&>[data-icon]]:text-palette-info",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
