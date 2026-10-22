import { LoginCard } from "./v1/components/LoginCard";
import { ToastContainer } from "react-toastify";
import { Building2, ShieldCheck, Activity, Users, Lock, CheckCircle2 } from "lucide-react";

const LoginPage = () => {
  return (
    <main className="min-h-screen bg-[#06070B] text-white flex flex-col justify-center py-6 sm:py-10 lg:py-16 px-3.5 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* Top Banner on Mobile/Tablet */}
      <div className="lg:hidden max-w-md mx-auto w-full mb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          <ShieldCheck size={13} /> Official CIITM ERP Gateway
        </div>
        <p className="text-xs text-zinc-400">Central Institute of Technology & Management</p>
      </div>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Institutional Brand & Security Dossier (Desktop) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs text-indigo-300 mb-4">
              <ShieldCheck size={14} /> Official Governance Gateway
            </div>

            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25">
                <Building2 size={26} />
              </div>
              <div>
                <h1 className="text-2xl xl:text-3xl font-bold tracking-tight text-white">
                  CIITM ERP Portal
                </h1>
                <p className="text-xs text-indigo-300 font-medium">
                  Central Institute of Technology & Management
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-zinc-400 leading-relaxed max-w-md">
              Secure administrative terminal for faculty governance, curriculum accreditation,
              admissions review, and fee management.
            </p>
          </div>

          {/* Pillars */}
          <div className="space-y-3.5 max-w-md">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                <Lock size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Role-Based Council Access</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Strict authorization for Super Admins, Deans, Bursars, and Registrars.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <Activity size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">RabbitMQ & Socket.io Live Broker</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Real-time asynchronous queues for admissions, circulars, and transactions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                <Users size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Unified Student Lifecycle</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  From initial application submission to degree conferral and transcripts.
                </p>
              </div>
            </div>
          </div>

          {/* Live Node Badge */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Backend: Connected
            </span>
            <span>•</span>
            <span className="font-mono text-zinc-400">ciitm-backend.onrender.com</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-zinc-400">
              <CheckCircle2 size={12} className="text-emerald-400" /> SLA 99.9%
            </span>
          </div>
        </div>

        {/* Right Column: Login Card */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <LoginCard />
        </div>
      </div>

      {/* Mobile Footer Status */}
      <div className="lg:hidden mt-6 text-center text-xs text-zinc-500">
        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Backend Live: ciitm-backend.onrender.com
        </span>
      </div>
    </main>
  );
};

export default LoginPage;
