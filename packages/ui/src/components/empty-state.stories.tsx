import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./empty-state";
import { DatabaseIcon, SearchIcon, PlusIcon, FileIcon } from "@stdui/icons";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: DatabaseIcon,
    title: "No items",
    description: "Get started by adding your first item.",
  },
};

export const WithAction: Story = {
  args: {
    icon: FileIcon,
    title: "No projects yet",
    description: "Create a project to get started.",
    action: {
      label: "Create Project",
      onClick: () => {},
      icon: PlusIcon,
      variant: "solid",
      color: "primary",
    },
  },
};

export const SearchNoResults: Story = {
  args: {
    icon: SearchIcon,
    title: "No results found",
    description: "Try adjusting your search or filter criteria.",
  },
};

export const Small: Story = {
  args: {
    icon: DatabaseIcon,
    title: "No items",
    description: "Nothing here yet.",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    icon: DatabaseIcon,
    title: "No items",
    description: "Add an item to get started.",
    size: "lg",
    action: {
      label: "Add Item",
      onClick: () => {},
      icon: PlusIcon,
      variant: "solid",
      color: "primary",
    },
  },
};
