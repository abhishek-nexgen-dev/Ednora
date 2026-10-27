import React, { useState, useEffect, useRef } from "react";
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
  Upload,
  Image as ImageIcon,
  X,
  Phone,
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
  const [submitting, setSubmitting] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    department: "Computer Science & Engineering",
    designation: "Assistant Professor",
    qualification: "M.Tech in CSE",
    Experience: 3,
    email: "",
    phone: "",
    Avtar: "",
    facebook: "",
    linkedin: "",
    twitter: "",
    instagram: "",
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
      Experience: 3,
      email: "",
      phone: "+91 94311 00000",
      Avtar: "",
      facebook: "",
      linkedin: "",
      twitter: "",
      instagram: "",
    });
    setAvatarFile(null);
    setAvatarPreview("");
    setEditingTeacher(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (t: BackendTeacher) => {
    const social = t.social_media?.[0] || {};
    const existingImg = t.image || t.Avtar || "";
    setFormData({
      name: t.name || "",
      department: t.department || t.Specialization || "Computer Science & Engineering",
      designation: t.designation || t.role || "Professor",
      qualification: t.qualification || "M.Tech",
      Experience: t.Experience || 2,
      email: t.email || "",
      phone: t.phone || "",
      Avtar: existingImg,
      facebook: social.facebook === "#" ? "" : social.facebook || "",
      linkedin: social.linkedin === "#" ? "" : social.linkedin || "",
      twitter: social.twitter === "#" ? "" : social.twitter || "",
      instagram: social.instagram === "#" ? "" : social.instagram || "",
    });
    setAvatarFile(null);
    setAvatarPreview(existingImg);
    setEditingTeacher(t);
    setIsAddModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
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
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Faculty name and institutional email are required.");
      return;
    }

    if (!editingTeacher && !avatarFile && !formData.Avtar) {
      toast.error("Please upload an image for the faculty member.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("email", formData.email.trim());
      payload.append("role", formData.designation.trim());
      payload.append("designation", formData.designation.trim());
      payload.append("Specialization", formData.department.trim());
      payload.append("department", formData.department.trim());
      payload.append("qualification", formData.qualification.trim());
      payload.append("Experience", String(formData.Experience || 1));
      payload.append("phone", formData.phone.trim());
      payload.append("facebook", formData.facebook.trim() || "#");
      payload.append("linkedin", formData.linkedin.trim() || "#");
      payload.append("twitter", formData.twitter.trim() || "#");
      payload.append("instagram", formData.instagram.trim() || "#");

      if (avatarFile) {
        payload.append("Avtar", avatarFile);
      } else if (formData.Avtar) {
        payload.append("Avtar", formData.Avtar);
        payload.append("image", formData.Avtar);
      }

      if (editingTeacher) {
        await api.put(`/api/v1/admin/teacher/${editingTeacher._id}/update`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(`Faculty member ${formData.name} updated successfully!`);
      } else {
        await api.post("/api/v1/admin/teacher/create", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(`Faculty member ${formData.name} inducted successfully!`);
      }

      setIsAddModalOpen(false);
      loadTeachers();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to save faculty record.");
    } finally {
      setSubmitting(false);
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
              <p className="text-xs uppercase font-semibold tracking-wider text-zinc-400">Senior Faculty & Leads</p>
              <Award size={18} className="text-amber-400" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-bold text-amber-300">
              {teachers.filter((t) => (t.role || t.designation || "").includes("Professor") || (t.Experience || 0) >= 5).length || teachers.length}
            </p>
            <p className="mt-1 text-xs text-zinc-500">Mentorship and department leads</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-semibold tracking-wider text-zinc-400">Departments</p>
              <Building size={18} className="text-emerald-400" />
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-bold text-white">5 Active</p>
            <p className="mt-1 text-xs text-zinc-500">Interdisciplinary schools</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-zinc-950/60 p-3 sm:p-4 rounded-2xl border border-zinc-800/80">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Search by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                  deptFilter === dept
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Teachers Grid */}
        {loading && teachers.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <RefreshCw className="animate-spin mx-auto mb-2 text-indigo-400" size={24} />
            Loading faculty directory...
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-zinc-800 text-zinc-500">
            No faculty members found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTeachers.map((t) => (
              <div
                key={t._id}
                className="group relative rounded-2xl border border-zinc-800 bg-zinc-950 p-5 hover:border-zinc-700 transition flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                        <img
                          src={t.image || t.Avtar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face"}
                          alt={t.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face";
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition leading-snug">
                          {t.name}
                        </h3>
                        <p className="text-xs text-indigo-400 font-medium mt-0.5">
                          {t.designation || t.role || "Faculty Member"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                        title="Edit Faculty Member"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(t._id, t.name)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 transition"
                        title="Remove Faculty"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-zinc-400 border-t border-zinc-900 pt-3">
                    <div className="flex items-center gap-2">
                      <Building size={14} className="text-zinc-500 shrink-0" />
                      <span className="truncate">{t.department || t.Specialization || "Engineering"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-zinc-500 shrink-0" />
                      <span className="truncate">{t.email}</span>
                    </div>
                    {t.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-zinc-500 shrink-0" />
                        <span className="truncate">{t.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Award size={14} className="text-zinc-500 shrink-0" />
                      <span>{t.Experience ? `${t.Experience} Years Experience` : "Faculty Lead"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Faculty Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-[#0C0D12] p-5 sm:p-7 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
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
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload Option */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Faculty Photograph / Avatar *
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex items-center gap-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-900 border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 cursor-pointer flex flex-col items-center justify-center shrink-0 transition"
                  >
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <Upload size={20} className="text-indigo-400" />
                        <span className="text-[10px] text-zinc-400 mt-1">Upload</span>
                      </>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition flex items-center gap-1.5"
                    >
                      <ImageIcon size={14} /> Browse Image File
                    </button>
                    <p className="text-[11px] text-zinc-400">
                      Upload PNG or JPG portrait photo.
                    </p>
                    <input
                      type="text"
                      placeholder="Or enter image URL (https://...)"
                      value={formData.Avtar}
                      onChange={(e) => {
                        setFormData({ ...formData, Avtar: e.target.value });
                        if (!avatarFile) setAvatarPreview(e.target.value);
                      }}
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400">Full Name *</label>
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
                  <label className="text-xs text-zinc-400">Department *</label>
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
                  <label className="text-xs text-zinc-400">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Assistant Professor"
                    className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400">Institutional Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="faculty@ednora.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400">Contact Number</label>
                  <input
                    type="text"
                    placeholder="+91 94311 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400">Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. M.Tech / Ph.D."
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.Experience}
                    onChange={(e) => setFormData({ ...formData, Experience: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingTeacher
                    ? "Save Changes"
                    : "Confirm Induction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
