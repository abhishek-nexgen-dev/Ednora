import React from "react";
import { ChevronDown } from "lucide-react";

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  error?: string;
  required?: boolean;
}

export function SelectField({ label, options, error, required, className = "", ...props }: SelectFieldProps) {
  return (
    <div className="space-y-1.5 w-full">
      <label
        htmlFor={props.id || props.name}
        className="block text-xs font-semibold uppercase tracking-wider text-zinc-400"
      >
        {label}
        {required && <span className="ml-1 text-rose-400">*</span>}
      </label>

      <div className="relative">
        <select
          {...props}
          className={`
            h-11
            w-full
            appearance-none
            rounded-xl
            border
            px-3.5
            pr-10
            text-xs sm:text-sm
            text-zinc-100
            outline-none
            transition-all
            ${
              error
                ? "border-rose-500/80 bg-rose-950/20 text-rose-200 ring-2 ring-rose-500/20"
                : "border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 hover:bg-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            }
            ${className}
          `}
        >
          <option value="" className="bg-[#0C0D14] text-zinc-500">
            Select an option
          </option>

          {options.map((option) => (
            <option key={option} value={option} className="bg-[#0C0D14] text-zinc-200">
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
        />
      </div>

      {error && <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>}
    </div>
  );
}
