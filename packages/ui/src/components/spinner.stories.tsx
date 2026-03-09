import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./spinner";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    color: {
      control: "select",
      options: ["current", "primary", "secondary", "warning", "danger", "success"],
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner color="primary" />
      <Spinner color="secondary" />
      <Spinner color="success" />
      <Spinner color="warning" />
      <Spinner color="danger" />
    </div>
  ),
};
