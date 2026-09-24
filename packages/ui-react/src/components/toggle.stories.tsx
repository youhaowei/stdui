import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./toggle";
import { Input } from "../primitives/input";
import { ChartIcon, TableIcon, ListIcon, GridIcon, SearchIcon } from "../icons";

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  argTypes: {
    variant: {
      control: "select",
      options: ["soft", "outline"],
    },
    size: {
      control: "select",
      options: ["default", "sm"],
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  value: "",
  options: [] as { value: string; label?: string }[],
  onValueChange: () => {},
};

export const Default: Story = {
  args: defaultArgs,
  render: () => {
    const [value, setValue] = useState("chart");
    return (
      <Toggle
        value={value}
        onValueChange={setValue}
        options={[
          { value: "chart", icon: <ChartIcon className="h-4 w-4" />, label: "Chart" },
          { value: "table", icon: <TableIcon className="h-4 w-4" />, label: "Table" },
        ]}
      />
    );
  },
};

export const WithBadges: Story = {
  args: defaultArgs,
  render: () => {
    const [value, setValue] = useState("all");
    return (
      <Toggle
        value={value}
        onValueChange={setValue}
        options={[
          { value: "all", label: "All", badge: 42 },
          { value: "active", label: "Active", badge: 12 },
          { value: "archived", label: "Archived", badge: 30 },
        ]}
      />
    );
  },
};

export const OutlineVariant: Story = {
  args: defaultArgs,
  render: () => {
    const [value, setValue] = useState("list");
    return (
      <Toggle
        variant="outline"
        value={value}
        onValueChange={setValue}
        options={[
          { value: "list", icon: <ListIcon className="h-4 w-4" />, tooltip: "List view" },
          { value: "grid", icon: <GridIcon className="h-4 w-4" />, tooltip: "Grid view" },
        ]}
      />
    );
  },
};

export const SmallSize: Story = {
  args: defaultArgs,
  render: () => {
    const [value, setValue] = useState("chart");
    return (
      <Toggle
        size="sm"
        value={value}
        onValueChange={setValue}
        options={[
          { value: "chart", icon: <ChartIcon className="h-3 w-3" />, label: "Chart" },
          { value: "table", icon: <TableIcon className="h-3 w-3" />, label: "Table" },
        ]}
      />
    );
  },
};

export const WithDisabledOption: Story = {
  args: defaultArgs,
  render: () => {
    const [value, setValue] = useState("active");
    return (
      <Toggle
        value={value}
        onValueChange={setValue}
        options={[
          { value: "active", label: "Active" },
          { value: "pending", label: "Pending" },
          { value: "archived", label: "Archived", disabled: true },
        ]}
      />
    );
  },
};

export const IconOnlySmall: Story = {
  args: defaultArgs,
  render: () => {
    const [value, setValue] = useState("grid");
    return (
      <Toggle
        size="sm"
        value={value}
        onValueChange={setValue}
        options={[
          { value: "grid", icon: <GridIcon className="h-4 w-4" />, ariaLabel: "Grid view" },
          { value: "list", icon: <ListIcon className="h-4 w-4" />, ariaLabel: "List view" },
        ]}
      />
    );
  },
};

// Input and Toggle share the well, so a search field and a view switch on
// one toolbar read as the same family: same tone, inset, hairline, radius,
// and height.
export const BesideInput: Story = {
  args: defaultArgs,
  render: () => {
    const [value, setValue] = useState("grid");
    return (
      <div className="flex items-center gap-2 w-[360px]">
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
          value={value}
          onValueChange={setValue}
          options={[
            { value: "grid", icon: <GridIcon className="h-4 w-4" />, tooltip: "Grid view" },
            { value: "list", icon: <ListIcon className="h-4 w-4" />, tooltip: "List view" },
          ]}
        />
      </div>
    );
  },
};
