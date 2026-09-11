import { cn } from "../lib/utils";
import { ButtonGroup as PrimitiveButtonGroup } from "../primitives/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";
import { Button, type ButtonProps, type ItemAction } from "./button";

export type { ItemAction };

export interface ButtonGroupProps {
  actions: ItemAction[];
  className?: string;
  /**
   * Icon-only mode applied to all top-level buttons
   */
  iconOnly?: boolean;
}

/**
 * Group consecutive actions with the same group identifier.
 * Single actions are returned as-is, while grouped actions are returned as arrays.
 */
function groupActions(actions: ItemAction[]): (ItemAction | ItemAction[])[] {
  const result: (ItemAction | ItemAction[])[] = [];
  let currentGroup: ItemAction[] = [];
  let currentGroupId: string | undefined;

  for (const action of actions) {
    if (action.group && action.group === currentGroupId) {
      currentGroup.push(action);
    } else {
      if (currentGroup.length > 0) {
        result.push(currentGroup.length === 1 ? currentGroup[0]! : currentGroup);
      }
      currentGroup = [action];
      currentGroupId = action.group;
    }
  }

  if (currentGroup.length > 0) {
    result.push(currentGroup.length === 1 ? currentGroup[0]! : currentGroup);
  }

  return result;
}

/**
 * Split an action into the props `<Button>` takes and the fields ButtonGroup
 * consumes itself (`group`, `actions`, `href`), so everything else an
 * `ItemAction` accepts — native attributes included — reaches the button
 * instead of being dropped by a whitelist.
 */
function toButtonProps(action: ItemAction, iconOnly: boolean): ButtonProps {
  const { group: _group, actions: _actions, href: _href, ...buttonProps } = action;
  return { ...buttonProps, iconOnly: action.iconOnly ?? iconOnly };
}

/**
 * Render a dropdown menu action with nested items.
 */
function DropdownAction({ action, iconOnly }: { action: ItemAction; iconOnly: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          // The trigger opens the menu, so the action's own onClick stays behind.
          <Button {...toButtonProps(action, iconOnly)} onClick={undefined} />
        }
      />
      <DropdownMenuContent align="end">
        {action.actions?.map((nestedAction, nestedIndex) => (
          <DropdownMenuItem key={nestedIndex} onClick={nestedAction.onClick}>
            {nestedAction.icon && <nestedAction.icon aria-hidden />}
            {nestedAction.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * ButtonGroup - Renders a group of action buttons with grouping and dropdown support
 *
 * Supports visual grouping (via `group` property) and nested dropdowns (via `actions` property).
 *
 * @example
 * ```tsx
 * <ButtonGroup
 *   actions={[
 *     { label: 'Save', onClick: handleSave, icon: Save, group: 'edit' },
 *     { label: 'Undo', onClick: handleUndo, icon: Undo, group: 'edit' },
 *     { label: 'Delete', onClick: handleDelete, icon: Trash, color: 'danger' },
 *   ]}
 * />
 * ```
 */
export function ButtonGroup({ actions, className, iconOnly = false }: ButtonGroupProps) {
  if (actions.length === 0) return null;

  const groupedActions = groupActions(actions);

  return (
    <div className={cn("flex shrink-0 flex-wrap items-center gap-2", className)}>
      {groupedActions.map((item, index) => {
        // Single action (not grouped)
        if (!Array.isArray(item)) {
          // Dropdown action (has nested actions)
          if (item.actions && item.actions.length > 0) {
            return <DropdownAction key={index} action={item} iconOnly={iconOnly} />;
          }

          // Regular single action
          return <Button key={index} {...toButtonProps(item, iconOnly)} />;
        }

        // Group of actions (ButtonGroup)
        return (
          <PrimitiveButtonGroup key={index}>
            {item.map((groupedAction, groupedIndex) => (
              <Button key={groupedIndex} {...toButtonProps(groupedAction, iconOnly)} />
            ))}
          </PrimitiveButtonGroup>
        );
      })}
    </div>
  );
}
