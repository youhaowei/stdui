import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./separator";

const meta = {
  title: "Primitives/Separator",
  component: Separator,
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <p className="text-sm">Content above</p>
      <Separator className="my-4" />
      <p className="text-sm">Content below</p>
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px]">
      <h4 className="text-sm font-medium">Section Title</h4>
      <Separator className="my-3" />
      <p className="text-sm">Section content goes here.</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4 h-5">
      <span className="text-sm">Item 1</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Item 2</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Item 3</span>
    </div>
  ),
};
