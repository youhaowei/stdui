import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./toggle";
import { ChartIcon, TableIcon, ListIcon, GridIcon } from "@stdui/icons";

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
