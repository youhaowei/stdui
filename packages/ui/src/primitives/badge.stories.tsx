import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  args: {
    children: "Badge",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "soft", "outline"],
    },
    color: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "success",
        "danger",
        "warning",
        "info",
      ],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="solid">Solid</Badge>
      <Badge variant="soft">Soft</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const SolidColors: Story = {
  name: "Solid × Colors",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="solid" color="primary">Primary</Badge>
      <Badge variant="solid" color="secondary">Secondary</Badge>
      <Badge variant="solid" color="success">Success</Badge>
      <Badge variant="solid" color="danger">Danger</Badge>
      <Badge variant="solid" color="warning">Warning</Badge>
      <Badge variant="solid" color="info">Info</Badge>
    </div>
  ),
};

export const SoftColors: Story = {
  name: "Soft × Colors",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="soft" color="primary">Primary</Badge>
      <Badge variant="soft" color="secondary">Secondary</Badge>
      <Badge variant="soft" color="success">Success</Badge>
      <Badge variant="soft" color="danger">Danger</Badge>
      <Badge variant="soft" color="warning">Warning</Badge>
      <Badge variant="soft" color="info">Info</Badge>
    </div>
  ),
};

export const OutlineColors: Story = {
  name: "Outline × Colors",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="outline" color="primary">Primary</Badge>
      <Badge variant="outline" color="secondary">Secondary</Badge>
      <Badge variant="outline" color="success">Success</Badge>
      <Badge variant="outline" color="danger">Danger</Badge>
      <Badge variant="outline" color="warning">Warning</Badge>
      <Badge variant="outline" color="info">Info</Badge>
    </div>
  ),
};
