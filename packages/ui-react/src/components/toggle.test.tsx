import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { GridIcon, ListIcon } from "../icons";
import { Toggle, type ToggleProps } from "./toggle";

const classesOf = (el: Element) => el.className.split(/\s+/);

function renderToggle(props: Partial<ToggleProps<string>> = {}) {
  return render(
    <Toggle
      value="grid"
      onValueChange={() => {}}
      options={[
        { value: "grid", icon: <GridIcon />, ariaLabel: "Grid view" },
        { value: "list", icon: <ListIcon />, ariaLabel: "List view" },
      ]}
      {...props}
    />,
  );
}

describe("Toggle", () => {
  it("renders the list as the same well as Input, height-matched per size", () => {
    const sm = renderToggle({ size: "sm" });
    const smList = classesOf(sm.getByRole("tablist"));
    expect(smList).toEqual(
      expect.arrayContaining([
        "rounded-md",
        "bg-neutral-bg-subtle",
        "shadow-inner",
        "ring-[0.5px]",
        "ring-neutral-border",
        "h-8",
      ]),
    );
    sm.unmount();

    const { getByRole } = renderToggle();
    expect(classesOf(getByRole("tablist"))).toContain("h-10");
  });

  it("tints the active segment flat, with no shadow or border", () => {
    const { getByRole } = renderToggle({ size: "sm" });
    const active = getByRole("tab", { name: "Grid view" });
    const classes = classesOf(active);

    expect(active.hasAttribute("data-active")).toBe(true);
    expect(classes).toEqual(
      expect.arrayContaining([
        "data-[active]:bg-neutral-fg/[0.06]",
        "data-[active]:text-neutral-fg",
        "data-[active]:shadow-none",
        "border-0",
        "text-neutral-fg-subtle",
        "not-data-[active]:hover:bg-neutral-fg/[0.035]",
        "duration-150",
        "motion-reduce:transition-none",
      ]),
    );
    // No raised treatment from the Tabs primitive leaks into the well.
    expect(classes.some((c) => c.includes("shadow-[") || c === "shadow-sm")).toBe(false);
    expect(classes.some((c) => c.startsWith("data-[active]:border-neutral"))).toBe(false);
  });

  it("makes icon-only segments square", () => {
    const { getByRole } = renderToggle({ size: "sm" });
    const classes = classesOf(getByRole("tab", { name: "List view" }));

    expect(classes).toEqual(expect.arrayContaining(["aspect-square", "h-full", "px-0"]));
  });

  it("leaves the outline variant's pill styling in place", () => {
    const { getByRole } = renderToggle({ variant: "outline" });

    expect(classesOf(getByRole("tablist"))).toContain("rounded-full");
    expect(classesOf(getByRole("tablist"))).not.toContain("shadow-inner");
  });
});
