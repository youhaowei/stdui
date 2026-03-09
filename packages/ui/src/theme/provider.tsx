import { createContext, useContext, useEffect, useRef } from "react";
import { createThemeStore, resolveIsDark } from "./store";
import type { ThemeMode, ResolvedMode, ThemeOverrides } from "./tokens";

// -- Types -----------------------------------------------------------------

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedMode: ResolvedMode;
  isDark: boolean;
  overrides: ThemeOverrides;
  previewMode: ResolvedMode | null;
  setMode: (mode: ThemeMode) => void;
  setOverrides: (overrides: ThemeOverrides) => void;
  resetOverrides: () => void;
  setPreviewMode: (preview: ResolvedMode | null) => void;
}

interface StduiProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
}

// -- Context ---------------------------------------------------------------

const ThemeContext = createContext<ThemeContextValue | null>(null);

// -- Provider --------------------------------------------------------------

export function StduiProvider({ children, defaultMode, storageKey }: StduiProviderProps) {
  type ThemeStore = ReturnType<typeof createThemeStore>;
  const storeRef = useRef<ThemeStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createThemeStore({ storageKey });
  }

  const store = storeRef.current!;
  const state = store();

  // Set default mode on mount if provided
  useEffect(() => {
    if (defaultMode && state.mode === "system") {
      // Only apply default if no stored preference exists
      const key = `${storageKey ?? "stdui"}-theme`;
      try {
        if (!localStorage.getItem(key)) {
          state.setMode(defaultMode);
        }
      } catch {
        /* ignore */
      }
    }
  }, []);

  const isDark = resolveIsDark(state.mode, state.previewMode);

  const value: ThemeContextValue = {
    mode: state.mode,
    resolvedMode: isDark ? "dark" : "light",
    isDark,
    overrides: state.overrides,
    previewMode: state.previewMode,
    setMode: state.setMode,
    setOverrides: state.setOverrides,
    resetOverrides: state.resetOverrides,
    setPreviewMode: state.setPreviewMode,
  };

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

// -- Hook ------------------------------------------------------------------

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a StduiProvider");
  return ctx;
}
