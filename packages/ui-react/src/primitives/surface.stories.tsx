import type { Meta, StoryObj } from "@storybook/react";
import { Surface } from "./surface";

const meta = {
  title: "Primitives/Surface",
  component: Surface,
  argTypes: {
    elevation: {
      control: "select",
      options: ["flat", "raised", "floating", "inset"],
    },
    interactive: { control: "boolean" },
  },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Surface {...args} className="p-6 w-[300px]">
      <p className="text-sm">Default raised surface</p>
    </Surface>
  ),
};

export const Elevations: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Surface elevation="flat" className="p-6 w-[200px]">
        <p className="text-sm font-medium">Flat</p>
        <p className="text-xs mt-1 opacity-60">No shadow, subtle border</p>
      </Surface>
      <Surface elevation="raised" className="p-6 w-[200px]">
        <p className="text-sm font-medium">Raised</p>
        <p className="text-xs mt-1 opacity-60">Ring + layered shadow</p>
      </Surface>
      <Surface elevation="floating" className="p-6 w-[200px]">
        <p className="text-sm font-medium">Floating</p>
        <p className="text-xs mt-1 opacity-60">Dramatic depth</p>
      </Surface>
      <Surface elevation="inset" className="p-6 w-[200px]">
        <p className="text-sm font-medium">Inset</p>
        <p className="text-xs mt-1 opacity-60">Sunken appearance</p>
      </Surface>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Surface elevation="flat" interactive className="p-6 w-[200px]">
        <p className="text-sm font-medium">Flat Interactive</p>
        <p className="text-xs mt-1 opacity-60">Hover to see effect</p>
      </Surface>
      <Surface elevation="raised" interactive className="p-6 w-[200px]">
        <p className="text-sm font-medium">Raised Interactive</p>
        <p className="text-xs mt-1 opacity-60">Hover to see effect</p>
      </Surface>
      <Surface elevation="floating" interactive className="p-6 w-[200px]">
        <p className="text-sm font-medium">Floating Interactive</p>
        <p className="text-xs mt-1 opacity-60">Hover to see effect</p>
      </Surface>
    </div>
  ),
};

export const NonInteractive: Story = {
  args: {
    interactive: false,
    elevation: "raised",
  },
  render: (args) => (
    <Surface {...args} className="p-6 w-[300px]">
      <p className="text-sm">Static surface, no hover states.</p>
    </Surface>
  ),
};
