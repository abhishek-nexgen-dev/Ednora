import { useState } from "react";
import { X, Mail, Send, Bell, Loader2, Sparkles, FileText, CheckCircle2 } from "lucide-react";

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  studentName?: string;
  onSend: (data: { title: string; message: string; email: string; priority: string }) => Promise<void> | void;
}

const QUICK_TEMPLATES = [
  {
    name: "Tuition Fee Due",
    title: "Upcoming Tuition Fee Installment Reminder",
    message:
      "Dear Student,\n\nThis is a friendly reminder that your upcoming semester tuition fee installment is due shortly. Please log in to your student portal to inspect your billing ledger and complete payment clearance.",
    priority: "Urgent",
  },
  {
    name: "Exam Schedule",
    title: "Official Semester Examination Schedule Published",
    message:
      "Dear Student,\n\nThe academic examination schedule for the upcoming term has been finalized and published. Please verify your subject dates, exam hall allocations, and admit card status on the portal.",
    priority: "Normal",
  },
  {
    name: "Academic Standing",
    title: "Academic Progress & Advisor Consultation Notice",
    message:
      "Dear Student,\n\nPlease schedule an appointment with your designated faculty advisor to review your course credits, attendance records, and prerequisite milestones for this academic term.",
    priority: "Academic Notice",
  },
  {
    name: "Campus Notice",
    title: "Campus Announcement & Holiday Schedule",
    message:
      "Dear Student,\n\nPlease be advised that campus administrative offices and academic lectures will observe the upcoming holiday. Normal instructional sessions will resume thereafter.",
    priority: "Normal",
  },
];

export default function SendNotificationModal({
  isOpen,
  onClose,
  email,
  studentName,
  onSend,
}: SendNotificationModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [submitting, setSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyTemplate = (tmpl: (typeof QUICK_TEMPLATES)[0]) => {
    setTitle(tmpl.title);
    setMessage(tmpl.message);
    setPriority(tmpl.priority);
    setSelectedTemplate(tmpl.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert("Please provide both a notification title and message body.");
      return;
    }

    try {
      setSubmitting(true);
      await onSend({
        title: title.trim(),
        message: message.trim(),
        email,
        priority,
      });

      setTitle("");
      setMessage("");
      setSelectedTemplate(null);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl border border-zinc-800 bg-[#0C0D14] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-800/80 bg-gradient-to-r from-blue-950/40 via-zinc-900 to-zinc-900 flex items-center justify-between shrink-0">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
              <Bell size={11} /> RabbitMQ Dispatch
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5">
              Send Student Notification
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Queues high-priority email notifications to the student.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Recipient Details */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Mail size={15} />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block">
                  Recipient Email
                </span>
                <span className="text-xs font-bold text-white font-mono">{email}</span>
              </div>
            </div>

            {studentName && (
              <span className="text-xs text-zinc-400 font-medium">
                {studentName}
              </span>
            )}
          </div>

          {/* Quick Templates Selector */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-2">
              <Sparkles size={12} className="text-amber-400" /> Quick Notification Templates
            </label>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.name}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                    selectedTemplate === tmpl.name
                      ? "border-blue-500/80 bg-blue-500/15 text-white"
                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/60 text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText size={13} className="text-blue-400 shrink-0" />
                    <span className="truncate font-medium">{tmpl.name}</span>
                  </div>
                  {selectedTemplate === tmpl.name && (
                    <CheckCircle2 size={13} className="text-blue-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Priority & Classification */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Notice Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {["Normal", "Urgent", "Academic Notice", "Fee Reminder"].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setPriority(lvl)}
                  className={`py-1.5 px-2 rounded-xl border text-[11px] font-semibold text-center transition ${
                    priority === lvl
                      ? lvl === "Urgent"
                        ? "border-rose-500 bg-rose-500/20 text-rose-300"
                        : "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Subject / Notice Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. End Semester Schedule & Admit Card"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Notification Content *
            </label>
            <textarea
              rows={5}
              required
              placeholder="Compose official notification message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500 transition leading-relaxed"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
            <span className="text-[11px] text-zinc-500">
              Dispatched via <strong>notifications_queue</strong>
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Enqueuing...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Dispatch Notification
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
