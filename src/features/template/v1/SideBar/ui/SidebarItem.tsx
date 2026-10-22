import { NavLink } from "react-router-dom";
import clsx from "clsx";
import type { SidebarItemConfig } from "../config/sidebar.config";

interface Props {
  item: SidebarItemConfig;
  collapsed: boolean;
}

export const SidebarItem = ({ item, collapsed }: Props) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        clsx(
          "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-colors",
          isActive
            ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
            : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200 border border-transparent",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            className={clsx(
              "shrink-0 transition-colors",
              isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300",
            )}
          />

          {!collapsed && (
            <>
              <span className="truncate">{item.title}</span>

              {item.badge && (
                <span
                  className={clsx(
                    "ml-auto text-[10px] font-mono tracking-wide px-1.5 py-0.5 rounded-md border",
                    isActive
                      ? "text-indigo-200 bg-indigo-500/20 border-indigo-500/30"
                      : "text-zinc-500 bg-zinc-900 border-zinc-800 group-hover:text-zinc-400",
                  )}
                >
                  {item.badge}
                </span>
              )}
            </>
          )}
        </>
      )}
    </NavLink>
  );
};
