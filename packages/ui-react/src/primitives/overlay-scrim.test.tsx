import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from "./alert-dialog";
import { Dialog, DialogContent, DialogTitle } from "./dialog";
import { Sheet, SheetContent, SheetTitle } from "./sheet";

const overlays = {
  Dialog: (
    <Dialog open>
      <DialogContent>
        <DialogTitle>Dialog</DialogTitle>
      </DialogContent>
    </Dialog>
  ),
  AlertDialog: (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogTitle>Alert</AlertDialogTitle>
      </AlertDialogContent>
    </AlertDialog>
  ),
  Sheet: (
    <Sheet open>
      <SheetContent>
        <SheetTitle>Sheet</SheetTitle>
      </SheetContent>
    </Sheet>
  ),
};

describe("modal overlays", () => {
  it.each(Object.entries(overlays))("%s dims the page with the shared scrim token", (_, ui) => {
    const { baseElement, unmount } = render(ui);
    const backdrop = baseElement.querySelector<HTMLElement>(".fixed.inset-0");
    expect(backdrop, "backdrop should render while open").not.toBeNull();

    const classes = backdrop!.className.split(/\s+/);
    expect(classes).toContain("bg-overlay-scrim");
    expect(classes.filter((name) => name.startsWith("bg-"))).toEqual(["bg-overlay-scrim"]);
    unmount();
  });

  it.each(Object.entries(overlays))("%s lifts its surface one step in dark mode", (_, ui) => {
    const { baseElement, unmount } = render(ui);
    const popup = baseElement.querySelector<HTMLElement>('[role="dialog"], [role="alertdialog"]');
    expect(popup, "popup should render while open").not.toBeNull();
    const classes = popup!.className.split(/\s+/);
    expect(classes).toEqual(expect.arrayContaining(["bg-neutral-bg", "dark:bg-neutral-bg-subtle"]));
    unmount();
  });
});
