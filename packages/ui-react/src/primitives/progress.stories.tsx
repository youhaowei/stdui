import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./progress";

const meta = {
  title: "Primitives/Progress",
  component: Progress,
  args: {
    value: 50,
  },
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "secondary", "success", "danger", "warning", "info"],
    },
    value: { control: { type: "range", min: 0, max: 100 } },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[400px]">
      <Progress value={70} color="primary" />
      <Progress value={55} color="secondary" />
      <Progress value={80} color="success" />
      <Progress value={40} color="danger" />
      <Progress value={65} color="warning" />
      <Progress value={50} color="info" />
    </div>
  ),
};

export const Values: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[400px]">
      <div className="flex flex-col gap-1">
        <span className="text-sm">0%</span>
        <Progress value={0} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm">25%</span>
        <Progress value={25} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm">50%</span>
        <Progress value={50} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm">75%</span>
        <Progress value={75} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm">100%</span>
        <Progress value={100} />
      </div>
    </div>
  ),
};
