import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Input } from "./input";

const classesOf = (el: HTMLElement) => el.className.split(/\s+/);

describe("Input", () => {
  it("renders the well by default: borderless, recessed, hairline ring", () => {
    const { getByRole } = render(<Input aria-label="Search" />);
    const classes = classesOf(getByRole("textbox"));

    expect(classes).toEqual(
      expect.arrayContaining([
        "border-0",
        "bg-neutral-bg-subtle",
        "shadow-inner",
        "ring-[0.5px]",
        "ring-neutral-border",
        "placeholder:text-neutral-fg-subtle",
        "focus-visible:ring-2",
        "focus-visible:ring-neutral-ring",
        "h-10",
      ]),
    );
    expect(classes).not.toContain("border-neutral-border");
    expect(classes).not.toContain("bg-neutral-bg");
  });

  it("keeps the small size at h-8 in the well", () => {
    const { getByRole } = render(<Input aria-label="Search" size="sm" />);
    const classes = classesOf(getByRole("textbox"));

    expect(classes).toEqual(
      expect.arrayContaining(["h-8", "bg-neutral-bg-subtle", "shadow-inner"]),
    );
  });

  it("leaves the ghost variant transparent", () => {
    const { getByRole } = render(<Input aria-label="Name" variant="ghost" />);
    const classes = classesOf(getByRole("textbox"));

    expect(classes).toContain("bg-transparent");
    expect(classes).not.toContain("shadow-inner");
  });

  it("offers an outline variant: bordered, raised, no well", () => {
    const { getByRole } = render(<Input aria-label="Search" variant="outline" size="sm" />);
    const classes = classesOf(getByRole("textbox"));

    expect(classes).toEqual(
      expect.arrayContaining([
        "border",
        "border-neutral-border",
        "bg-neutral-bg",
        "shadow-none",
        "placeholder:text-neutral-fg-subtle",
        "focus-visible:ring-2",
        "focus-visible:ring-neutral-ring",
        "h-8",
        "px-2",
      ]),
    );
    expect(classes).not.toContain("shadow-inner");
    expect(classes).not.toContain("bg-neutral-bg-subtle");
    expect(classes).not.toContain("ring-[0.5px]");
    expect(classes.some((c) => c.startsWith("focus-visible:ring-offset"))).toBe(false);
  });
});
