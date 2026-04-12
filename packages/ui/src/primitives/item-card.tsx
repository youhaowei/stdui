import * as React from "react";
import { MoreIcon } from "@stdui/icons";
import { cn } from "../lib/utils";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export interface ItemAction {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  color?: "danger";
}

// ============================================================================
// Helper: Build wrapper props based on interaction mode
// ============================================================================

interface WrapperPropsParams {
  isDisabled: boolean;
  useButtonWrapper: boolean;
  onClick?: () => void;
  active: boolean;
}

function buildWrapperProps({ isDisabled, useButtonWrapper, onClick, active }: WrapperPropsParams) {
  if (isDisabled) {
    return { "aria-disabled": true };
  }
  if (useButtonWrapper) {
    return {
      type: "button" as const,
      onClick,
      "aria-selected": active,
      role: "option",
    };
  }
  if (onClick) {
    return {
      role: "button" as const,
      tabIndex: 0,
      "aria-selected": active,
      onClick,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      },
    };
  }
  return {};
}

// ============================================================================
// Helper: Actions dropdown menu
// ============================================================================

function ActionsMenu({ actions }: { actions: ItemAction[] }) {
  return (
    <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-fg-subtle hover:text-neutral-fg"
            >
              <MoreIcon className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          {actions.map((action, index) => (
            <DropdownMenuItem
              key={index}
              onClick={action.onClick}
              className={cn(
                action.color === "danger" && "text-palette-danger focus:text-palette-danger",
              )}
            >
              {action.icon && <action.icon className="h-4 w-4" />}
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ============================================================================
// Helper: Content section
// ============================================================================

interface ContentSectionProps {
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  content?: React.ReactNode;
  badge?: string;
  actions?: ItemAction[];
  active: boolean;
  isDisabled: boolean;
  isActiveAndEnabled: boolean;
  disabledReason: string | null;
  hasPreview: boolean;
}

function ContentSection({
  icon,
  title,
  subtitle,
  content,
  badge,
  actions,
  active,
  isDisabled,
  isActiveAndEnabled,
  disabledReason,
  hasPreview,
}: ContentSectionProps) {
  const hasActions = actions && actions.length > 0;

  return (
    <div className={cn(hasPreview ? "p-4" : "px-3.5 py-3")}>
      <div className="flex items-center gap-2">
        {icon && (
          <div
            className={cn(
              "shrink-0 rounded p-1.5 transition-colors",
              active
                ? "bg-palette-primary/10 text-palette-primary"
                : "bg-neutral-bg-dim text-neutral-fg-subtle",
            )}
          >
            {icon}
          </div>
        )}
        {title && (
          <p
            className={cn(
              "min-w-0 truncate text-sm font-medium transition-colors",
              isDisabled && "text-neutral-fg-subtle",
              isActiveAndEnabled && "text-palette-primary",
              !isDisabled && !active && "text-neutral-fg",
            )}
          >
            {title}
          </p>
        )}
        {subtitle && <span className="shrink-0 text-xs text-neutral-fg-subtle">{subtitle}</span>}
        {badge && (
          <span className="shrink-0 rounded-full bg-neutral-bg-dim px-2 py-0.5 text-xs text-neutral-fg-subtle">
            {badge}
          </span>
        )}
        <div className="flex-1" />
        {hasActions && !isDisabled && <ActionsMenu actions={actions} />}
      </div>
      {content && <div className="mt-2">{content}</div>}
      {disabledReason && <p className="mt-1 text-xs text-neutral-fg-subtle">{disabledReason}</p>}
    </div>
  );
}

export interface ItemCardProps {
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  content?: React.ReactNode;
  badge?: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  preview?: React.ReactNode;
  previewHeight?: number;
  actions?: ItemAction[];
  disabled?: boolean | string;
}

function ItemCard({
  icon,
  title,
  subtitle,
  content,
  badge,
  onClick,
  active = false,
  className,
  preview,
  previewHeight = 200,
  actions,
  disabled,
}: ItemCardProps) {
  const hasActions = actions && actions.length > 0;
  const isDisabled = Boolean(disabled);
  const disabledReason = typeof disabled === "string" ? disabled : null;
  const isClickable = Boolean(onClick) && !isDisabled;
  const isActiveAndEnabled = active && !isDisabled;

  const useButtonWrapper = Boolean(onClick) && !hasActions && !isDisabled;
  const Wrapper = useButtonWrapper ? "button" : "div";
  const wrapperProps = buildWrapperProps({
    isDisabled,
    useButtonWrapper,
    onClick,
    active,
  });

  const contentSectionProps = {
    icon,
    title,
    subtitle,
    content,
    badge,
    actions,
    active,
    isDisabled,
    isActiveAndEnabled,
    disabledReason,
    hasPreview: Boolean(preview),
  };

  if (preview) {
    return (
      <Wrapper
        {...wrapperProps}
        className={cn(
          "group w-full overflow-hidden rounded-lg border text-left transition-colors transition-shadow",
          isDisabled && "cursor-not-allowed border-neutral-border/40 opacity-50",
          isClickable && "cursor-pointer hover:bg-neutral-bg-dim/50",
          isActiveAndEnabled && "border-palette-primary ring-2 ring-palette-primary",
          !isDisabled && !active && "border-neutral-border/60 hover:border-neutral-border",
          className,
        )}
      >
        <div className="w-full bg-neutral-bg-dim/30" style={{ height: `${previewHeight}px` }}>
          {preview}
        </div>
        <ContentSection {...contentSectionProps} />
      </Wrapper>
    );
  }

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "group w-full rounded-lg border text-left transition-colors transition-shadow",
        isDisabled && "cursor-not-allowed border-neutral-border/40 opacity-50",
        isClickable && "cursor-pointer hover:bg-neutral-bg-dim/50",
        isActiveAndEnabled && "border-palette-primary bg-palette-primary/5",
        !isDisabled &&
          !active &&
          "border-neutral-border/60 bg-neutral-bg-subtle/50 hover:border-neutral-border hover:bg-neutral-bg-dim/30",
        className,
      )}
    >
      <ContentSection {...contentSectionProps} />
    </Wrapper>
  );
}

export { ItemCard };
