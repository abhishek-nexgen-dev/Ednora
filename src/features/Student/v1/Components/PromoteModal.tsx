import { useState } from "react";
import { X, ArrowUpCircle, ArrowDownCircle, Loader2, Sparkles, AlertCircle } from "lucide-react";

interface PromoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  currentSemester: number;
  onPromote: (reason?: string) => Promise<void> | void;
  onDemote: (reason?: string) => Promise<void> | void;
}

export default function PromoteModal({
  isOpen,
  onClose,
  studentName,
  currentSemester,
  onPromote,
  onDemote,
}: PromoteModalProps) {
  const [submittingAction, setSubmittingAction] = useState<"promote" | "demote" | null>(null);
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handlePromoteClick = async () => {
    try {
      setSubmittingAction("promote");
      await onPromote(reason.trim() || undefined);
    } finally {
      setSubmittingAction(null);
    }
  };

  const handleDemoteClick = async () => {
    try {
      setSubmittingAction("demote");
      await onDemote(reason.trim() || undefined);
    } finally {
      setSubmittingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0C0D14] border border-zinc-800 shadow-2xl overflow-hidden">
        {/* Header Banner */}
        <div className="relative px-6 py-5 border-b border-zinc-800/80 bg-gradient-to-r from-indigo-950/40 via-zinc-900 to-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                <Sparkles size={11} /> Academic Standing
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5">
                Promote / Demote Student
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Updates student academic term & dispatches notification via RabbitMQ.
              </p>
            </div>

            <button
              onClick={onClose}
              disabled={submittingAction !== null}
              className="rounded-xl p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="space-y-5 p-6">
          {/* Student Profile Overview */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Student Name</span>
              <span className="text-sm font-semibold text-white">{studentName}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
              <span className="text-xs text-zinc-400">Current Semester</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Semester {currentSemester}
              </span>
            </div>
          </div>

          {/* Promotion & Demotion Pathway Preview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-center">
              <span className="text-[11px] text-emerald-400 font-medium block">Promotion Target</span>
              <span className="text-base font-bold text-white mt-0.5 block">
                Semester {currentSemester + 1}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-1">Advances to next term</span>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-center">
              <span className="text-[11px] text-amber-400 font-medium block">Demotion Target</span>
              <span className="text-base font-bold text-white mt-0.5 block">
                Semester {Math.max(1, currentSemester - 1)}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-1">
                {currentSemester <= 1 ? "Already at minimum" : "Reverts to prior term"}
              </span>
            </div>
          </div>

          {/* Academic Reason / Notes */}
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1.5">
              Academic Reason / Administrative Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. End Semester Exam Passed, Backlog Review"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Automated Dispatch Notice */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 flex items-start gap-2.5">
            <AlertCircle size={15} className="text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-indigo-300 leading-relaxed">
              Upon confirmation, an automated branded email notification with updated syllabus links will be queued via <strong>RabbitMQ</strong> and dispatched through <strong>Nodemailer</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              disabled={submittingAction !== null}
              onClick={handlePromoteClick}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
            >
              {submittingAction === "promote" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Promoting...
                </>
              ) : (
                <>
                  <ArrowUpCircle size={17} />
                  Promote to Sem {currentSemester + 1}
                </>
              )}
            </button>

            <button
              type="button"
              disabled={submittingAction !== null || currentSemester <= 1}
              onClick={handleDemoteClick}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition disabled:opacity-50"
            >
              {submittingAction === "demote" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <ArrowDownCircle size={17} />
                  Demote to Sem {Math.max(1, currentSemester - 1)}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-zinc-800/80 px-6 py-3.5 bg-zinc-950/40">
          <button
            type="button"
            onClick={onClose}
            disabled={submittingAction !== null}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
