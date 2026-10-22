import { ShieldCheck, Lock, Activity } from "lucide-react";

export function SecurityBadges() {
  return (
    <div className="mt-6 pt-5 border-t border-zinc-900/80 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-zinc-500">
      <div className="flex items-center gap-1.5">
        <ShieldCheck size={13} className="text-emerald-400" />
        <span>TLS 1.3 Strict</span>
      </div>
      <span aria-hidden="true" className="text-zinc-700">
        ·
      </span>
      <div className="flex items-center gap-1.5">
        <Lock size={13} className="text-indigo-400" />
        <span>RBAC Clearance</span>
      </div>
      <span aria-hidden="true" className="text-zinc-700">
        ·
      </span>
      <div className="flex items-center gap-1.5">
        <Activity size={13} className="text-amber-400" />
        <span>AMQP Broker</span>
      </div>
    </div>
  );
}
