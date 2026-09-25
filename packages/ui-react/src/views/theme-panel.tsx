/**
 * ThemePanel — the Appearance panel: theme mode, a grid of curated style
 * presets, and import/copy of portable themes. There is no free colour
 * picking; every look is a preset that sets both light and dark.
 */

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  THEME_PRESETS,
  describeAdjustments,
  exportPreset,
  importTheme,
  presetSwatch,
  selectedPreset,
  type ResolvedMode,
  type ThemeMode,
  type ThemePreset,
} from "@wystack/ui-core";
import {
  CheckIcon,
  CloseIcon,
  CopyIcon,
  DarkModeIcon,
  ImportIcon,
  LightModeIcon,
  ResetIcon,
  SystemModeIcon,
} from "../icons";
import { cn } from "../lib/utils";
import { Button } from "../primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../primitives/dialog";
import { Surface } from "../primitives/surface";
import { Textarea } from "../primitives/textarea";
import { useTheme } from "../theme/provider";

const MODE_OPTIONS: { value: ThemeMode; icon: typeof LightModeIcon; label: string }[] = [
  { value: "system", icon: SystemModeIcon, label: "System" },
  { value: "light", icon: LightModeIcon, label: "Light" },
  { value: "dark", icon: DarkModeIcon, label: "Dark" },
];

const DEFAULT_PRESET_ID = "default";
const COPY_FEEDBACK_MS = 1500;

export interface ThemePanelProps {
  isOpen: boolean;
  /** Closes the panel. Ignored when `inline`, which has no close button. */
  onClose?: () => void;
  /**
   * Render without the standalone Surface chrome and fixed width — for hosting
   * inside a Dock (or another shell slot) that owns the panel's surface and
   * size. Default is the self-contained floating panel.
   */
  bare?: boolean;
  /**
   * Render as one section of a larger page, such as a settings page that
   * names the section itself: no title row or close button, no scroll area or
   * padding of its own, Reset beside Copy theme, and the style grid widens to
   * one row when its container has room. Implies `bare`.
   */
  inline?: boolean;
}

