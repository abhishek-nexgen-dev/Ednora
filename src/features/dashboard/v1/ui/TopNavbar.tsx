import { Bell, Grid3X3, CircleHelp, Shield } from "lucide-react";
import { memo } from "react";
import useAuthStorage from "../../../login/v1/hooks/useAuthStorage";
import { toast } from "react-toastify";

function TopNavbar() {
  const user = useAuthStorage((state) => state.user);

  return (
    <header className="py-3.5 px-4 sm:px-6 bg-[#08090D] border-b border-zinc-800/80 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          <Shield size={12} /> Institutional ERP Terminal
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Notification */}
        <button
          onClick={() => toast.info("No unread alerts in administrative queue.")}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition"
          title="Notifications"
        >
          <Bell size={18} />
        </button>

        {/* Apps */}
        <button
          onClick={() => toast.info("Connected Services: Admissions, AMQP RabbitMQ, Socket.io")}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition"
          title="Integrated Microservices"
        >
          <Grid3X3 size={18} />
        </button>

        {/* Help */}
        <button
          onClick={() => toast.info("Documentation & IT Support: contact info@ciitm.edu")}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition"
          title="Support Desk"
        >
          <CircleHelp size={18} />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-800">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">
              {user?.name || "Admin"}
            </p>
            <p className="text-[10px] text-zinc-500 leading-tight">Super Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(TopNavbar);
