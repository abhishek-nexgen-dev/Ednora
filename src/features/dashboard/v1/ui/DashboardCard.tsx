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

  return (
    <div
      className={clsx(
        `relative
        overflow-hidden
        rounded-2xl sm:rounded-3xl
        border
        w-full
        p-4 sm:p-5
        flex flex-col justify-between
        transition-all
        duration-300
        hover:shadow-[0_10px_30px_rgba(99,102,241,0.12)]
        hover:-translate-y-0.5`,
        isActive
          ? "border-indigo-500/40 bg-gradient-to-b from-indigo-950/25 to-zinc-950 shadow-md shadow-indigo-950/40"
          : "border-zinc-800/80 bg-zinc-950/80 hover:border-zinc-700",
      )}
    >
      {/* Background Icon Watermark */}
      <div className="absolute -right-2 -top-2 opacity-[0.06] text-white pointer-events-none">
        {logo}
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <p className="text-xs sm:text-sm text-zinc-400 font-medium truncate tracking-tight">
          {title}
        </p>

        <div className="flex items-baseline gap-2">
          <h2 className="text-xl sm:text-2xl xl:text-3xl font-bold text-white tracking-tight font-mono">
            {value}
          </h2>
        </div>
      </div>

      {/* Target Progress Bar */}
      <div className="mt-4 sm:mt-5 pt-2 border-t border-zinc-900/80">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-zinc-500">Target Progress</span>
          <span className="font-semibold text-indigo-300 font-mono">{percent}%</span>
        </div>

        <div className="h-1.5 w-full rounded-full bg-zinc-900 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
