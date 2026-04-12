import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta = {
  title: "Primitives/Button",
  component: Button,
  args: {
    children: "Button",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "soft", "outline", "ghost", "link"],
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "success", "danger", "warning", "info"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "icon"],
    },
    active: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="solid">Solid</Button>
      <Button variant="soft">Soft</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const SolidColors: Story = {
  name: "Solid × Colors",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="solid" color="primary">
        Primary
      </Button>
      <Button variant="solid" color="secondary">
        Secondary
      </Button>
      <Button variant="solid" color="success">
        Success
      </Button>
      <Button variant="solid" color="danger">
        Danger
      </Button>
      <Button variant="solid" color="warning">
        Warning
      </Button>
      <Button variant="solid" color="info">
        Info
      </Button>
    </div>
  ),
};

export const SoftColors: Story = {
  name: "Soft × Colors",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="soft" color="primary">
        Primary
      </Button>
      <Button variant="soft" color="secondary">
        Secondary
      </Button>
      <Button variant="soft" color="success">
        Success
      </Button>
      <Button variant="soft" color="danger">
        Danger
      </Button>
      <Button variant="soft" color="warning">
        Warning
      </Button>
      <Button variant="soft" color="info">
        Info
      </Button>
    </div>
  ),
};

export const OutlineColors: Story = {
  name: "Outline × Colors",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" color="primary">
        Primary
      </Button>
      <Button variant="outline" color="secondary">
        Secondary
      </Button>
      <Button variant="outline" color="success">
        Success
      </Button>
      <Button variant="outline" color="danger">
        Danger
      </Button>
      <Button variant="outline" color="warning">
        Warning
      </Button>
      <Button variant="outline" color="info">
        Info
      </Button>
    </div>
  ),
};

export const GhostColors: Story = {
  name: "Ghost × Colors",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="ghost" color="primary">
        Primary
      </Button>
      <Button variant="ghost" color="secondary">
        Secondary
      </Button>
      <Button variant="ghost" color="success">
        Success
      </Button>
      <Button variant="ghost" color="danger">
        Danger
      </Button>
      <Button variant="ghost" color="warning">
        Warning
      </Button>
      <Button variant="ghost" color="info">
        Info
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const GhostActive: Story = {
  name: "Ghost Active States",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="ghost" color="primary" active>
        Primary
      </Button>
      <Button variant="ghost" color="secondary" active>
        Secondary
      </Button>
      <Button variant="ghost" color="danger" active>
        Danger
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
