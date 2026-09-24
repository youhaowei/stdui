import { describe, expect, it, beforeAll } from "vitest";
import { render, waitFor } from "@testing-library/react";
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
  it("gives the selected row a fill that differs from the list", async () => {
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
    expect(selectedFill).toBe("data-[selected=true]:bg-neutral-bg-muted");
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
});
