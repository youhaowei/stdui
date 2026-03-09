import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";
import { Button } from "./button";

const meta = {
  title: "Primitives/Card",
  component: Card,
  argTypes: {
    variant: {
      control: "select",
      options: ["outlined", "elevated"],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content with some example text.</p>
      </CardContent>
      <CardFooter>
        <Button variant="soft" color="primary">Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" className="w-[350px]">
      <CardHeader>
        <CardTitle>Outlined Card</CardTitle>
        <CardDescription>Uses a simple border with no shadow.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the outlined variant.</p>
      </CardContent>
    </Card>
  ),
};

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" className="w-[350px]">
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>Uses a subtle shadow for depth.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the elevated variant.</p>
      </CardContent>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Card variant="outlined" className="w-[300px]">
        <CardHeader>
          <CardTitle>Outlined</CardTitle>
          <CardDescription>Border only</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Default variant with a clean border.</p>
        </CardContent>
      </Card>
      <Card variant="elevated" className="w-[300px]">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
          <CardDescription>Shadow + subtle border</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Elevated variant with a box shadow.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Choose a framework to get started.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" color="secondary">Cancel</Button>
        <Button variant="soft" color="primary">Deploy</Button>
      </CardFooter>
    </Card>
  ),
};
