import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";

const meta = {
  title: "Primitives/Textarea",
  component: Textarea,
  args: {
    placeholder: "Type your message here...",
  },
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Write a description...",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled textarea",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "This textarea already has some content in it that the user can edit.",
  },
};
