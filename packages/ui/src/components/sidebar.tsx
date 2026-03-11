import { useState, useEffect, useCallback, createContext, useContext } from "react"
import type { ReactNode } from "react"
import { cn } from "../lib/utils"

// ---------- Context ----------

interface SidebarContextValue {
  collapsed: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  toggle: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

// ---------- Sidebar ----------

export interface SidebarProps {
  /** Slot for logo/org switcher area at the top */
  header?: ReactNode
  /** Slot for settings/user area at the bottom */
  footer?: ReactNode
  /** Nav items (SidebarItem components) */
  children: ReactNode
  /** localStorage key for collapse persistence */
  storageKey?: string
  /** Keyboard shortcut to toggle (default: "\\") — combined with Cmd/Ctrl */
  shortcutKey?: string
  /** Expanded width in px */
  expandedWidth?: number
  /** Collapsed width in px */
  collapsedWidth?: number
  className?: string
}

export function Sidebar({
  header,
  footer,
  children,
  storageKey = "stdui-sidebar-collapsed",
  shortcutKey = "\\",
  expandedWidth = 200,
  collapsedWidth = 68,
  className,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  // Sync from localStorage after mount to avoid SSR hydration mismatch
  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey) === "true") setCollapsed(true)
    } catch {}
  }, [storageKey])

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      try { localStorage.setItem(storageKey, String(next)) } catch {}
      return next
    })
  }, [storageKey])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === shortcutKey) {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggle, shortcutKey])

  return (
    <SidebarContext value={{ collapsed, toggle }}>
      <nav
        aria-label="Main navigation"
        style={{ width: collapsed ? collapsedWidth : expandedWidth }}
        className={cn(
          "shrink-0 flex h-full flex-col overflow-hidden transition-[width] duration-200 ease-in-out",
          "bg-transparent",
          className,
        )}
      >
        {/* Header slot */}
        {header && (
          <div className={cn("shrink-0 p-2", collapsed && "flex flex-col items-center")}>
            {header}
          </div>
        )}

        {/* Nav items */}
        <div className="flex-1 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2 py-2">
          {children}
        </div>

        {/* Footer slot */}
        {footer && (
          <div className={cn("shrink-0 p-2", collapsed && "flex flex-col items-center")}>
            {footer}
          </div>
        )}
      </nav>
    </SidebarContext>
  )
}
