import { describe, expect, it, beforeAll, vi } from "vitest";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { Command, CommandDialog, CommandInput, CommandItem, CommandList } from "./command";

beforeAll(() => {
  // cmdk scrolls the selected item into view; happy-dom does not implement it.
  Element.prototype.scrollIntoView ??= () => {};
});

function Items() {
  return (
    <CommandList>
      <CommandItem>Weekly sales</CommandItem>
      <CommandItem>Traffic overview</CommandItem>
    </CommandList>
  );
}

describe("Command", () => {
  it("keeps the selected-row fill token different from the list fill token", async () => {
    const { container } = render(
      <Command>
        <CommandInput />
        <Items />
      </Command>,
    );
    const root = container.querySelector("[cmdk-root]");
    await waitFor(() =>
      expect(container.querySelector('[cmdk-item][data-selected="true"]')).not.toBeNull(),
    );
    const itemClasses = container.querySelector("[cmdk-item]")!.className.split(" ");
    const selectedFill = itemClasses.find((c) => c.startsWith("data-[selected=true]:bg-"));
    expect(selectedFill).toBe("data-[selected=true]:bg-neutral-bg-emphasis");
    expect(root!.className).not.toContain(selectedFill!.replace("data-[selected=true]:", ""));
  });

  it("renders a leading node before the input", () => {
    const { getByText, getByRole } = render(
      <Command>
        <CommandInput leading={<span>In this chart</span>} />
        <Items />
      </Command>,
    );
    const chip = getByText("In this chart");
    const input = getByRole("combobox");
    expect(chip.compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

describe("CommandDialog", () => {
  it("is named, has no close button, and renders the leading and footer slots", async () => {
    const { getByRole, queryByRole, findByRole, getByText } = render(
      <CommandDialog
        open
        leading={
          <span>
            In this chart<button type="button">Clear scope</button>
          </span>
        }
        footer={<span>esc close</span>}
      >
        <CommandInput placeholder="Search" />
        <Items />
      </CommandDialog>,
    );
    const dialog = await findByRole("dialog", { name: "Command palette" });
    expect(dialog.className).not.toMatch(/(^|\s)border(\s|$)/);
    expect(queryByRole("button", { name: "Close" })).toBeNull();

    const chip = getByText("In this chart");
    const input = getByRole("combobox");
    expect(input.parentElement!.contains(chip)).toBe(true);
    expect(chip.compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    await waitFor(() => expect(document.activeElement).toBe(input));

    const footer = getByText("esc close");
    const list = dialog.querySelector("[cmdk-list]")!;
    expect(list.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("accepts a custom title", async () => {
    const { findByRole } = render(
      <CommandDialog open title="Command center">
        <CommandInput />
        <Items />
      </CommandDialog>,
    );
    await findByRole("dialog", { name: "Command center" });
  });

  it("lets Enter on a control in the leading slot act on that control, not the list", async () => {
    const onClear = vi.fn();
    const onSelect = vi.fn();
    const { findByRole } = render(
      <CommandDialog
        open
        leading={
          <button type="button" onClick={onClear}>
            Clear scope
          </button>
        }
        footer={<button type="button">Help</button>}
      >
        <CommandInput />
        <CommandList>
          <CommandItem onSelect={onSelect}>Weekly sales</CommandItem>
        </CommandList>
      </CommandDialog>,
    );
    const clear = await findByRole("button", { name: "Clear scope" });
    await waitFor(() =>
      expect(document.querySelector('[cmdk-item][data-selected="true"]')).not.toBeNull(),
    );
    clear.focus();
    fireEvent.keyDown(clear, { key: "Enter" });
    // A native button turns Enter into a click; happy-dom does not, so click too.
    fireEvent.click(clear);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();

    const help = await findByRole("button", { name: "Help" });
    fireEvent.keyDown(help, { key: "Enter" });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("does not render empty slots for falsy values", async () => {
    const { findByRole } = render(
      <CommandDialog open leading={false} footer={false}>
        <CommandInput />
        <Items />
      </CommandDialog>,
    );
    const dialog = await findByRole("dialog");
    expect(dialog.querySelector('[data-slot="command-footer"]')).toBeNull();
    expect(dialog.querySelector('[data-slot="command-input-leading"]')).toBeNull();
  });

  it("closes on Escape", async () => {
    const onOpenChange = vi.fn();
    const { findByRole } = render(
      <CommandDialog open onOpenChange={onOpenChange}>
        <CommandInput />
        <Items />
      </CommandDialog>,
    );
    await findByRole("dialog");
    const input = await findByRole("combobox");
    await waitFor(() => expect(document.activeElement).toBe(input));
    fireEvent.keyDown(input, { key: "Escape" });
    await waitFor(() => expect(onOpenChange).toHaveBeenCalled());
    expect(onOpenChange.mock.calls[0][0]).toBe(false);
  });

  it("uses the tall list default in the dialog and still honours a caller's max height", async () => {
    const { findByRole } = render(
      <CommandDialog open>
        <CommandInput />
        <CommandList className="max-h-40">
          <CommandItem>Weekly sales</CommandItem>
        </CommandList>
      </CommandDialog>,
    );
    const dialog = await findByRole("dialog");
    const list = dialog.querySelector("[cmdk-list]")!;
    expect(list.className).toContain("max-h-40");
    expect(list.className).not.toContain("max-h-[60vh]");
    const { container } = render(
      <CommandDialog open>
        <CommandList />
      </CommandDialog>,
    );
    void container;
    expect(document.querySelectorAll("[cmdk-list]")[1]!.className).toContain("max-h-[60vh]");
  });
});
