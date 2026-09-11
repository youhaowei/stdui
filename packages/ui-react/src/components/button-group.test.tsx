import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ButtonGroup } from "./button-group";

describe("ButtonGroup", () => {
  it("forwards an action's native attributes to the rendered button", () => {
    const { getByRole } = render(
      <ButtonGroup
        actions={[{ label: "Save", id: "save", "aria-describedby": "hint", title: "Save now" }]}
      />,
    );

    const button = getByRole("button", { name: "Save" });
    expect(button.getAttribute("id")).toBe("save");
    expect(button.getAttribute("aria-describedby")).toBe("hint");
    expect(button.getAttribute("title")).toBe("Save now");
  });

  it("forwards attributes for grouped actions too, without leaking grouping fields", () => {
    const { getByRole } = render(
      <ButtonGroup
        actions={[
          { label: "Undo", group: "edit", id: "undo", active: true },
          { label: "Redo", group: "edit", id: "redo", disabled: true },
        ]}
      />,
    );

    const undo = getByRole("button", { name: "Undo" });
    expect(undo.getAttribute("id")).toBe("undo");
    expect(undo.getAttribute("aria-pressed")).toBe("true");
    expect(undo.hasAttribute("group")).toBe(false);

    const redo = getByRole("button", { name: "Redo" });
    expect(redo.getAttribute("id")).toBe("redo");
    expect((redo as HTMLButtonElement).disabled).toBe(true);
  });

  it("forwards a nested action's attributes to its menu item", async () => {
    const { getByRole } = render(
      <ButtonGroup
        actions={[
          {
            label: "More",
            actions: [{ label: "Duplicate", id: "duplicate", "aria-describedby": "dup-hint" }],
          },
        ]}
      />,
    );

    fireEvent.click(getByRole("button", { name: "More" }));

    const item = await screen.findByRole("menuitem", { name: "Duplicate" });
    expect(item.getAttribute("id")).toBe("duplicate");
    expect(item.getAttribute("aria-describedby")).toBe("dup-hint");
  });
});
