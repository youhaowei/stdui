import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Check } from "lucide-react";
import { Button } from "./button";

describe("Button", () => {
  it("forwards aria-* and data-* attributes to the rendered button", () => {
    const { getByRole } = render(
      <Button
        label="Bar chart"
        aria-disabled
        aria-describedby="chart-hint"
        data-testid="chart-tile"
        id="chart-tile-bar"
        title="Needs two columns"
      />,
    );

    const button = getByRole("button", { name: "Bar chart" });
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(button.getAttribute("aria-describedby")).toBe("chart-hint");
    expect(button.getAttribute("data-testid")).toBe("chart-tile");
    expect(button.getAttribute("id")).toBe("chart-tile-bar");
    expect(button.getAttribute("title")).toBe("Needs two columns");
  });

  it("keeps its own props working alongside forwarded attributes", () => {
    const { getByRole } = render(
      <Button
        label="Toggle grid"
        icon={Check}
        iconOnly
        active
        disabled
        className="custom-class"
        data-testid="toggle-grid"
      />,
    );

    const button = getByRole("button", { name: "Toggle grid" });
    // iconOnly still supplies the accessible name and title fallback
    expect(button.getAttribute("aria-label")).toBe("Toggle grid");
    expect(button.getAttribute("title")).toBe("Toggle grid");
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.getAttribute("data-active")).toBe("true");
    expect(button.getAttribute("data-testid")).toBe("toggle-grid");
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.className).toContain("custom-class");
  });

  it("keeps active in charge of the toggle state it drives", () => {
    const { getByRole } = render(
      // Deliberately contradictory input: active must win.
      <Button label="Toggle grid" active aria-pressed={false} data-active="false" />,
    );

    const button = getByRole("button", { name: "Toggle grid" });
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.getAttribute("data-active")).toBe("true");
  });

  it("forwards toggle attributes when active is not driving them", () => {
    const { getByRole } = render(
      <Button label="Filters" aria-pressed={false} data-active="maybe" />,
    );

    const button = getByRole("button", { name: "Filters" });
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(button.getAttribute("data-active")).toBe("maybe");
  });

  it("drops a forwarded data-active when active is explicitly false", () => {
    const { getByRole } = render(
      // Deliberately contradictory input: an explicit `active={false}` wins.
      <Button label="Toggle snap" active={false} aria-pressed data-active="true" />,
    );

    const button = getByRole("button", { name: "Toggle snap" });
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(button.hasAttribute("data-active")).toBe(false);
  });

  it("forwards attributes through asChild", () => {
    const { getByRole } = render(
      <Button label="Docs" asChild data-testid="docs-link" aria-describedby="docs-hint">
        <a href="/docs">Docs</a>
      </Button>,
    );

    const link = getByRole("link", { name: "Docs" });
    expect(link.getAttribute("data-testid")).toBe("docs-link");
    expect(link.getAttribute("aria-describedby")).toBe("docs-hint");
    expect(link.getAttribute("href")).toBe("/docs");
  });

  it("lets a forwarded aria-label override the icon-only default", () => {
    const { getByRole } = render(
      <Button label="Save" icon={Check} iconOnly aria-label="Save insight" />,
    );

    expect(getByRole("button", { name: "Save insight" })).toBeTruthy();
  });
});
