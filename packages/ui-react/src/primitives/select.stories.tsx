import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Input } from "./input";
import { Toggle } from "../components/toggle";
import { GridIcon, ListIcon, SearchIcon } from "../icons";

const meta = {
  title: "Primitives/Select",
  component: SelectTrigger,
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "ghost"] },
    size: { control: "inline-radio", options: ["default", "sm"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof SelectTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

const sortItems = [
  { value: "updated", label: "Last updated" },
  { value: "created", label: "Created" },
  { value: "name", label: "Name" },
];

export const Default: Story = {
  render: (args) => (
    <div className="w-[240px]">
      <Select defaultValue="updated" items={sortItems}>
        <SelectTrigger {...args} aria-label="Sort by">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};

// No value yet: subtle text and a dashed outline, the house "choose" mark.
// Keyboard focus drops the dashes so the focus ring reads.
export const Placeholder: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3 w-[240px]">
      <Select items={sortItems}>
        <SelectTrigger {...args} aria-label="Sort by">
          <SelectValue placeholder="Choose a sort…" />
        </SelectTrigger>
        <SelectContent>
          {sortItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select defaultValue="updated" items={sortItems}>
        <SelectTrigger {...args} aria-label="Sort by (set)">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Ghost: Story = {
  args: { variant: "ghost", size: "sm" },
  render: Default.render,
};

// A select is a field, so it sits in Input's well; the chevron is the only
// difference. Input, Toggle and Select at size sm share one height.
export const BesideInput: Story = {
  render: () => {
    const [view, setView] = useState("grid");
    return (
      <div className="flex items-center gap-2 w-[480px]">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-neutral-fg-subtle" />
          <Input
            size="sm"
            aria-label="Search reports"
            placeholder="Search reports"
            className="pl-8"
          />
        </div>
        <Toggle
          size="sm"
          value={view}
          onValueChange={setView}
          options={[
            { value: "grid", icon: <GridIcon className="h-4 w-4" />, tooltip: "Grid view" },
            { value: "list", icon: <ListIcon className="h-4 w-4" />, tooltip: "List view" },
          ]}
        />
        <div className="w-[160px]">
          <Select defaultValue="updated" items={sortItems}>
            <SelectTrigger size="sm" aria-label="Sort by">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  },
};
