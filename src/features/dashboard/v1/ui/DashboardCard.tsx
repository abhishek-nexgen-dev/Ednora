import React from "react";
import clsx from "clsx";

type DashboardCardProps = {
  isActive: boolean;
  title: string;
  value: string | number;
  logo: React.ReactNode;
  range: [number, number];
};

export default function DashboardCard({ isActive, title, value, logo, range }: DashboardCardProps) {
  const percent = Math.min(100, Math.max(0, range[0] ?? 0));

  const formattedValue =
    typeof value === "number"
      ? title.toLowerCase().includes("earning")
        ? `₹${value.toLocaleString("en-IN")}`
        : value.toLocaleString("en-IN")
      : value;

  return (
    <div
      className={clsx(
        `relative group overflow-hidden rounded-3xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_36px_rgba(99,102,241,0.16)] hover:-translate-y-1 backdrop-blur-sm`,
        isActive
          ? "border-indigo-500/50 bg-gradient-to-br from-indigo-950/40 via-zinc-950 to-zinc-950 shadow-lg shadow-indigo-950/50"
          : "border-zinc-800/80 bg-zinc-950/80 hover:border-indigo-500/40 hover:bg-zinc-950",
      )}
    >
      {/* Background Glow Orb */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-indigo-600/10 blur-xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />

      {/* Watermark Icon */}
      <div className="absolute -right-2 -top-2 opacity-[0.06] group-hover:opacity-[0.14] transition-opacity text-white pointer-events-none">
        {logo}
      </div>

      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm text-zinc-400 font-medium truncate tracking-tight">{title}</p>
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/80 group-hover:bg-indigo-400 group-hover:scale-125 transition-all" />
        </div>

        <div className="flex items-baseline gap-2">
          <h2 className="text-xl sm:text-2xl xl:text-3xl font-bold text-white tracking-tight font-mono">
            {formattedValue}
          </h2>
        </div>
      </div>

      {/* Progress & Target */}
      <div className="mt-4 sm:mt-5 pt-3 border-t border-zinc-900/80 relative z-10">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-zinc-500 font-medium">Activity Target</span>
          <span className="font-semibold text-indigo-300 font-mono">{percent}%</span>
        </div>

        <div className="h-1.5 w-full rounded-full bg-zinc-900 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
