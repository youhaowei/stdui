import { useState, createContext, useContext, useCallback } from "react"
import type { ReactNode } from "react"
import { cn } from "../lib/utils"
import { Surface } from "../primitives/surface"
import { TooltipProvider } from "../primitives/tooltip"
import { StduiProvider } from "../theme/provider"
import { ThemePanel } from "../views/theme-panel"

// Re-use existing stdui Sheet for mobile drawer
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../primitives/sheet"

// ---------- AppShell Context ----------

interface AppShellContextValue {
  themePanelOpen: boolean
  toggleThemePanel: () => void
}

const AppShellContext = createContext<AppShellContextValue>({
  themePanelOpen: false,
  toggleThemePanel: () => {},
})

export function useAppShell() {
  return useContext(AppShellContext)
}

// ---------- AppShell ----------

export interface AppShellProps {
  /** Sidebar element (Sidebar component) */
  sidebar: ReactNode
  /** Optional top bar element (TopBar component) */
  topBar?: ReactNode
  /** Main content */
  children: ReactNode
  /** Mobile header content (shown on small screens when sidebar is a drawer) */
  mobileHeader?: ReactNode
  /** Additional className for the Surface content area */
  surfaceClassName?: string
  /** localStorage prefix for theme persistence (default: "stdui") */
  themeStorageKey?: string
  className?: string
}

export function AppShell({
  sidebar,
  topBar,
  children,
  mobileHeader,
  surfaceClassName,
  themeStorageKey,
  className,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [themePanelOpen, setThemePanelOpen] = useState(false)

  const toggleThemePanel = useCallback(() => {
    setThemePanelOpen((v) => !v)
  }, [])

  return (
    <StduiProvider storageKey={themeStorageKey}>
    <AppShellContext value={{ themePanelOpen, toggleThemePanel }}>
    <TooltipProvider>
    <div className={cn("flex h-dvh overflow-hidden [background:var(--shell-bg)] pb-2 pr-2", className)}>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex">
        {sidebar}
      </aside>

      {/* Mobile sheet sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* Mobile header — shown on small screens */}
          <header className="flex h-10 items-center gap-2 border-b border-neutral-border bg-shell-bg px-3 md:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex items-center justify-center size-8 rounded-md text-neutral-fg-subtle hover:bg-neutral-bg-muted transition-colors"
              aria-label="Open menu"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {mobileHeader}
          </header>

          {/* Top bar — desktop only */}
          {topBar && (
            <div className="hidden md:block">
              {topBar}
            </div>
          )}

          {/* Main content row — Surface + optional ThemePanel */}
          <div className="flex-1 flex gap-2 min-h-0 overflow-hidden">
            <Surface
              elevation="raised"
              role="main"
              className={cn(
                "flex flex-col min-w-0 flex-1 overflow-y-auto [contain:paint]",
                surfaceClassName,
              )}
            >
              {children}
            </Surface>

            {/* Theme panel — slides in from right */}
            <ThemePanel
              isOpen={themePanelOpen}
              onClose={() => setThemePanelOpen(false)}
            />
          </div>
        </div>

        <SheetContent side="left" className="w-[200px] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          {sidebar}
        </SheetContent>
      </Sheet>
    </div>
    </TooltipProvider>
    </AppShellContext>
    </StduiProvider>
  )
}
