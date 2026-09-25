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
});
