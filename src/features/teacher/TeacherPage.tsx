import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Mail,
  GraduationCap,
  Trash2,
  Edit2,
  Building,
  Award,
  RefreshCw,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import api from "../../Utils/api.utils";
import { BackendTeacher } from "../../types/backend.types";

export default function TeacherPage() {
  const [teachers, setTeachers] = useState<BackendTeacher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<BackendTeacher | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    department: "Computer Science & Engineering",
    designation: "Assistant Professor",
    qualification: "M.Tech in CSE",
    email: "",
    phone: "",
    Avtar: "",
  });

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/user/findAllTeachers");
      if (res.data?.data && Array.isArray(res.data.data)) {
        setTeachers(res.data.data);
      }
    } catch (err) {
      console.warn("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const departments = [
    "All",
    "Computer Science & Engineering",
    "Information Technology",
    "Mern Stack",
    "Management & Business Studies",
    "Commerce & Finance",
  ];

  const filteredTeachers = teachers.filter((t) => {
    const matchSearch =
      t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.department || t.Specialization || "").toLowerCase().includes(searchTerm.toLowerCase());

    const tDept = t.department || t.Specialization || t.role || "";
    const matchDept = deptFilter === "All" || tDept === deptFilter;
    return matchSearch && matchDept;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      department: "Computer Science & Engineering",
      designation: "Assistant Professor",
      qualification: "M.Tech in CSE",
      email: "",
      phone: "+91 94311 00000",
      Avtar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
    });
    setEditingTeacher(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (t: BackendTeacher) => {
    setFormData({
      name: t.name,
      department: t.department || t.Specialization || "Computer Science",
      designation: t.designation || t.role || "Professor",
      qualification: t.qualification || "M.Tech",
      email: t.email,
      phone: t.phone || "",
      Avtar: t.Avtar || t.image || "",
    });
    setEditingTeacher(t);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove faculty member ${name}?`)) return;
    try {
      await api.delete(`/api/v1/admin/teacher/${id}/delete`);
      toast.success(`Faculty profile for ${name} removed.`);
      loadTeachers();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to remove faculty member.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Faculty name and institutional email are required.");
      return;
    }

    try {
      if (editingTeacher) {
        await api.put(`/api/v1/admin/teacher/${editingTeacher._id}/update`, formData);
        toast.success(`Faculty ${formData.name} updated successfully!`);
      } else {
        await api.post("/api/v1/admin/teacher/create", formData);
        toast.success(`Faculty ${formData.name} inducted successfully!`);
      }
      setIsAddModalOpen(false);
      loadTeachers();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to save faculty record.");
    }
  };

  return (
    <div className="w-full bg-[#07080C] text-white p-3.5 sm:p-6 lg:p-8">
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300 mb-2">
              <Briefcase size={14} /> Academic Faculty Directory
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Faculty & Department Directory
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Manage academic professors, lecturers, credentials, and departmental appointments.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={loadTeachers}
              disabled={loading}
              className="p-2 sm:px-3 sm:py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs text-zinc-300 flex items-center gap-1.5 transition"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition active:scale-[0.98]"
            >
              <Plus size={16} /> Induct Faculty
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-semibold tracking-wider text-zinc-400">Total Faculty Members</p>
              <GraduationCap size={18} className="text-indigo-400" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-bold text-white">{teachers.length}</p>
            <p className="mt-1 text-xs text-zinc-500">Active university faculty</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-semibold tracking-wider text-zinc-400">Research & Tech Staff</p>
              <Award size={18} className="text-amber-400" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-bold text-amber-300">
              {teachers.filter((t) => (t.role || t.Specialization || "").includes("Backend") || (t.qualification || "").includes("Ph.D.")).length || 1}
            </p>
            <p className="mt-1 text-xs text-zinc-500">Laboratory mentorship leads</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-semibold tracking-wider text-zinc-400">Departments</p>
              <Building size={18} className="text-emerald-400" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-bold text-emerald-300">5</p>
            <p className="mt-1 text-xs text-zinc-500">Engineering & Management</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 bg-zinc-950/70 p-3 sm:p-4 rounded-2xl border border-zinc-800">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search faculty by name, qualification, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  deptFilter === dept
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {dept === "All" ? "All Departments" : dept.split("&")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher._id}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-950 p-5 sm:p-6 shadow-xl flex flex-col justify-between hover:border-zinc-700/80 transition-all group"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <img
                    src={teacher.image || teacher.Avtar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face"}
                    alt={teacher.name}
                    className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl object-cover border-2 border-indigo-500/30 group-hover:border-indigo-500/60 transition shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm sm:text-base text-white truncate">{teacher.name}</h3>
                    <p className="text-xs text-indigo-400 font-medium truncate">{teacher.role || teacher.designation || "Faculty"}</p>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">{teacher.Specialization || teacher.department || "Computer Science"}</p>
                  </div>
                </div>

                <div className="mt-4 sm:mt-5 space-y-2 text-xs border-t border-zinc-900 pt-3.5">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Mail size={14} className="shrink-0 text-zinc-500" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  {teacher.Experience !== undefined && (
                    <div className="flex items-center gap-2 text-zinc-400">
                      <GraduationCap size={14} className="shrink-0 text-zinc-500" />
                      <span>{teacher.Experience} Year(s) Academic Experience</span>
                    </div>
                  )}
                  {teacher.qualification && (
                    <div className="flex items-center gap-2 text-zinc-400">
                      <GraduationCap size={14} className="shrink-0 text-zinc-500" />
                      <span className="truncate">{teacher.qualification}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-zinc-900 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(teacher)}
                  className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
                  title="Edit faculty profile"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(teacher._id, teacher.name)}
                  className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 transition"
                  title="Remove faculty member"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-16 text-zinc-500 rounded-2xl border border-zinc-900 bg-zinc-950/40">
            {loading ? "Loading faculty records from backend..." : "No faculty members found matching your filter criteria."}
          </div>
        )}
      </div>

      {/* Add / Edit Faculty Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-[#0C0D12] p-5 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">
                  {editingTeacher ? "Edit Profile" : "Faculty Induction"}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {editingTeacher ? "Update Faculty Member" : "Induct New Faculty Member"}
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs text-zinc-400">Full Name with Honorific *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Mern Stack">Mern Stack / Fullstack</option>
                    <option value="Management & Business Studies">Management & Business Studies</option>
                    <option value="Commerce & Finance">Commerce & Finance</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400">Designation / Role</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Professor"
                    className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400">Institutional Email *</label>
                <input
                  type="email"
                  required
                  placeholder="name@ciitm.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400">Avatar / Profile Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.Avtar}
                  onChange={(e) => setFormData({ ...formData, Avtar: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20"
                >
                  {editingTeacher ? "Save Changes" : "Confirm Induction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
