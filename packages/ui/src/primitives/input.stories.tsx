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
    size: "sm",
    placeholder: "Ghost input",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[300px]">
      <Input size="default" placeholder="Default height" />
      <Input size="sm" placeholder="Compact (sm)" />
    </div>
  ),
};

/**
 * Ghost + compact — the inline-editable property field. Borderless until
 * hovered/focused, so a stack of them reads as plain values, not form inputs.
 */
export const GhostPropertyRows: Story = {
  render: () => (
    <div className="flex w-[280px] flex-col rounded-md border border-neutral-border p-1">
      <Input variant="ghost" size="sm" defaultValue="Design review" />
      <Input variant="ghost" size="sm" type="number" defaultValue={3} />
      <Input variant="ghost" size="sm" type="date" defaultValue="2026-07-08" />
    </div>
  ),
};
