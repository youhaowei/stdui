import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "../icons";

import { cn } from "../lib/utils";
import { Dialog, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from "./dialog";

function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-md bg-neutral-bg-subtle text-neutral-fg",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Content `CommandDialog` hands to the `CommandInput` inside it. The input is
 * rendered by the caller, so the dialog's `leading` slot reaches it this way.
 */
const CommandDialogContext = React.createContext<{ leading?: React.ReactNode }>({});

function CommandDialog({
  children,
  title = "Command palette",
  description = "Search for a command to run.",
  leading,
  footer,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  children?: React.ReactNode;
  /** Accessible name of the dialog. Visually hidden. */
  title?: string;
  /** Accessible description of the dialog. Visually hidden. */
  description?: string;
  /** Rendered inside the input row, before the input (for example a scope chip). */
  leading?: React.ReactNode;
  /** Rendered under the list (for example key hints). */
  footer?: React.ReactNode;
  /** Class names for the palette panel. */
  className?: string;
}) {
  const context = React.useMemo(() => ({ leading }), [leading]);
  const popupRef = React.useRef<HTMLDivElement>(null);
  // Focus the search input on open, not the first tabbable node (which may be
  // a control inside the `leading` slot).
  const focusInput = React.useCallback(
    () => popupRef.current?.querySelector<HTMLElement>("[cmdk-input]") ?? true,
    [],
  );
  return (
    <Dialog {...props}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Popup
          ref={popupRef}
          initialFocus={focusInput}
          className={cn(
            // Top-anchored so the panel does not jump as the result count changes.
            "fixed left-1/2 top-[12vh] z-50 w-[calc(100%-2rem)] max-w-[640px] -translate-x-1/2 overflow-hidden rounded-[var(--surface-radius)] bg-neutral-bg text-neutral-fg shadow-[var(--shadow-lg)] outline-none",
            "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none data-[starting-style]:-translate-y-1 data-[starting-style]:opacity-0 data-[ending-style]:-translate-y-1 data-[ending-style]:opacity-0",
            className,
          )}
        >
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">{description}</DialogDescription>
          <CommandDialogContext.Provider value={context}>
            <Command className="rounded-none bg-neutral-bg [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-neutral-fg-subtle [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 [&_[cmdk-list]]:max-h-[60vh]">
              {children}
              {footer != null && (
                <div
                  data-slot="command-footer"
                  className="flex items-center justify-between gap-2 border-t border-neutral-border-subtle px-3 py-2 text-xs text-neutral-fg-subtle"
                >
                  {footer}
                </div>
              )}
            </Command>
          </CommandDialogContext.Provider>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
}

function CommandInput({
  className,
  leading,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input> & {
  /** Rendered before the input, after the search icon (for example a scope chip). */
  leading?: React.ReactNode;
}) {
  const dialog = React.useContext(CommandDialogContext);
  const leadingContent = leading ?? dialog.leading;
  return (
    <div
      className="flex items-center border-b border-neutral-border-subtle px-3"
      cmdk-input-wrapper=""
    >
      <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      {leadingContent != null && (
        <div data-slot="command-input-leading" className="mr-2 flex shrink-0 items-center">
          {leadingContent}
        </div>
      )}
      <CommandPrimitive.Input
        className={cn(
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-neutral-fg-subtle disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
      {...props}
    />
  );
}

function CommandEmpty(props: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty className="py-6 text-center text-sm" {...props} />;
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        "overflow-hidden p-1 text-neutral-fg [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-neutral-fg-subtle",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      className={cn("-mx-1 h-px bg-neutral-border", className)}
      {...props}
    />
  );
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none transition-colors duration-150 motion-reduce:transition-none data-[selected=true]:bg-neutral-bg-muted data-[selected=true]:text-neutral-fg data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-neutral-fg-subtle", className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
