import type * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Select, SelectTrigger, SelectValue } from "./select";
import { inputVariants } from "./input";

const classesOf = (el: Element) => el.className.split(/\s+/);

const items = [
  { value: "updated", label: "Last updated" },
  { value: "name", label: "Name" },
];

function renderTrigger(
  props: React.ComponentProps<typeof SelectTrigger> = {},
  value: string | null = "updated",
) {
  const { getByRole } = render(
    <Select defaultValue={value} items={items}>
      <SelectTrigger aria-label="Sort by" {...props}>
        <SelectValue placeholder="Choose…" />
      </SelectTrigger>
    </Select>,
  );
  return getByRole("combobox");
}

const WELL = [
  "border-0",
  "bg-neutral-bg-subtle",
  "shadow-inner",
  "ring-[0.5px]",
  "ring-neutral-border",
  "focus-visible:ring-2",
  "focus-visible:ring-neutral-ring",
];

describe("SelectTrigger", () => {
  it("sits in Input's well by default, with a subtle hover and no ring offset", () => {
    const classes = classesOf(renderTrigger());

    expect(classes).toEqual(
      expect.arrayContaining([
        ...WELL,
        "enabled:hover:bg-neutral-bg-muted",
        "transition-colors",
        "duration-150",
        "motion-reduce:transition-none",
      ]),
    );
    expect(classes).not.toContain("border-neutral-border");
    expect(classes).not.toContain("bg-neutral-bg");
    expect(classes.some((c) => c.startsWith("focus-visible:ring-offset"))).toBe(false);
  });

  it("uses exactly Input's well classes", () => {
    const inputClasses = inputVariants({ variant: "default" }).split(/\s+/);
    const triggerClasses = classesOf(renderTrigger());

    for (const c of WELL) expect(inputClasses).toContain(c);
    expect(triggerClasses).toEqual(expect.arrayContaining(WELL));
  });

  it.each([
    ["default", "h-10", "px-3"],
    ["sm", "h-8", "px-2"],
  ] as const)("matches Input's height at size %s", (size, height, padding) => {
    const inputClasses = inputVariants({ size }).split(/\s+/);
    const triggerClasses = classesOf(renderTrigger({ size }));

    expect(inputClasses).toEqual(expect.arrayContaining([height, padding]));
    expect(triggerClasses).toEqual(expect.arrayContaining([height, padding]));
  });

  it("marks an unset select with a dashed outline that yields to keyboard focus", () => {
    const trigger = renderTrigger({}, null);

    expect(trigger.hasAttribute("data-placeholder")).toBe(true);
    expect(classesOf(trigger)).toEqual(
      expect.arrayContaining([
        "data-[placeholder]:text-neutral-fg-subtle",
        "data-[placeholder]:not-focus-visible:ring-0",
        "data-[placeholder]:not-focus-visible:outline-1",
        "data-[placeholder]:not-focus-visible:outline-dashed",
        "data-[placeholder]:not-focus-visible:outline-neutral-ring",
        "data-[placeholder]:not-focus-visible:-outline-offset-1",
      ]),
    );
  });

  it("drops the placeholder attribute once a value is set", () => {
    expect(renderTrigger().hasAttribute("data-placeholder")).toBe(false);
  });

  it("renders the chevron in the subtle foreground", () => {
    const svg = renderTrigger().querySelector("svg");

    expect(svg).not.toBeNull();
    expect(classesOf(svg!)).toEqual(
      expect.arrayContaining(["h-4", "w-4", "text-neutral-fg-subtle"]),
    );
    expect(classesOf(svg!)).not.toContain("opacity-50");
  });

  it("leaves the ghost variant unchanged", () => {
    const classes = classesOf(renderTrigger({ variant: "ghost" }));

    expect(classes).toEqual(
      expect.arrayContaining([
        "border",
        "border-transparent",
        "bg-transparent",
        "shadow-none",
        "hover:border-neutral-border",
        "hover:bg-neutral-bg-subtle",
        "focus:border-neutral-border",
        "focus:bg-neutral-bg",
        "focus-visible:ring-2",
        "focus-visible:ring-neutral-ring",
      ]),
    );
    expect(classes).not.toContain("shadow-inner");
    expect(classes.some((c) => c.includes("outline-dashed"))).toBe(false);
  });

  it("offers an outline variant: bordered, raised, no well", () => {
    const classes = classesOf(renderTrigger({ variant: "outline" }));

    expect(classes).toEqual(
      expect.arrayContaining([
        "border",
        "border-neutral-border",
        "bg-neutral-bg",
        "shadow-none",
        "enabled:hover:bg-neutral-bg-subtle",
        "focus-visible:ring-2",
        "focus-visible:ring-neutral-ring",
        "h-10",
        "px-3",
      ]),
    );
    expect(classes).not.toContain("shadow-inner");
    expect(classes).not.toContain("bg-neutral-bg-subtle");
    expect(classes).not.toContain("ring-[0.5px]");
    expect(classes.some((c) => c.startsWith("focus-visible:ring-offset"))).toBe(false);
  });

  it("turns the outline border dashed while unset and unfocused", () => {
    const trigger = renderTrigger({ variant: "outline" }, null);

    expect(trigger.hasAttribute("data-placeholder")).toBe(true);
    expect(classesOf(trigger)).toEqual(
      expect.arrayContaining([
        "data-[placeholder]:text-neutral-fg-subtle",
        "data-[placeholder]:not-focus-visible:border-dashed",
      ]),
    );
  });
});
