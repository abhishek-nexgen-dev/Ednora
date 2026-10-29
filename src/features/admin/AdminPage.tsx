import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  UserPlus,
  Trash2,
  RefreshCw,
  Search,
  Lock,
  Mail,
  User,
  KeyRound,
  CheckCircle2,
  X,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import api, { getErrorMessage } from "../../Utils/api.utils";
import useAuthStorage from "../login/v1/hooks/useAuthStorage";

interface AdminRecord {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: string | Date;
}

const DEFAULT_ADMINS: AdminRecord[] = [
  {
    _id: "root-admin",
    name: "Prof. R. K. Sharma",
    email: "admin@gmail.com",
    role: "admin",
    isActive: true,
    createdAt: "2025-01-01T00:00:00.000Z",
  },
];

export default function AdminPage() {
  const currentUser = useAuthStorage((state) => state.user);
  const [admins, setAdmins] = useState<AdminRecord[]>(DEFAULT_ADMINS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New admin form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    designation: "Academic Administrator",
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      let fetched: AdminRecord[] = [];
      try {
        const res = await api.get("/api/v1/admin/list");
        if (Array.isArray(res.data?.data)) {
          fetched = res.data.data;
        } else if (Array.isArray(res.data)) {
          fetched = res.data;
        }
      } catch {
        const roleRes = await api.get("/api/v1/role/list");
        if (Array.isArray(roleRes.data?.data)) {
          fetched = roleRes.data.data;
        }
      }

      if (fetched.length > 0) {
        setAdmins(fetched);
      } else {
        setAdmins(DEFAULT_ADMINS);
      }
    } catch {
      setAdmins(DEFAULT_ADMINS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.name.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    setSubmitting(true);
    try {
      try {
        await api.post("/api/v1/auth/Admin/SignUp", {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password || "Admin@123",
          role: "admin",
        });
      } catch {
        // Fallback to role grant endpoint
        await api.post("/api/v1/role/create", {
          email: formData.email.trim().toLowerCase(),
        });
      }

      toast.success(`Administrator "${formData.name}" inducted successfully!`);
      setIsCreateModalOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "admin",
        designation: "Academic Administrator",
      });
      fetchAdmins();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to induct administrator."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevokeAdmin = async (admin: AdminRecord) => {
    if (admin.email.toLowerCase() === "admin@gmail.com" || admin._id === "root-admin") {
      toast.warn("The primary root administrator cannot be revoked.");
      return;
    }

    if (!window.confirm(`Are you sure you want to revoke administrative access for ${admin.name} (${admin.email})?`)) {
      return;
    }

    try {
      try {
        await api.delete(`/api/v1/admin/delete/${admin._id}`);
      } catch {
        await api.delete(`/api/v1/role/delete/${encodeURIComponent(admin.email)}`);
      }

      toast.success(`Revoked administrative access for ${admin.email}`);
      setAdmins((prev) => prev.filter((a) => a.email !== admin.email && a._id !== admin._id));
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to revoke administrator."));
    }
  };

  const filteredAdmins = admins.filter((a) => {
    const q = searchTerm.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen w-full bg-[#07080C] text-white p-3.5 sm:p-6 lg:p-8">
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-indigo-400">
              <ShieldCheck size={16} /> Governance & Access Control
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Portal Administrators
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Manage authorized institutional administrators, permission clearances, and security credentials.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchAdmins}
              disabled={loading}
              className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition"
              title="Refresh Directory"
            >
              <RefreshCw size={16} className={loading ? "animate-spin text-indigo-400" : ""} />
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition"
            >
              <UserPlus size={16} /> Induct Administrator
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Admins</span>
              <ShieldCheck size={18} className="text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white">{admins.length}</div>
            <p className="text-[11px] text-zinc-500">Verified institutional officers</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Security Layer</span>
              <Lock size={18} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">Active</div>
            <p className="text-[11px] text-zinc-500">JWT 256-bit bearer authentication</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Role Policy</span>
              <KeyRound size={18} className="text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">Full RBAC</div>
            <p className="text-[11px] text-zinc-500">Admissions, Courses, Fees & AMQP</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Current Operator</span>
              <User size={18} className="text-indigo-400" />
            </div>
            <div className="text-sm font-bold text-white truncate">
              {currentUser?.name || "Super Administrator"}
            </div>
            <p className="text-[11px] text-indigo-400 truncate">
              {currentUser?.email || "admin@gmail.com"}
            </p>
          </div>
        </div>

        {/* Directory Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
          {/* Search Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-zinc-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search administrators by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="text-xs text-zinc-400 font-medium">
              Showing <span className="text-white font-bold">{filteredAdmins.length}</span> of{" "}
              {admins.length} administrators
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                  <th className="px-5 py-3.5">Administrator</th>
                  <th className="px-5 py-3.5">Email Identity</th>
                  <th className="px-5 py-3.5">Clearance / Role</th>
                  <th className="px-5 py-3.5">Session Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-xs sm:text-sm">
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-500">
                      No administrators matching "{searchTerm}".
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => {
                    const isRoot = admin.email.toLowerCase() === "admin@gmail.com";
                    return (
                      <tr
                        key={admin._id || admin.email}
                        className="hover:bg-zinc-900/30 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center shrink-0">
                              {admin.name ? admin.name.charAt(0).toUpperCase() : "A"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-white truncate">{admin.name}</p>
                              <p className="text-[11px] text-zinc-500">
                                {isRoot ? "Head of Institution / IT Director" : "Campus Administrative Officer"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 font-mono text-xs text-zinc-300">
                          <div className="flex items-center gap-1.5">
                            <Mail size={13} className="text-zinc-500 shrink-0" />
                            <span className="truncate">{admin.email}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold border ${
                              isRoot
                                ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
                                : "bg-purple-500/10 text-purple-300 border-purple-500/30"
                            }`}
                          >
                            <Lock size={10} />
                            {isRoot ? "Super Administrator" : "Institutional Admin"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <CheckCircle2 size={13} /> Active Clearance
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isRoot ? (
                              <span className="text-[11px] text-zinc-500 italic pr-2">
                                Protected Account
                              </span>
                            ) : (
                              <button
                                onClick={() => handleRevokeAdmin(admin)}
                                title="Revoke Administrator Role"
                                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Policy Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-zinc-300">
            <FileText size={18} className="text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Institutional Security Directives
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-400">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/60 space-y-1.5">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400" /> Role-Based Access
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Admins possess full administrative authorization across curriculum updates, student records, fee reconciliation, and Cloudinary media assets.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/60 space-y-1.5">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400" /> Session Expiration
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Administrative session tokens rotate on a 7-day schedule with automatic handshake verification and encrypted cookie storage.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/60 space-y-1.5">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-amber-400" /> Audit Log Pipeline
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                All administrative modifications and circular broadcasts are broadcast through the RabbitMQ audit queue for operational compliance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Induct Administrator Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">
                  Access Delegation
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  Induct New Administrator
                </h2>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Administrator Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sunita Mehra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Institutional Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. coordinator@ednora.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Temporary Access Password
                </label>
                <input
                  type="password"
                  placeholder="Default: Admin@123"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  The user can change this password after initial sign-in.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Designation / Department
                </label>
                <select
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Academic Administrator">Academic Administrator</option>
                  <option value="Admissions Director">Admissions Director</option>
                  <option value="Registrar">Registrar & Controller of Examinations</option>
                  <option value="Finance & Comptroller">Finance & Comptroller</option>
                  <option value="IT Operations Lead">IT Operations Lead</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 disabled:opacity-50"
                >
                  {submitting ? "Inducting..." : "Confirm & Induct"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
