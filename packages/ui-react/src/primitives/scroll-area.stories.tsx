import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea } from "./scroll-area";

const meta = {
  title: "Primitives/ScrollArea",
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = Array.from({ length: 40 }, (_, i) => `Row ${i + 1}`);
const columns = Array.from({ length: 12 }, (_, i) => `Column ${i + 1}`);

export const Vertical: Story = {
  args: { children: null },
  render: () => (
    <ScrollArea className="h-64 w-64 rounded-lg border border-neutral-border">
      <ul className="p-3 text-sm">
        {rows.map((row) => (
          <li key={row} className="py-1.5">
            {row}
          </li>
        ))}
      </ul>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  args: { children: null },
  render: () => (
    <ScrollArea orientation="horizontal" className="w-96 rounded-lg border border-neutral-border">
      <div className="flex gap-3 p-3">
        {columns.map((column) => (
          <div
            key={column}
            className="flex h-24 w-32 shrink-0 items-center justify-center rounded-md bg-neutral-bg-muted text-sm"
          >
            {column}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Both: Story = {
  args: { children: null },
  render: () => (
    <ScrollArea orientation="both" className="h-64 w-96 rounded-lg border border-neutral-border">
      <table className="text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              {columns.map((column) => (
                <td key={column} className="px-3 py-1.5 whitespace-nowrap">
                  {row}, {column}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  ),
};

/** Sized by max-height alone: scrolls once content passes 240px. */
export const MaxHeight: Story = {
  args: { children: null },
  render: () => (
    <ScrollArea className="max-h-60 w-64 rounded-lg border border-neutral-border">
      <ul className="p-3 text-sm">
        {rows.map((row) => (
          <li key={row} className="py-1.5">
            {row}
          </li>
        ))}
      </ul>
    </ScrollArea>
  ),
};

/** A sticky header: the scrollbar starts below it and the top fade runs under it. */
export const StickyHeader: Story = {
  args: { children: null },
  render: () => (
    <ScrollArea
      orientation="vertical"
      topInset={32}
      className="h-64 w-72 rounded-lg border border-neutral-border"
    >
      <div className="sticky top-0 z-20 flex h-8 items-center border-b border-neutral-border bg-neutral-bg-muted px-3 text-xs font-medium">
        Name
      </div>
      <ul className="px-3 text-sm">
        {rows.map((row) => (
          <li key={row} className="py-1.5">
            {row}
          </li>
        ))}
      </ul>
    </ScrollArea>
  ),
};
