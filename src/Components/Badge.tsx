import React from "react";
import clsx from "clsx";

export type BadgeTone =
  "emerald" | "amber" | "rose" | "blue" | "indigo" | "violet" | "zinc" | "sky";

export interface BadgeProps {
  label?: string;
  children?: React.ReactNode;
  tone?: BadgeTone;
  status?: string;
  dot?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  children,
  tone,
  status,
  dot = false,
  size = "md",
  className,
}) => {
  const content = children || label || status;

  // Infer tone from status string if tone not explicitly provided
  const resolvedTone: BadgeTone =
    tone ||
    (() => {
      const s = String(status || label || "").toLowerCase();
      if (
        s.includes("approv") ||
        s.includes("paid") ||
        s.includes("active") ||
        s.includes("live") ||
        s.includes("success") ||
        s.includes("verified")
      ) {
        return "emerald";
      }
      if (
        s.includes("pend") ||
        s.includes("review") ||
        s.includes("sched") ||
        s.includes("warning")
      ) {
        return "amber";
      }
      if (
        s.includes("reject") ||
        s.includes("fail") ||
        s.includes("danger") ||
        s.includes("overdue") ||
        s.includes("urgent")
      ) {
        return "rose";
      }
      if (s.includes("info") || s.includes("enrolled")) {
        return "indigo";
      }
      return "zinc";
    })();

  const toneStyles: Record<BadgeTone, { bg: string; text: string; border: string; dot: string }> = {
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      dot: "bg-emerald-400",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
      dot: "bg-amber-400",
    },
    rose: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/20",
      dot: "bg-rose-400",
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
      dot: "bg-blue-400",
    },
    indigo: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-400",
      border: "border-indigo-500/20",
      dot: "bg-indigo-400",
    },
    violet: {
      bg: "bg-violet-500/10",
      text: "text-violet-400",
      border: "border-violet-500/20",
      dot: "bg-violet-400",
    },
    sky: {
      bg: "bg-sky-500/10",
      text: "text-sky-400",
      border: "border-sky-500/20",
      dot: "bg-sky-400",
    },
    zinc: {
      bg: "bg-zinc-800/80",
      text: "text-zinc-300",
      border: "border-zinc-700/60",
      dot: "bg-zinc-400",
    },
  };

  const style = toneStyles[resolvedTone];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors",
        style.bg,
        style.text,
        style.border,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className,
      )}
    >
      {dot && (
        <span className={clsx("h-1.5 w-1.5 rounded-full animate-pulse shrink-0", style.dot)} />
      )}
      {content}
    </span>
  );
};

export default Badge;