export function ThemePanel({ isOpen, onClose, bare = false, inline = false }: ThemePanelProps) {
  const {
    mode,
    overrides,
    importedPresets,
    presetId,
    setMode,
    setOverrides,
    resetOverrides,
    addImportedPreset,
  } = useTheme();
  const [importOpen, setImportOpen] = useState(false);
  const styleLabelId = useId();
  const modeLabelId = useId();

  const presets = useMemo(() => [...THEME_PRESETS, ...importedPresets], [importedPresets]);
  // Persisted overrides that match no preset leave the grid with nothing selected.
  const selected = useMemo(
    () => selectedPreset(overrides, presetId, presets),
    [overrides, presetId, presets],
  );
  const [storageFailed, setStorageFailed] = useState(false);
  const [copyState, copy] = useCopyFeedback();

  const applyImport = useCallback(
    (preset: ThemePreset) => {
      setStorageFailed(!addImportedPreset(preset).persisted);
      setOverrides(preset.overrides, preset.id);
      setImportOpen(false);
    },
    [addImportedPreset, setOverrides],
  );

  if (!isOpen) return null;

  const resetButton = selected?.id !== DEFAULT_PRESET_ID && (
    <Button
      variant="ghost"
      size={inline ? "xs" : "icon"}
      className={cn("shrink-0 text-neutral-fg-subtle hover:text-neutral-fg", !inline && "h-6 w-6")}
      onClick={resetOverrides}
      aria-label="Reset to Default"
      title="Reset to Default"
    >
      <ResetIcon className={inline ? undefined : "h-3.5 w-3.5"} />
      {inline && "Reset"}
    </Button>
  );

  const controls = (
    <div className={inline ? "space-y-5 text-sm" : "p-3 space-y-5"}>
      <div>
        <SectionLabel id={modeLabelId}>Theme</SectionLabel>
        <div className="flex gap-1 mt-1.5" role="group" aria-labelledby={modeLabelId}>
          {MODE_OPTIONS.map(({ value, icon: Icon, label }) => (
            <Button
              key={value}
              variant={mode === value ? "solid" : "outline"}
              color={mode === value ? "primary" : "secondary"}
              size="sm"
              className="flex-1 gap-1.5"
              aria-pressed={mode === value}
              onClick={() => setMode(value)}
            >
              <Icon className="h-3 w-3" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className={inline ? "@container" : undefined}>
        <div className="flex items-center gap-1">
          <SectionLabel id={styleLabelId} className="flex-1">
            Style
          </SectionLabel>
          {inline && resetButton}
          <Button
            variant="ghost"
            size="xs"
            className="text-neutral-fg-subtle hover:text-neutral-fg"
            disabled={!selected}
            title={selected ? `Copy ${selected.name} as text` : "Pick a style to copy it"}
            onClick={() => selected && copy(exportPreset(selected))}
          >
            {copyState === "copied" ? <CheckIcon /> : <CopyIcon />}
            {copyState === "copied"
              ? "Copied"
              : copyState === "failed"
                ? "Couldn't copy"
                : "Copy theme"}
          </Button>
          <Button
            variant="ghost"
            size="xs"
            className="-mr-1.5 text-neutral-fg-subtle hover:text-neutral-fg"
            aria-haspopup="dialog"
            onClick={() => setImportOpen(true)}
          >
            <ImportIcon />
            Import theme…
          </Button>
        </div>
        <div
          className={cn("mt-2 grid grid-cols-3 gap-x-2 gap-y-3", inline && "@lg:grid-cols-6")}
          role="group"
          aria-labelledby={styleLabelId}
        >
          {presets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              pressed={selected?.id === preset.id}
              onSelect={() => setOverrides(preset.overrides, preset.id)}
            />
          ))}
        </div>
        {storageFailed && (
          <p className="mt-3 text-xs text-neutral-fg-subtle" role="status">
            Imported styles can't be saved here, so they last until you close the app.
          </p>
        )}
      </div>
    </div>
  );

  const dialog = (
    <ImportThemeDialog open={importOpen} onOpenChange={setImportOpen} onApply={applyImport} />
  );

  if (inline) {
    return (
      <div className="select-none">
        {controls}
        {dialog}
      </div>
    );
  }

  const content = (
    <>
      <div className="flex items-center h-10 px-3 gap-2 shrink-0">
        <h2 className="text-sm font-semibold text-neutral-fg flex-1 select-none">Appearance</h2>
        {resetButton}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 text-neutral-fg-subtle hover:text-neutral-fg"
            onClick={onClose}
            aria-label="Close theme panel"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 text-sm">{controls}</div>

      {dialog}
    </>
  );

  if (bare) {
    return <div className="flex h-full min-h-0 flex-col select-none">{content}</div>;
  }

  return (
    <Surface
      elevation="raised"
      className="flex-shrink-0 flex flex-col select-none w-72 animate-[panel-in_200ms_ease-out] motion-reduce:animate-none"
    >
      {content}
    </Surface>
  );
}

// ── Preset card ──────────────────────────────────────────────────────────────

function PresetCard({
  preset,
  pressed,
  onSelect,
}: {
  preset: ThemePreset;
  pressed?: boolean;
  /** Omit for a static preview (the import dialog). */
  onSelect?: () => void;
}) {
  const note = describeAdjustments(preset.adjustments);
  const body = (
    <>
      <PresetThumbnail preset={preset} pressed={pressed} />
      <span
        className={cn(
          "truncate px-0.5 text-xs text-neutral-fg-subtle transition-colors duration-150 motion-reduce:transition-none",
          onSelect && "group-hover:text-neutral-fg",
          pressed && "font-medium text-neutral-fg",
        )}
      >
        {preset.name}
      </span>
      {preset.imported && (
        <span className="-mt-1 flex flex-col items-start gap-0.5 px-0.5 text-[10px] leading-tight text-neutral-fg-subtle">
          <span className="rounded-sm bg-neutral-bg-muted px-1 font-medium leading-4">
            Imported
          </span>
          {note && onSelect && <span>{note}</span>}
        </span>
      )}
    </>
  );

  if (!onSelect) return <div className="flex min-w-0 flex-col gap-1.5">{body}</div>;

  return (
    <button
      type="button"
      aria-pressed={pressed}
      title={note ? `${preset.name}. ${note}` : preset.name}
      onClick={onSelect}
      // `items-stretch` overrides older Chromium's UA `button { align-items: flex-start }`
      // (Electron 33), which otherwise collapses the empty thumbnail to zero width.
      className="group flex min-w-0 cursor-pointer flex-col items-stretch gap-1.5 rounded-[var(--inner-radius)] text-left outline-none"
    >
      {body}
    </button>
  );
}

/** Two halves, light then dark: the tint ground, a panel, a text line, and the accent. */
function PresetThumbnail({ preset, pressed }: { preset: ThemePreset; pressed?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-12 w-full overflow-hidden rounded-[var(--inner-radius)] shadow-[var(--shadow-sm)] ring-offset-2 ring-offset-neutral-bg transition-[box-shadow] duration-150 motion-reduce:transition-none",
        "group-hover:shadow-[var(--shadow-md)] group-focus-visible:ring-2 group-focus-visible:ring-neutral-ring",
        pressed && "ring-2 ring-neutral-fg group-focus-visible:ring-neutral-fg",
      )}
    >
      {(["light", "dark"] as ResolvedMode[]).map((mode) => {
        const swatch = presetSwatch(preset, mode);
        return (
          <span key={mode} className="relative flex-1" style={{ background: swatch.surface }}>
            <span
              className="absolute bottom-0 left-2 right-0 top-2 flex flex-col gap-1 rounded-tl-[4px] p-1.5 shadow-[var(--shadow-xs)]"
              style={{ background: swatch.panel }}
            >
              <span
                className="h-1 w-3/5 rounded-full opacity-60"
                style={{ background: swatch.line }}
              />
              <span
                className="mt-auto h-1.5 w-4 rounded-sm"
                style={{ background: swatch.accent }}
              />
            </span>
          </span>
        );
      })}
    </span>
  );
}

