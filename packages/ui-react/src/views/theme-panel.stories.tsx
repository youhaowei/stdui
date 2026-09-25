import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../primitives/button";
import { ThemePanel } from "./theme-panel";

const meta = {
  title: "Views/ThemePanel",
  component: ThemePanel,
  parameters: { layout: "fullscreen" },
  args: { isOpen: true, onClose: () => {} },
} satisfies Meta<typeof ThemePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The panel beside a stand-in app, on the shell ground, so picking a style
 * shows its tint, neutrals, and accent.
 */
export const Default: Story = {
  render: function Render() {
    const [open, setOpen] = useState(true);
    return (
      <div className="-m-6 flex min-h-screen gap-2 p-2 [background:var(--shell-bg)]">
        <main className="flex flex-1 flex-col gap-3 rounded-[var(--surface-radius)] bg-neutral-bg p-5 shadow-[var(--surface-shadow)]">
          <div className="flex items-center gap-2">
            <h1 className="flex-1 text-base font-semibold text-neutral-fg">Weekly revenue</h1>
            <Button variant="solid" size="sm" onClick={() => setOpen(true)}>
              Appearance
            </Button>
          </div>
          <p className="text-sm text-neutral-fg-subtle">Sessions and revenue by channel.</p>
          <div className="grid grid-cols-3 gap-3">
            {["Organic", "Paid", "Referral"].map((name) => (
              <div key={name} className="rounded-[var(--inner-radius)] bg-neutral-bg-subtle p-3">
                <div className="text-xs text-neutral-fg-subtle">{name}</div>
                <div className="mt-1 text-lg font-semibold text-neutral-fg">12.4k</div>
              </div>
            ))}
          </div>
        </main>
        <ThemePanel isOpen={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
};

/**
 * One section of a settings page: the page names the section, so the panel
 * drops its title row, close button, and scroll area, and the style grid
 * takes one row when there is room.
 */
export const Inline: Story = {
  args: { inline: true },
  render: (args) => (
    <div className="-m-6 min-h-screen p-2 [background:var(--shell-bg)]">
      <main className="max-w-[720px] rounded-[var(--surface-radius)] bg-neutral-bg p-6 shadow-[var(--surface-shadow)]">
        <h2 className="text-[15px] font-semibold text-neutral-fg">Appearance</h2>
        <p className="mb-4 text-sm text-neutral-fg-subtle">How DashFrame looks on this computer.</p>
        <ThemePanel {...args} />
      </main>
    </div>
  ),
};
