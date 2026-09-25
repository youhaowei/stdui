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
    fireEvent.click(other!);
    fireEvent.click(screen.getByRole("button", { name: "Reset to Default" }));
    expect(screen.queryByRole("button", { name: "Reset to Default" })).toBeNull();
  });
});
