import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";

const meta = {
  title: "Primitives/Input",
  component: Input,
  args: {
    placeholder: "Enter text...",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search"],
    },
    variant: { control: "inline-radio", options: ["default", "ghost"] },
    size: { control: "inline-radio", options: ["default", "sm"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "you@example.com",
    type: "email",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password...",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
  },
};

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[300px]">
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="number" placeholder="Number input" />
      <Input type="search" placeholder="Search input" />
    </div>
  ),
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    placeholder: "Borderless — click to edit",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[300px]">
      <Input size="default" placeholder="Default (h-10)" />
      <Input size="sm" placeholder="Small (h-8)" />
    </div>
  ),
};

// Inline-editable property rows (Linear/Notion style): ghost inputs read as
// plain text until hovered/focused, then reveal a border + subtle background.
export const GhostPropertyRows: Story = {
  render: () => (
    <div className="flex flex-col gap-1 w-[320px]">
      <Input variant="ghost" size="sm" defaultValue="Design review" />
      <Input variant="ghost" size="sm" defaultValue="2 points" />
      <Input variant="ghost" size="sm" placeholder="Add estimate…" />
    </div>
  ),
};
