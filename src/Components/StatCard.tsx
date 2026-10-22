import React from "react";
import clsx from "clsx";

export type StatCardTone = "indigo" | "emerald" | "amber" | "violet" | "rose" | "blue";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  tone?: StatCardTone;
  subtitle?: string;
  trend?: string;
  trendPositive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  tone = "indigo",
  subtitle,
  trend,
  trendPositive = true,
  onClick,
  className,
}) => {
  const toneStyles: Record<
    StatCardTone,
    { iconBg: string; iconText: string; iconBorder: string; hoverBorder: string }
  > = {
    indigo: {
      iconBg: "bg-indigo-500/10",
      iconText: "text-indigo-400",
      iconBorder: "border-indigo-500/20",
      hoverBorder: "hover:border-indigo-500/40",
    },
    emerald: {
      iconBg: "bg-emerald-500/10",
      iconText: "text-emerald-400",
      iconBorder: "border-emerald-500/20",
      hoverBorder: "hover:border-emerald-500/40",
    },
    amber: {
      iconBg: "bg-amber-500/10",
      iconText: "text-amber-400",
      iconBorder: "border-amber-500/20",
      hoverBorder: "hover:border-amber-500/40",
    },
    violet: {
      iconBg: "bg-violet-500/10",
      iconText: "text-violet-400",
      iconBorder: "border-violet-500/20",
      hoverBorder: "hover:border-violet-500/40",
    },
    rose: {
      iconBg: "bg-rose-500/10",
      iconText: "text-rose-400",
      iconBorder: "border-rose-500/20",
      hoverBorder: "hover:border-rose-500/40",
    },
    blue: {
      iconBg: "bg-blue-500/10",
      iconText: "text-blue-400",
      iconBorder: "border-blue-500/20",
      hoverBorder: "hover:border-blue-500/40",
    },
  };

  const currentTone = toneStyles[tone];

  return (
    <div
      onClick={onClick}
      className={clsx(
        "relative rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-5 backdrop-blur-xl transition-all duration-200",
        currentTone.hoverBorder,
        onClick && "cursor-pointer hover:-translate-y-0.5 shadow-lg",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight text-white">{value}</h3>
          {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
        </div>

        {icon && (
          <div
            className={clsx(
              "p-3 rounded-2xl border shrink-0 transition-transform",
              currentTone.iconBg,
              currentTone.iconText,
              currentTone.iconBorder,
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3.5 flex items-center gap-1.5 pt-3 border-t border-zinc-800/50">
          <span
            className={clsx(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              trendPositive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20",
            )}
          >
            {trend}
          </span>
          <span className="text-[11px] text-zinc-500">vs historical baseline</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
