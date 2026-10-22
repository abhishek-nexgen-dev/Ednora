import { Eye, EyeOff, Lock } from "lucide-react";
import React, { useState } from "react";

interface PasswordInputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

export function PasswordInput({
  label = "Password",
  value,
  placeholder = "••••••••",
  onChange,
  error,
  required = false,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-400">
          {label}
          {required && <span className="ml-1 text-rose-400">*</span>}
        </label>
      )}

      <div
        className={`flex h-11 items-center rounded-xl border px-3.5 transition-all outline-none ${
          error
            ? "border-rose-500/80 bg-rose-950/20 text-rose-200 focus-within:ring-2 focus-within:ring-rose-500/20"
            : "border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-zinc-900"
        }`}
      >
        <Lock size={16} className="mr-2.5 text-zinc-400 shrink-0" />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none w-full"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="text-zinc-500 hover:text-zinc-300 p-1 focus:outline-none transition shrink-0"
          title={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {error && <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>}
    </div>
  );
}
