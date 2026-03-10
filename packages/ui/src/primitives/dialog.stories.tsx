import type { Meta, StoryObj } from "@storybook/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog";
import { Button } from "./button";

const meta: Meta<typeof Dialog> = {
  title: "Primitives/Dialog",
  component: Dialog,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="soft" color="primary">Open Dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description of the dialog content.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm">Dialog body content goes here.</p>
        <DialogFooter>
          <Button variant="soft" color="primary">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Large: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="soft" color="primary">Open Large Dialog</Button>} />
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Large Dialog</DialogTitle>
          <DialogDescription>This dialog uses the lg size preset.</DialogDescription>
        </DialogHeader>
        <p className="text-sm">More room for content in a large dialog.</p>
      </DialogContent>
    </Dialog>
  ),
};

export const ExtraLarge: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="soft" color="primary">Open XL Dialog</Button>} />
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>Extra Large Dialog</DialogTitle>
          <DialogDescription>This dialog uses the xl size preset.</DialogDescription>
        </DialogHeader>
        <p className="text-sm">Even more room for complex content.</p>
      </DialogContent>
    </Dialog>
  ),
};

export const FullScreen: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="soft" color="primary">Open Full Dialog</Button>} />
      <DialogContent size="full">
        <DialogHeader>
          <DialogTitle>Full Screen Dialog</DialogTitle>
          <DialogDescription>This dialog takes up most of the viewport.</DialogDescription>
        </DialogHeader>
        <p className="text-sm">Full-size content area.</p>
      </DialogContent>
    </Dialog>
  ),
};

export const NoCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="soft" color="primary">Open (No Close Button)</Button>} />
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No Close Button</DialogTitle>
          <DialogDescription>
            The close button is hidden. Use the footer button to close.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="soft" color="primary">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
