import React, { forwardRef } from "react";
import clsx from "clsx";

type InputType =
  "text" | "email" | "password" | "number" | "url" | "tel" | "time" | "date" | "search";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  name: string;
  placeholder?: string;
  value?: string | number;
  type?: InputType;
  onChange?: ((name: string, value: string) => void) | React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  error?: string | undefined;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  readonly?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      name,
      placeholder,
      value,
      type = "text",
      onChange,
      onKeyDown,
      error,
      readonly = false,
      readOnly,
      leftIcon,
      rightIcon,
      className,
      inputClassName,
      disabled,
      required,
      ...rest
    },
    ref,
  ) => {
    const isReadOnly = readOnly !== undefined ? readOnly : readonly;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (typeof onChange === "function") {
        if (onChange.length === 1) {
          (onChange as React.ChangeEventHandler<HTMLInputElement>)(e);
        } else {
          (onChange as (name: string, value: string) => void)(name, e.target.value);
        }
      }
    };

    return (
      <div className={clsx("space-y-1.5 w-full", className)}>
        {label && (
          <label
            htmlFor={name}
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-400"
          >
            {label}
            {required && <span className="ml-1 text-rose-400">*</span>}
          </label>
        )}

        <div
          className={clsx(
            "flex h-11 items-center gap-2.5 rounded-xl border px-3.5 transition-all outline-none",
            error
              ? "border-rose-500/80 bg-rose-950/20 text-rose-200 focus-within:ring-2 focus-within:ring-rose-500/20"
              : "border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-zinc-900",
            disabled && "cursor-not-allowed opacity-50 bg-zinc-950",
          )}
        >
          {leftIcon && <div className="shrink-0 text-zinc-400 flex items-center">{leftIcon}</div>}

          <input
            ref={ref}
            id={name}
            name={name}
            type={type}
            value={value !== undefined ? value : ""}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={isReadOnly}
            required={required}
            onKeyDown={onKeyDown}
            onChange={handleChange}
            className={clsx(
              "flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none w-full",
              inputClassName,
            )}
            {...rest}
          />

          {rightIcon && <div className="shrink-0 text-zinc-400 flex items-center">{rightIcon}</div>}
        </div>

        {error && <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
