import type { Meta, StoryObj } from "@storybook/react";
import { ErrorState } from "./error-state";

const meta = {
  title: "Components/ErrorState",
  component: ErrorState,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Failed to load data",
    description: "An error occurred while fetching the data.",
  },
};

export const WithRetry: Story = {
  args: {
    title: "Connection error",
    description: "Unable to connect to the server. Please check your network.",
    retryAction: {
      label: "Try again",
      onClick: () => {},
    },
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Something went wrong",
  },
};

export const Small: Story = {
  args: {
    title: "Load failed",
    description: "Could not load items.",
    size: "sm",
    retryAction: {
      label: "Retry",
      onClick: () => {},
    },
  },
};