// ── Import dialog ────────────────────────────────────────────────────────────

function ImportThemeDialog({
  open,
  onOpenChange,
  onApply,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (preset: ThemePreset) => void;
}) {
  const [text, setText] = useState("");
  const fieldId = useId();
  const result = useMemo(() => (text.trim() ? importTheme(text) : undefined), [text]);
  const preset = result?.ok ? result.preset : undefined;
  const note = describeAdjustments(preset?.adjustments);

  useEffect(() => {
    if (!open) setText("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 p-5 sm:max-w-md motion-reduce:animate-none">
        <DialogHeader>
          <DialogTitle className="text-base">Import theme</DialogTitle>
          <DialogDescription className="text-xs">
            Paste a base16 scheme, a VS Code colour theme, or a theme copied from this panel. It is
            added as a style; colours are adjusted to fit the app.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <label htmlFor={fieldId} className="text-xs font-medium text-neutral-fg-subtle">
            Theme to import
          </label>
          <Textarea
            id={fieldId}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            placeholder={'scheme: "Nord"\npalette:\n  base00: "#2E3440"\n  …'}
            className="h-36 resize-none border-0 bg-neutral-bg-subtle font-mono text-xs shadow-[var(--inner-shadow)] md:text-xs"
          />
        </div>

        <div className="min-h-[76px]" aria-live="polite">
          {result && !result.ok && <p className="text-xs text-palette-danger">{result.error}</p>}
          {preset && (
            <div className="flex items-center gap-3">
              <div className="w-24 shrink-0">
                <PresetCard preset={preset} />
              </div>
              <div className="min-w-0 space-y-1 text-xs text-neutral-fg-subtle">
                <p>
                  Adds a style named{" "}
                  <span className="font-medium text-neutral-fg">{preset.name}</span>.
                </p>
                {note && <p>{note}.</p>}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:space-x-0">
          <Button variant="soft" color="secondary" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="solid"
            size="sm"
            disabled={!preset}
            onClick={() => preset && onApply(preset)}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span id={id} className={cn("block text-xs font-medium text-neutral-fg-subtle", className)}>
      {children}
    </span>
  );
}

/** Writes text to the clipboard and reports the outcome for a short while. */
function useCopyFeedback() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = useCallback(async (text: string) => {
    let next: "copied" | "failed" = "copied";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      next = "failed";
    }
    setState(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), COPY_FEEDBACK_MS);
  }, []);
  return [state, copy] as const;
}
