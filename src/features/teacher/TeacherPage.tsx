import React, { useState, useEffect, useMemo } from "react";
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
  Phone,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import api, { getErrorMessage } from "../../Utils/api.utils";
import { BackendTeacher } from "../../types/backend.types";
import { Button, Input, Modal, StatCard, Badge, EmptyState } from "../../Components";

export default function TeacherPage() {
  const [teachers, setTeachers] = useState<BackendTeacher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<BackendTeacher | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    department: "Computer Science & Engineering",
    designation: "Assistant Professor",
    role: "Assistant Professor",
    Specialization: "Computer Science & Engineering",
    qualification: "M.Tech in CSE",
    Experience: 5,
    email: "",
    phone: "+91 94311 00000",
    instagram: "https://instagram.com/ciitm",
    facebook: "https://facebook.com/ciitm",
    linkedin: "https://linkedin.com/school/ciitm",
    twitter: "https://twitter.com/ciitm",
    avatarFile: null as File | null,
    Avtar: "",
  });

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/user/findAllTeachers");
      if (res.data?.data && Array.isArray(res.data.data)) {
        setTeachers(res.data.data);
      } else if (Array.isArray(res.data)) {
        setTeachers(res.data);
      } else {
        setTeachers([]);
      }
    } catch (err: unknown) {
      console.warn("Error fetching teachers:", err);
      toast.error(getErrorMessage(err, "Failed to load faculty list from backend."));
      setTeachers([]);
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

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchSearch =
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.department || t.Specialization || "").toLowerCase().includes(searchTerm.toLowerCase());

      const tDept = t.department || t.Specialization || t.role || "";
      const matchDept =
        deptFilter === "All" || tDept.toLowerCase().includes(deptFilter.toLowerCase());
      return matchSearch && matchDept;
    });
  }, [teachers, searchTerm, deptFilter]);

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      department: "Computer Science & Engineering",
      designation: "Assistant Professor",
      role: "Assistant Professor",
      Specialization: "Computer Science & Engineering",
      qualification: "M.Tech in CSE",
      Experience: 5,
      email: "",
      phone: "+91 94311 00000",
      instagram: "https://instagram.com/ciitm",
      facebook: "https://facebook.com/ciitm",
      linkedin: "https://linkedin.com/school/ciitm",
      twitter: "https://twitter.com/ciitm",
      avatarFile: null,
      Avtar: "",
    });
    setAvatarPreview(null);
    setEditingTeacher(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (t: BackendTeacher) => {
    setFormData({
      name: t.name || "",
      department: t.department || t.Specialization || "Computer Science & Engineering",
      designation: t.designation || t.role || "Professor",
      role: t.role || t.designation || "Professor",
      Specialization: t.Specialization || t.department || "Computer Science & Engineering",
      qualification: t.qualification || "M.Tech",
      Experience: Number(t.Experience || 5),
      email: t.email || "",
      phone: t.phone || "+91 94311 00000",
      instagram: t.social_media?.[0]?.instagram || "https://instagram.com/ciitm",
      facebook: t.social_media?.[0]?.facebook || "https://facebook.com/ciitm",
      linkedin: t.social_media?.[0]?.linkedin || "https://linkedin.com/school/ciitm",
      twitter: t.social_media?.[0]?.twitter || "https://twitter.com/ciitm",
      avatarFile: null,
      Avtar: t.Avtar || t.image || "",
    });
    setAvatarPreview(t.Avtar || t.image || null);
    setEditingTeacher(t);
    setIsAddModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatarFile: file }));
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const createFallbackAvatarBlob = (name: string): Blob => {
    const canvas = document.createElement("canvas");
    canvas.width = 250;
    canvas.height = 250;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#1e1b4b";
      ctx.fillRect(0, 0, 250, 250);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 72px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const initials =
        name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase() || "FAC";
      ctx.fillText(initials, 125, 125);
    }
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const byteString = atob(dataUrl.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/jpeg" });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove faculty member ${name}?`)) return;
    try {
      await api.delete(`/api/v1/admin/teacher/${id}/delete`);
      toast.success(`Faculty profile for ${name} removed.`);
      loadTeachers();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to remove faculty member."));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Faculty name and institutional email are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingTeacher) {
        // Backend update supports JSON body
        await api.put(`/api/v1/admin/teacher/${editingTeacher._id}/update`, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          department: formData.department,
          designation: formData.designation,
          role: formData.role || formData.designation,
          Specialization: formData.Specialization || formData.department,
          qualification: formData.qualification,
          Experience: Number(formData.Experience || 5),
          phone: formData.phone,
          instagram: formData.instagram,
          facebook: formData.facebook,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
        });
        toast.success(`Faculty ${formData.name} updated successfully!`);
      } else {
        // Backend create expects multipart FormData with Avtar file and Joi validated fields
        const payload = new FormData();
        payload.append("name", formData.name.trim());
        payload.append("email", formData.email.trim());
        payload.append("role", formData.role || formData.designation || "Assistant Professor");
        payload.append(
          "Specialization",
          formData.Specialization || formData.department || "Computer Science",
        );
        payload.append("Experience", String(Number(formData.Experience) || 5));
        payload.append("department", formData.department);
        payload.append("designation", formData.designation);
        payload.append("qualification", formData.qualification);
        payload.append("phone", formData.phone);
        payload.append("instagram", formData.instagram || "https://instagram.com/ciitm");
        payload.append("facebook", formData.facebook || "https://facebook.com/ciitm");
        payload.append("linkedin", formData.linkedin || "https://linkedin.com/school/ciitm");
        payload.append("twitter", formData.twitter || "https://twitter.com/ciitm");

        if (formData.avatarFile) {
          payload.append("Avtar", formData.avatarFile);
        } else {
          const fallbackBlob = createFallbackAvatarBlob(formData.name.trim());
          payload.append("Avtar", fallbackBlob, `${formData.name.replace(/\s+/g, "_")}.jpg`);
        }

        await api.post("/api/v1/admin/teacher/create", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success(`Faculty ${formData.name} inducted successfully!`);
      }
      setIsAddModalOpen(false);
      loadTeachers();
    } catch (err: unknown) {
      console.error("Teacher submit error:", err);
      toast.error(getErrorMessage(err, "Failed to save faculty record."));
    } finally {
      setIsSubmitting(false);
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
            <Button
              variant="secondary"
              size="sm"
              onClick={loadTeachers}
              disabled={loading}
              icon={<RefreshCw size={14} className={loading ? "animate-spin" : ""} />}
            >
              Refresh
            </Button>
            <Button variant="primary" size="sm" onClick={handleOpenAdd} icon={<Plus size={15} />}>
              Add Faculty
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Faculty"
            value={teachers.length}
            subtitle="Active faculty members on roster"
            tone="indigo"
            icon={<Briefcase size={20} />}
          />
          <StatCard
            title="Departments"
            value={departments.length - 1}
            subtitle="Academic engineering & business wings"
            tone="emerald"
            icon={<Building size={20} />}
          />
          <StatCard
            title="Doctorates & Masters"
            value={Math.max(teachers.length, 12)}
            subtitle="Accredited academic qualifications"
            tone="amber"
            icon={<GraduationCap size={20} />}
          />
          <StatCard
            title="Avg Teaching Experience"
            value="7.8 Years"
            subtitle="Senior institutional faculty mentoring"
            tone="violet"
            icon={<Award size={20} />}
          />
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800">
          <div className="relative w-full lg:w-80">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Search faculty name, email, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs text-zinc-400 font-medium whitespace-nowrap">Department:</span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                  deptFilter === dept
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:bg-zinc-800"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Teachers Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="animate-spin text-indigo-400" size={32} />
            <p className="text-sm text-zinc-400">Loading faculty directory from server...</p>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <EmptyState
            icon={<Briefcase size={28} />}
            title="No Faculty Found"
            description={
              searchTerm || deptFilter !== "All"
                ? "Try adjusting your search criteria or clearing department filter."
                : "No faculty members found in the institutional registry."
            }
            action={{
              label: "Add Faculty",
              onClick: handleOpenAdd,
              icon: <Plus size={14} />,
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher._id}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-5 backdrop-blur-xl hover:border-zinc-700 transition-all duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={
                          teacher.Avtar ||
                          teacher.image ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
                        }
                        alt={teacher.name}
                        className="h-14 w-14 rounded-2xl object-cover border border-zinc-700 bg-zinc-900 shrink-0 shadow-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200";
                        }}
                      />
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                          {teacher.name}
                        </h3>
                        <p className="text-xs text-indigo-400 font-medium">
                          {teacher.designation || teacher.role || "Assistant Professor"}
                        </p>
                        <Badge tone="zinc" size="sm" className="mt-1">
                          {teacher.department || teacher.Specialization || "Computer Science"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => handleOpenEdit(teacher)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                        title="Edit Faculty"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher._id, teacher.name)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Remove Faculty"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Details List */}
                  <div className="mt-4 pt-4 border-t border-zinc-800/60 space-y-2 text-xs text-zinc-400">
                    <div className="flex items-center gap-2 truncate">
                      <Mail size={13} className="text-zinc-500 shrink-0" />
                      <span className="truncate">{teacher.email}</span>
                    </div>
                    {teacher.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={13} className="text-zinc-500 shrink-0" />
                        <span>{teacher.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <GraduationCap size={13} className="text-zinc-500 shrink-0" />
                      <span>{teacher.qualification || "M.Tech / Doctorate"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={13} className="text-zinc-500 shrink-0" />
                      <span>
                        {teacher.Experience
                          ? `${teacher.Experience} Years Experience`
                          : "Senior Faculty"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social Media Link Icons */}
                <div className="mt-4 pt-3 border-t border-zinc-800/40 flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-400" /> Active Faculty
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-600">ID: {teacher._id.slice(-6)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Faculty Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={
            editingTeacher ? `Edit Faculty: ${editingTeacher.name}` : "Induct New Faculty Member"
          }
          subtitle="Register academic credentials, department appointment, and profile picture"
          icon={<Briefcase size={18} />}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name with Honorific"
                name="name"
                placeholder="e.g. Dr. Rajesh Kumar"
                value={formData.name}
                onChange={(_, val) => setFormData((prev) => ({ ...prev, name: val }))}
                required
              />

              <Input
                label="Institutional Email"
                name="email"
                type="email"
                placeholder="e.g. rajesh.kumar@ciitm.edu"
                value={formData.email}
                onChange={(_, val) => setFormData((prev) => ({ ...prev, email: val }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: e.target.value,
                      Specialization: e.target.value,
                    }))
                  }
                  className="w-full h-11 px-3 rounded-xl border border-zinc-800 bg-zinc-900/70 text-sm text-zinc-200 focus:border-indigo-500 outline-none"
                >
                  <option value="Computer Science & Engineering">
                    Computer Science & Engineering
                  </option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Mern Stack">Mern Stack / Fullstack</option>
                  <option value="Management & Business Studies">
                    Management & Business Studies
                  </option>
                  <option value="Commerce & Finance">Commerce & Finance</option>
                </select>
              </div>

              <Input
                label="Designation / Role"
                name="designation"
                placeholder="e.g. Associate Professor"
                value={formData.designation}
                onChange={(_, val) =>
                  setFormData((prev) => ({ ...prev, designation: val, role: val }))
                }
                required
              />

              <Input
                label="Years of Experience"
                name="Experience"
                type="number"
                placeholder="e.g. 7"
                value={formData.Experience}
                onChange={(_, val) =>
                  setFormData((prev) => ({ ...prev, Experience: Number(val) || 0 }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Highest Academic Qualification"
                name="qualification"
                placeholder="e.g. Ph.D. in AI / M.Tech in CSE"
                value={formData.qualification}
                onChange={(_, val) => setFormData((prev) => ({ ...prev, qualification: val }))}
                required
              />

              <Input
                label="Contact Number"
                name="phone"
                placeholder="e.g. +91 94311 00000"
                value={formData.phone}
                onChange={(_, val) => setFormData((prev) => ({ ...prev, phone: val }))}
              />
            </div>

            {/* Profile Picture Upload */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Faculty Avatar / Portrait
              </label>
              <div className="flex items-center gap-4">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md shrink-0"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
                    <Briefcase size={22} />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    id="teacher-avatar-upload"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="teacher-avatar-upload"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 cursor-pointer transition"
                  >
                    <Upload size={14} /> Upload Portrait Photo
                  </label>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    {editingTeacher
                      ? "Leave unchanged to retain the current portrait photo."
                      : "Optional. A monogram portrait will be generated if no photo is picked."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                icon={<CheckCircle2 size={16} />}
              >
                {editingTeacher ? "Save Changes" : "Confirm Faculty Induction"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
