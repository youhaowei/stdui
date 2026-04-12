import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { SearchIcon, PlusIcon, CheckIcon } from "@stdui/icons";

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    label: "Button",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "outline", "ghost", "link"],
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "success", "danger", "warning", "info"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "icon"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "solid",
    color: "primary",
  },
};

export const WithIcon: Story = {
  args: {
    icon: PlusIcon,
    label: "Add Item",
  },
};

export const IconOnly: Story = {
  args: {
    icon: SearchIcon,
    label: "Search",
    iconOnly: true,
    tooltip: "Search",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    label: "Saving...",
  },
};

export const IconVariations: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button icon={PlusIcon} label="Create" />
      <Button icon={SearchIcon} label="Search" variant="outline" />
      <Button icon={CheckIcon} label="Done" variant="solid" color="success" />
      <Button icon={PlusIcon} label="Add" iconOnly variant="ghost" tooltip="Add" />
    </div>
  ),
};
