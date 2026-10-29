import React, { useEffect, useRef, useState, KeyboardEvent } from "react";
import { ChevronDown, Check } from "lucide-react";
import clsx from "clsx";

export type DropDownOption = string | number | { label: string; value: string | number };

export type DropDownProps = {
  options: DropDownOption[];
  label?: string;
  error?: string;
  onSelect: (option: string | number) => void;
  className?: string;
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
};

const getOptionValue = (opt: DropDownOption): string | number => {
  if (typeof opt === "object" && opt !== null && "value" in opt) {
    return opt.value;
  }
  return opt;
};

const getOptionLabel = (opt: DropDownOption): string => {
  if (typeof opt === "object" && opt !== null && "label" in opt) {
    return opt.label;
  }
  return String(opt);
};

const DropDown: React.FC<DropDownProps> = ({
  options,
  onSelect,
  className = "",
  label,
  value,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine current label to display
  const currentOpt = options.find((opt) => String(getOptionValue(opt)) === String(value));
  const displayedLabel = currentOpt
    ? getOptionLabel(currentOpt)
    : value !== undefined && value !== ""
    ? String(value)
    : "";

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  const handleSelect = (opt: DropDownOption) => {
    if (disabled) return;
    const val = getOptionValue(opt);
    onSelect(val);
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        setOpen((prev) => !prev);
        break;

      case "Escape":
        setOpen(false);
        break;

      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpen(true);
        break;

      case "ArrowUp":
        e.preventDefault();
        if (open) setOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={clsx("space-y-1.5 relative w-full", className)}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {label}
          {required && <span className="ml-1 text-rose-400">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        disabled={disabled || options.length === 0}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={clsx(
          "flex h-11 w-full items-center justify-between gap-2.5 rounded-xl border px-3.5 text-xs sm:text-sm font-medium transition-all outline-none",
          error
            ? "border-rose-500/80 bg-rose-950/20 text-rose-200 ring-2 ring-rose-500/20"
            : open
            ? "border-indigo-500 bg-zinc-900 text-white ring-2 ring-indigo-500/25 shadow-lg shadow-indigo-500/10"
            : "border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-100",
          disabled && "cursor-not-allowed opacity-50 bg-zinc-950",
        )}
      >
        <span
          className={clsx(
            "flex-1 truncate text-left",
            displayedLabel ? "text-zinc-100 font-medium" : "text-zinc-500",
          )}
        >
          {displayedLabel || placeholder}
        </span>

        <ChevronDown
          size={16}
          className={clsx(
            "shrink-0 text-zinc-400 transition-transform duration-200",
            open && "rotate-180 text-indigo-400",
          )}
        />
      </button>

      {open && options.length > 0 && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-1.5 w-full max-h-60 overflow-y-auto rounded-2xl border border-zinc-800/90 bg-[#0C0D14]/95 backdrop-blur-xl shadow-2xl p-1.5 space-y-0.5 animate-fadeIn outline-none"
        >
          {options.map((opt, idx) => {
            const val = getOptionValue(opt);
            const optLabel = getOptionLabel(opt);
            const isSelected = String(val) === String(value);

            return (
              <li key={`${val}-${idx}`} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={clsx(
                    "w-full px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between",
                    isSelected
                      ? "bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/30 shadow-sm"
                      : "text-zinc-300 hover:text-white hover:bg-zinc-800/60 border border-transparent",
                  )}
                >
                  <span className="truncate">{optLabel}</span>
                  {isSelected && <Check size={14} className="text-indigo-400 shrink-0 ml-2" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>}
    </div>
  );
};

export default DropDown;
