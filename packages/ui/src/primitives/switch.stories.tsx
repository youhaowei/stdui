import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./switch";

const meta = {
  title: "Primitives/Switch",
  component: Switch,
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="airplane-mode" />
      <label htmlFor="airplane-mode" className="text-sm">Airplane Mode</label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="checked" defaultChecked />
      <label htmlFor="checked" className="text-sm">Enabled by default</label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="disabled-off" disabled />
        <label htmlFor="disabled-off" className="text-sm opacity-50">Disabled off</label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="disabled-on" disabled defaultChecked />
        <label htmlFor="disabled-on" className="text-sm opacity-50">Disabled on</label>
      </div>
    </div>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between w-[250px]">
        <label htmlFor="wifi" className="text-sm">Wi-Fi</label>
        <Switch id="wifi" defaultChecked />
      </div>
      <div className="flex items-center justify-between w-[250px]">
        <label htmlFor="bluetooth" className="text-sm">Bluetooth</label>
        <Switch id="bluetooth" />
      </div>
      <div className="flex items-center justify-between w-[250px]">
        <label htmlFor="notifications" className="text-sm">Notifications</label>
        <Switch id="notifications" defaultChecked />
      </div>
    </div>
  ),
};
