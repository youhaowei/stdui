import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const EMPHASIS = "bg-neutral-bg-emphasis";

/** The data attributes this element's emphasis fill is gated on, e.g. `data-[popup-open]:bg-…` → `data-popup-open`. */
function emphasisStates(el: Element): string[] {
  return el.className
    .split(" ")
    .filter((c) => c.endsWith(`:${EMPHASIS}`) && c.startsWith("data-["))
    .map((c) => `data-${c.slice("data-[".length, c.indexOf("]"))}`);
}

function Menu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Export as</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>PNG</DropdownMenuItem>
            <DropdownMenuItem>CSV</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("DropdownMenu", () => {
  it("keeps the sub-menu trigger emphasised while its sub-menu is open", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const subTrigger = await screen.findByRole("menuitem", { name: "Export as" });
    subTrigger.focus();
    await user.keyboard("{ArrowRight}");

    const csv = await screen.findByRole("menuitem", { name: "CSV" });
    await waitFor(() => expect(subTrigger.hasAttribute("data-popup-open")).toBe(true));
    // Focus has moved into the sub-menu, so the trigger's emphasis must come
    // from an open-state attribute Base UI actually sets on it.
    expect(emphasisStates(subTrigger)).toContain("data-popup-open");
    expect(emphasisStates(subTrigger).some((attr) => subTrigger.hasAttribute(attr))).toBe(true);

    await user.hover(csv);
    await waitFor(() => expect(csv.hasAttribute("data-highlighted")).toBe(true));
    expect(emphasisStates(csv).some((attr) => csv.hasAttribute(attr))).toBe(true);
  });
});
