import { useState, useEffect, memo } from "react";
import {
  Bell,
  Grid3X3,
  CircleHelp,
  Shield,
  Laptop,
  Globe,
  LogOut,
  X,
} from "lucide-react";
import useAuthStorage from "../../../login/v1/hooks/useAuthStorage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function TopNavbar() {
  const user = useAuthStorage((state) => state.user);
  const logout = useAuthStorage((state) => state.logout);
  const navigate = useNavigate();

  const [isTauri, setIsTauri] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Detect Tauri environment
    if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window) {
      setIsTauri(true);
    }
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.info("Signed out of CIITM Admin Session.");
  };

  return (
    <>
      <header className="sticky top-0 z-20 py-3 px-4 sm:px-6 bg-[#08090D]/95 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-between gap-4">
        {/* Left Status Chips */}
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 shadow-sm">
            <Shield size={12} className="text-indigo-400" />
            <span className="hidden sm:inline">CIITM ERP Enterprise</span>
            <span className="sm:hidden">CIITM</span>
          </span>

          {isTauri ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Laptop size={12} />
              <span className="hidden sm:inline">Tauri Native Desktop</span>
              <span className="sm:hidden">Tauri</span>
            </span>
          ) : (
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
              <Globe size={11} className="text-zinc-500" /> Web Console
            </span>
          )}

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{currentTime || "IST"}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Microservices Launcher */}
          <button
            onClick={() => setIsServicesModalOpen(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/80 transition flex items-center gap-1.5 text-xs font-medium"
            title="Integrated Systems & Services"
          >
            <Grid3X3 size={16} />
            <span className="hidden md:inline">Services</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => toast.info("No unread alerts in administrative queue. All pipelines normal.")}
            className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/80 transition"
            title="Notification Center"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-[#08090D]"></span>
          </button>

          {/* Help Desk */}
          <button
            onClick={() =>
              toast.info("CIITM Technical Support: admin@ciitm.edu | Hotline: +91 6202665784")
            }
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/80 transition"
            title="Institutional Help Desk"
          >
            <CircleHelp size={16} />
          </button>

          {/* User Profile Capsule */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-zinc-800">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-indigo-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">
                {user?.name || "Prof. R. K. Sharma"}
              </p>
              <p className="text-[10px] text-zinc-400 leading-tight">
                {user?.role === "admin" ? "Super Administrator" : "Institutional Admin"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition ml-1"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Services Modal */}
      {isServicesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#0C0D12] p-5 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">
                  Infrastructure
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  Connected Microservices
                </h3>
              </div>
              <button
                onClick={() => setIsServicesModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  title: "Node.js REST API",
                  url: "https://ciitm-backend.onrender.com",
                  status: "Healthy",
                  color: "emerald",
                },
                {
                  title: "RabbitMQ Message Broker",
                  url: "amqp://rabbitmq-ciitm",
                  status: "Online",
                  color: "emerald",
                },
                {
                  title: "MongoDB Cloud Atlas",
                  url: "mongodb+srv://cluster.ciitm",
                  status: "Connected",
                  color: "indigo",
                },
                {
                  title: "Cloudinary CDN Storage",
                  url: "res.cloudinary.com/dpnc8ddpf",
                  status: "Synced",
                  color: "indigo",
                },
                {
                  title: "Tauri v2 Desktop Bridge",
                  url: isTauri ? "ipc://tauri.core" : "Web Fallback Mode",
                  status: isTauri ? "Native Ready" : "Web Runtime",
                  color: isTauri ? "emerald" : "zinc",
                },
              ].map((svc, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold text-white">{svc.title}</p>
                    <p className="text-[11px] text-zinc-500 font-mono truncate max-w-[200px]">
                      {svc.url}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full bg-${svc.color}-500/10 text-${svc.color}-400 border border-${svc.color}-500/20`}
                  >
                    {svc.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsServicesModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(TopNavbar);
