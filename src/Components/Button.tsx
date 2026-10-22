import React from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  text?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  rightIcon,
  children,
  text,
  fullWidth = false,
  disabled,
  className,
  ...props
}) => {
  const content = children || text;

  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#07080C] disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/40 focus:ring-indigo-500",
    secondary:
      "bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 hover:border-zinc-700 focus:ring-zinc-600",
    outline:
      "bg-transparent hover:bg-zinc-800/60 text-zinc-300 border border-zinc-700 hover:text-white focus:ring-zinc-600",
    ghost:
      "bg-transparent hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-100 focus:ring-zinc-600 border border-transparent",
    danger:
      "bg-rose-600/90 hover:bg-rose-600 text-white shadow-lg shadow-rose-600/20 border border-rose-500/40 focus:ring-rose-500",
    success:
      "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 border border-emerald-500/40 focus:ring-emerald-500",
  };

  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth ? "w-full" : "w-auto",
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2
          className="animate-spin shrink-0"
          size={size === "sm" ? 14 : size === "lg" ? 18 : 16}
        />
      ) : icon ? (
        <span className="shrink-0 flex items-center">{icon}</span>
      ) : null}

      {content && <span>{content}</span>}

      {!loading && rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
    </button>
  );
};

export default Button;
