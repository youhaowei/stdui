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
      <DialogTrigger
        render={
          <Button variant="soft" color="primary">
            Open Dialog
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>This is a description of the dialog content.</DialogDescription>
        </DialogHeader>
        <p className="text-sm">Dialog body content goes here.</p>
        <DialogFooter>
          <Button variant="soft" color="primary">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Large: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="soft" color="primary">
            Open Large Dialog
          </Button>
        }
      />
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
      <DialogTrigger
        render={
          <Button variant="soft" color="primary">
            Open XL Dialog
          </Button>
        }
      />
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
      <DialogTrigger
        render={
          <Button variant="soft" color="primary">
            Open Full Dialog
          </Button>
        }
      />
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
      <DialogTrigger
        render={
          <Button variant="soft" color="primary">
            Open (No Close Button)
          </Button>
        }
      />
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No Close Button</DialogTitle>
          <DialogDescription>
            The close button is hidden. Use the footer button to close.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="soft" color="primary">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

const tones = [
  "bg-neutral-bg-subtle",
  "bg-neutral-bg-muted",
  "bg-neutral-bg-emphasis",
  "bg-surface-base",
  "bg-neutral-bg-bold",
  "bg-neutral-bg-strongest",
];
const accents = [
  "bg-palette-primary",
  "bg-palette-info",
  "bg-palette-success",
  "bg-palette-warning",
  "bg-palette-danger",
  "bg-palette-secondary",
];

/** Opens over a dense page so the scrim can be judged: the page should dim, not vanish. */
export const OverBusyPage: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-display">Quarterly overview</h1>
        <Dialog defaultOpen>
          <DialogTrigger
            render={
              <Button variant="soft" color="primary">
                Open Dialog
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename report</DialogTitle>
              <DialogDescription>
                The page behind should stay faintly legible while this surface lifts off it.
              </DialogDescription>
            </DialogHeader>
            <p className="text-sm">Dialog body content goes here.</p>
            <DialogFooter>
              <Button variant="soft" color="primary">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {tones.map((tone, index) => (
          <div
            key={tone}
            className={`${tone} flex flex-col gap-2 rounded-surface p-4 shadow-surface`}
          >
            <div className="flex items-center gap-2">
              <span className={`${accents[index]} size-3 rounded-full`} />
              <span className="text-heading">Metric {index + 1}</span>
            </div>
            <span className="text-display">{(index + 3) * 1284}</span>
            <p className="text-body text-neutral-fg-subtle">
              Sessions grew week over week across every channel, led by organic search and returning
              visitors from the newsletter.
            </p>
          </div>
        ))}
      </div>
      <p className="text-body">
        Revenue, retention and acquisition are summarised above. Each card uses a different neutral
        step so the scrim can be judged against light and dark regions of the page at once.
      </p>
    </div>
  ),
};
