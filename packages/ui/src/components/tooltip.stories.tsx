import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./tooltip";
import { Button } from "../primitives/button";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  argTypes: {
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "This is a tooltip",
    children: <Button>Hover me</Button>,
  },
};

export const Positions: Story = {
  args: {
    content: "Tooltip",
    children: null,
  },
  render: () => (
    <div className="flex items-center justify-center gap-4 p-20">
      <Tooltip content="Top tooltip" side="top">
        <Button variant="outline">Top</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" side="right">
        <Button variant="outline">Right</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" side="bottom">
        <Button variant="outline">Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" side="left">
        <Button variant="outline">Left</Button>
      </Tooltip>
    </div>
  ),
};
