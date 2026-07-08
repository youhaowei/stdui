import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";

const meta = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <label htmlFor="terms" className="text-sm">
        Accept terms and conditions
      </label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="checked" defaultChecked />
      <label htmlFor="checked" className="text-sm">
        Checked by default
      </label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-unchecked" disabled />
        <label htmlFor="disabled-unchecked" className="text-sm opacity-50">
          Disabled unchecked
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <label htmlFor="disabled-checked" className="text-sm opacity-50">
          Disabled checked
        </label>
      </div>
    </div>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="email-notifications" />
        <label htmlFor="email-notifications" className="text-sm">
          Email notifications
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="push-notifications" />
        <label htmlFor="push-notifications" className="text-sm">
          Push notifications
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="sms-notifications" />
        <label htmlFor="sms-notifications" className="text-sm">
          SMS notifications
        </label>
      </div>
    </div>
  ),
};
