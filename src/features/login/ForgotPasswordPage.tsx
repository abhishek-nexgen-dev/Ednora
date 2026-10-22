import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  ArrowLeft,
  Mail,
  KeyRound,
  Lock,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import api, { getErrorMessage } from "../../Utils/api.utils";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("admin@gmail.com");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please provide your registered institutional email.");
      return;
    }

    setLoading(true);
    try {
      // Dispatch password reset OTP request to backend
      const res = await api.post("/api/v1/forgot-password", {
        email: email.trim(),
      });

      toast.success(res.data?.message || `Verification code dispatched to ${email}!`);
      setStep(2);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to send reset code. Please verify email."));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Please enter the verification OTP code.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Validate OTP and reset password on backend
      const res = await api.post("/api/v1/validate/password", {
        email: email.trim(),
        otp: otp.trim(),
        newPassword: newPassword.trim(),
      });
      toast.success(res.data?.message || "Administrator password updated successfully!");
      setStep(3);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Invalid or expired OTP code."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#06070B] text-white flex flex-col justify-center py-8 sm:py-12 px-3.5 sm:px-6 lg:px-8">
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />

      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-white shadow-lg shadow-indigo-500/20">
            <Building2 size={28} />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-2">
              <ShieldCheck size={13} /> Security Clearance Recovery
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Reset Credentials
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              CIITM Administrator Account Recovery
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                step >= 1
                  ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                  : "bg-zinc-900 text-zinc-600"
              }`}
            >
              <span>1</span>
              <span className="hidden sm:inline">Identify</span>
            </div>
            <span className="text-zinc-700">→</span>
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                step >= 2
                  ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                  : "bg-zinc-900 text-zinc-600"
              }`}
            >
              <span>2</span>
              <span className="hidden sm:inline">Verify</span>
            </div>
            <span className="text-zinc-700">→</span>
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                step >= 3
                  ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                  : "bg-zinc-900 text-zinc-600"
              }`}
            >
              <span>3</span>
              <span className="hidden sm:inline">Done</span>
            </div>
          </div>
        </div>

        {/* Step 1: Request OTP */}
        {step === 1 && (
          <div className="rounded-3xl border border-zinc-800/90 bg-[#0A0B10]/95 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] p-6 sm:p-8 space-y-5 relative overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-1">
              <h2 className="text-base font-bold text-white">Account Identification</h2>
              <p className="text-xs text-zinc-400">
                Enter your institutional administrator email address to receive an authorization
                code.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                  Registered Email Address
                </label>
                <div className="relative mt-2">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    className="w-full pl-10 pr-3.5 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                  />
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-zinc-900/60 to-zinc-900/40 border border-indigo-500/30 text-xs text-indigo-300 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-indigo-400" />
                  <span className="truncate">
                    Default admin: <strong className="text-white font-mono">admin@gmail.com</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEmail("admin@gmail.com")}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-[11px] font-semibold text-indigo-200 hover:text-white shrink-0 transition"
                >
                  Use Default
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-xs sm:text-sm font-semibold text-white shadow-xl shadow-indigo-600/25 transition active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Transmitting Code...</span>
                  </>
                ) : (
                  <>
                    <KeyRound size={16} />
                    <span>Send Verification Code</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-3 border-t border-zinc-900 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
              >
                <ArrowLeft size={13} /> Back to Portal Sign In
              </Link>
            </div>
          </div>
        )}

        {/* Step 2: Verification Code & New Password */}
        {step === 2 && (
          <div className="rounded-3xl border border-zinc-800/90 bg-[#0A0B10]/95 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] p-6 sm:p-8 space-y-5 relative overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-1">
              <h2 className="text-base font-bold text-white">Enter Verification Code</h2>
              <p className="text-xs text-zinc-400">
                A 6-digit OTP code has been dispatched to{" "}
                <strong className="text-zinc-200">{email}</strong>.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                    6-Digit Authorization Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setOtp("849201")}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium"
                  >
                    Fill Demo OTP (849201)
                  </button>
                </div>
                <div className="relative">
                  <KeyRound
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="e.g. 849201"
                    className="w-full pl-10 pr-3.5 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm font-mono tracking-widest text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                    New Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 chars)"
                    className="w-full pl-10 pr-3.5 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-1.5 block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full pl-10 pr-3.5 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                >
                  Change Email
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-xs sm:text-sm font-semibold text-white shadow-xl shadow-indigo-600/25 transition disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Success Confirmation */}
        {step === 3 && (
          <div className="rounded-3xl border border-emerald-500/30 bg-[#0A0B10]/95 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] p-6 sm:p-8 space-y-5 text-center relative overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={30} />
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Password Updated!</h2>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Your administrator credentials have been successfully updated. You may now sign in
                with your new password.
              </p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-xs sm:text-sm font-semibold text-white shadow-xl shadow-emerald-600/25 transition active:scale-[0.99]"
            >
              Return to Portal Sign In
            </button>
          </div>
        )}

        {/* Security Footer Notice */}
        <p className="text-center text-[11px] text-zinc-600">
          CIITM Security Protocol v4.2 • Encrypted with TLS 1.3
        </p>
      </div>
    </main>
  );
}
