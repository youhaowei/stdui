import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { StduiProvider } from "../theme/provider";
import { ThemePanel } from "./theme-panel";

function renderPanel(props: Partial<Parameters<typeof ThemePanel>[0]> = {}) {
  return render(
    <StduiProvider storageKey="theme-panel-test">
      <ThemePanel isOpen {...props} />
    </StduiProvider>,
  );
}

describe("ThemePanel", () => {
  it("names itself and offers close as a standalone panel", () => {
    renderPanel({ onClose: () => {} });
    expect(screen.getByRole("heading", { name: "Appearance" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Close theme panel" })).toBeTruthy();
  });

  it("shows no close button when nothing can close it", () => {
    renderPanel();
    expect(screen.getByRole("heading", { name: "Appearance" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Close theme panel" })).toBeNull();
  });

  it("drops its title and close button inline, keeping every control", () => {
    renderPanel({ inline: true, onClose: () => {} });
    expect(screen.queryByRole("heading")).toBeNull();
    expect(screen.queryByRole("button", { name: "Close theme panel" })).toBeNull();
    expect(screen.getByRole("group", { name: "Theme" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Style" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Import theme/ })).toBeTruthy();
  });

  it("offers Reset inline once a style other than Default is picked", () => {
    renderPanel({ inline: true });
    expect(screen.queryByRole("button", { name: "Reset to Default" })).toBeNull();
    const styles = screen.getByRole("group", { name: "Style" });
    const other = [...styles.querySelectorAll("button")].find(
      (b) => b.getAttribute("aria-pressed") !== "true",
    );
    expect(other).toBeDefined();
    fireEvent.click(other!);
    const reset = screen.getByRole("button", { name: "Reset to Default" });
    // Inline, Reset is a labelled button in the Style row, not a title-row icon.
    expect(reset.textContent).toBe("Reset");
    fireEvent.click(reset);
    expect(screen.queryByRole("button", { name: "Reset to Default" })).toBeNull();
  });
});
