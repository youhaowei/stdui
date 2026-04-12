"use client";

// -- Utilities --
export { cn } from "./lib/utils";
export { colorVariants, sizeScale } from "./lib/variants";
export type { ColorVariant, SizeVariant } from "./lib/variants";
export { stateVariant } from "./lib/stateVariant";

// -- Primitives --
// Re-export everything except names that are overridden by composite components
export {
  // Button primitive exported as ButtonPrimitive (enhanced Button is the default)
  Button as ButtonPrimitive,
  buttonVariants,
  ghostActiveStyles,
} from "./primitives/button";
export type { ButtonProps as ButtonPrimitiveProps } from "./primitives/button";

export { Badge, badgeVariants } from "./primitives/badge";
export type { BadgeProps } from "./primitives/badge";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./primitives/dialog";

export {
  Card,
  cardVariants,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./primitives/card";
export type { CardProps } from "./primitives/card";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./primitives/select";

export { Tabs, TabsList, TabsTrigger, TabsContent } from "./primitives/tabs";
export { Input } from "./primitives/input";
export { Textarea } from "./primitives/textarea";
export { Label } from "./primitives/label";
export { Checkbox } from "./primitives/checkbox";
export { Switch } from "./primitives/switch";
export { Separator } from "./primitives/separator";

// Tooltip primitive exported as TooltipPrimitive (enhanced Tooltip is the default)
export {
  Tooltip as TooltipPrimitive,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./primitives/tooltip";

export { ScrollArea, ScrollBar } from "./primitives/scroll-area";
export { Progress } from "./primitives/progress";

// Batch 2 primitives
export * from "./primitives/alert-dialog";
export * from "./primitives/avatar";
export * from "./primitives/command";
export * from "./primitives/context-menu";
export * from "./primitives/dropdown-menu";
export * from "./primitives/popover";
export * from "./primitives/sheet";
export * from "./primitives/collapsible";
export * from "./primitives/alert";
export * from "./primitives/surface";
export * from "./primitives/table";
export * from "./primitives/skeleton";
export * from "./primitives/sonner";
export * from "./primitives/navigation-menu";
export * from "./primitives/multi-select";
export * from "./primitives/field";
export {
  ItemCard,
  type ItemCardProps,
  type ItemAction as ItemCardAction,
} from "./primitives/item-card";
export * from "./primitives/breadcrumb";
// ButtonGroup primitive exported as ButtonGroupPrimitive
export { ButtonGroup as ButtonGroupPrimitive } from "./primitives/button-group";

// -- Components (enhanced versions shadow primitives) --
export * from "./components/index";

// -- Fields --
export * from "./fields/index";
