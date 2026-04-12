import type { Meta, StoryObj } from "@storybook/react";
import { AlertCircleIcon, InfoIcon, CheckCircleIcon } from "@stdui/icons";
import { Alert, AlertTitle, AlertDescription } from "./alert";

const meta = {
  title: "Primitives/Alert",
  component: Alert,
  argTypes: {
    color: {
      control: "select",
      options: ["info", "success", "warning", "danger"],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>This is a default alert with useful information.</AlertDescription>
    </Alert>
  ),
};

export const Info: Story = {
  render: () => (
    <Alert color="info">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Info</AlertTitle>
      <AlertDescription>This action has been logged for review.</AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert color="success">
      <CheckCircleIcon className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>Your changes have been saved successfully.</AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert color="warning">
      <AlertCircleIcon className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>This action may have unintended consequences.</AlertDescription>
    </Alert>
  ),
};

export const Danger: Story = {
  render: () => (
    <Alert color="danger">
      <AlertCircleIcon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Something went wrong. Please try again later.</AlertDescription>
    </Alert>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[450px]">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>A neutral informational message.</AlertDescription>
      </Alert>
      <Alert color="info">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>Additional context for the current view.</AlertDescription>
      </Alert>
      <Alert color="success">
        <CheckCircleIcon className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Operation completed successfully.</AlertDescription>
      </Alert>
      <Alert color="warning">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Proceed with caution.</AlertDescription>
      </Alert>
      <Alert color="danger">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Danger</AlertTitle>
        <AlertDescription>An error occurred that needs attention.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
    </Alert>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <Alert>
      <AlertTitle>No icon</AlertTitle>
      <AlertDescription>This alert has no icon, just text content.</AlertDescription>
    </Alert>
  ),
};
