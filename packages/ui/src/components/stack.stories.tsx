import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "./stack";

const meta = {
  title: "Components/Stack",
  component: Stack,
  argTypes: {
    direction: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
    spacing: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch"],
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around"],
    },
    wrap: { control: "boolean" },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded border border-neutral-border bg-neutral-bg-dim px-4 py-2 text-sm">
    {children}
  </div>
);

export const Vertical: Story = {
  args: {
    direction: "vertical",
    spacing: "md",
    children: null,
  },
  render: (args) => (
    <Stack {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const Horizontal: Story = {
  args: {
    direction: "horizontal",
    spacing: "md",
    align: "center",
    children: null,
  },
  render: (args) => (
    <Stack {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const SpacingVariants: Story = {
  args: {
    spacing: "lg",
    children: null,
  },
  render: () => (
    <Stack spacing="lg">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((spacing) => (
        <div key={spacing}>
          <p className="mb-1 text-xs text-neutral-fg-subtle">spacing="{spacing}"</p>
          <Stack direction="horizontal" spacing={spacing}>
            <Box>A</Box>
            <Box>B</Box>
            <Box>C</Box>
          </Stack>
        </div>
      ))}
    </Stack>
  ),
};

export const CenteredContent: Story = {
  args: {
    direction: "vertical",
    spacing: "sm",
    align: "center",
    justify: "center",
    className: "h-48",
    children: null,
  },
  render: (args) => (
    <Stack {...args}>
      <Box>Centered</Box>
      <Box>Content</Box>
    </Stack>
  ),
};

export const SpaceBetween: Story = {
  args: {
    direction: "horizontal",
    justify: "between",
    align: "center",
    children: null,
  },
  render: (args) => (
    <Stack {...args}>
      <Box>Left</Box>
      <Box>Right</Box>
    </Stack>
  ),
};
