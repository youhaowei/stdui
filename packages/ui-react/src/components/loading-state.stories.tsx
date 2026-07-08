import type { Meta, StoryObj } from "@storybook/react";
import { LoadingState } from "./loading-state";

const meta = {
  title: "Components/LoadingState",
  component: LoadingState,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof LoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Loading data...",
  },
};

export const WithDescription: Story = {
  args: {
    title: "Loading items",
    description: "Please wait while we fetch your data.",
  },
};

export const Small: Story = {
  args: {
    title: "Loading...",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    title: "Preparing your dashboard",
    description: "This may take a moment.",
    size: "lg",
  },
};
