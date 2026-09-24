import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, ChartIcon, CloseIcon, DashboardIcon, PlusIcon, TableIcon } from "../icons";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command";

const meta: Meta<typeof CommandDialog> = {
  title: "Primitives/Command",
  component: CommandDialog,
};

export default meta;
type Story = StoryObj<typeof meta>;

function Results() {
  return (
    <>
      <CommandEmpty>No results.</CommandEmpty>
      <CommandGroup heading="Reports">
        <CommandItem>
          <DashboardIcon />
          Weekly sales
          <CommandShortcut>Report</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <DashboardIcon />
          Traffic overview
          <CommandShortcut>Report</CommandShortcut>
        </CommandItem>
      </CommandGroup>
      <CommandGroup heading="Charts">
        <CommandItem>
          <ChartIcon />
          Sum of Sales by Category
        </CommandItem>
        <CommandItem>
          <ChartIcon />
          Sum of Sales by Date
        </CommandItem>
      </CommandGroup>
      <CommandGroup heading="Tables">
        <CommandItem>
          <TableIcon />
          sales_data
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Actions">
        <CommandItem>
          <PlusIcon />
          New report
        </CommandItem>
        <CommandItem>
          <ArrowRightIcon />
          Go to Data sources
        </CommandItem>
      </CommandGroup>
    </>
  );
}

function KeyHints() {
  return (
    <>
      <span>↑↓ move · ↵ open · esc close</span>
      <span>Searches the whole app</span>
    </>
  );
}

function ScopeChip() {
  return (
    <span className="inline-flex h-6 items-center gap-1 rounded-md bg-neutral-bg-muted pl-2 pr-1 text-xs font-medium">
      In this chart
      <button
        type="button"
        aria-label="Clear scope"
        className="grid size-[18px] place-items-center rounded text-neutral-fg-subtle"
      >
        <CloseIcon className="size-3" />
      </button>
    </span>
  );
}

/** Open with grouped results; the first row is selected. */
export const Palette: Story = {
  render: () => (
    <CommandDialog open footer={<KeyHints />}>
      <CommandInput placeholder="Search or run a command…" />
      <CommandList>
        <Results />
      </CommandList>
    </CommandDialog>
  ),
};

/** A scope chip in the `leading` slot and key hints in the `footer` slot. */
export const Scoped: Story = {
  render: () => (
    <CommandDialog open leading={<ScopeChip />} footer={<KeyHints />}>
      <CommandInput placeholder="Search in this chart…" />
      <CommandList>
        <Results />
      </CommandList>
    </CommandDialog>
  ),
};

/** No item matches the query. */
export const Empty: Story = {
  render: () => (
    <CommandDialog open footer={<KeyHints />}>
      <CommandInput value="quarterly forecast" placeholder="Search or run a command…" />
      <CommandList>
        <Results />
      </CommandList>
    </CommandDialog>
  ),
};

/** `Command` inline, as used inside a popover. */
export const Inline: Story = {
  render: () => (
    <Command className="w-80 rounded-lg" label="Add field">
      <CommandInput placeholder="Search fields…" />
      <CommandList>
        <Results />
      </CommandList>
    </Command>
  ),
};
