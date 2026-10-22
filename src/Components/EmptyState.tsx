import React from "react";
import clsx from "clsx";
import Button, { ButtonProps } from "./Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps["variant"];
    icon?: React.ReactNode;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-400 shadow-inner">
          {icon}
        </div>
      )}

      <h4 className="text-base font-semibold text-white">{title}</h4>

      {description && (
        <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5">
          <Button
            size="sm"
            variant={action.variant || "secondary"}
            onClick={action.onClick}
            icon={action.icon}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
