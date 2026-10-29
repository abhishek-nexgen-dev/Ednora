import React, { useState, useRef } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "../../../../Utils/api.utils";
import useCourseStore, { Course } from "../store/course.store";

interface EditCourseModalProps {
  course: Course;
  onClose: () => void;
  onUpdated?: () => void;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({
  course,
  onClose,
  onUpdated,
}) => {
  const updateCourseInStore = useCourseStore((state) => state.updateCourseInStore);
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    course.courseThumbnail || course.image || ""
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(
    course.courseLogo || course.logo || ""
  );
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    courseName: course.courseName || "",
    courseCode: course.courseCode || "",
    Department: course.Department || "Computer Science",
    mode: course.mode || "Hybrid",
    courseDuration: course.courseDuration || course.duration || "3 Years",
    courseEligibility: course.courseEligibility || course.eligibility || "10+2 with minimum 50% marks",
    coursePrice: course.coursePrice || course.fee || 45000,
    seats: course.seats || 60,
    courseDescription: course.courseDescription || course.description || "",
    AdmissionCriteria:
      Array.isArray(course.AdmissionCriteria) && course.AdmissionCriteria.length > 0
        ? course.AdmissionCriteria.join("\n")
        : "10+2 with minimum 50% aggregate marks",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseName.trim() || !formData.courseCode.trim()) {
      toast.error("Course name and course code are required.");
      return;
    }

    setSubmitting(true);
    const targetId = course._id || (course as { id?: string }).id || course.courseCode || formData.courseCode.trim();

    const criteriaArray = formData.AdmissionCriteria.split("\n")
      .map((c) => c.trim())
      .filter(Boolean);

    const safeCriteria = criteriaArray.length > 0 ? criteriaArray : ["10+2 with minimum 50% aggregate marks"];

    const updatedObject: Course = {
      ...course,
      _id: course._id || targetId,
      courseName: formData.courseName.trim(),
      courseCode: formData.courseCode.trim(),
      Department: formData.Department.trim(),
      mode: formData.mode,
      courseDuration: formData.courseDuration.trim(),
      duration: formData.courseDuration.trim(),
      courseEligibility: formData.courseEligibility.trim(),
      eligibility: formData.courseEligibility.trim(),
      coursePrice: Number(formData.coursePrice || 0),
      fee: Number(formData.coursePrice || 0),
      seats: Number(formData.seats || 60),
      courseDescription: formData.courseDescription.trim(),
      description: formData.courseDescription.trim(),
      AdmissionCriteria: safeCriteria,
      courseThumbnail: thumbnailPreview || course.courseThumbnail || course.image || "",
      courseLogo: logoPreview || course.courseLogo || course.logo || "",
    };

    try {
      if (thumbnailFile || logoFile) {
        // Multipart upload when new image file is chosen
        const payload = new FormData();
        payload.append("courseName", formData.courseName.trim());
        payload.append("courseCode", formData.courseCode.trim());
        payload.append("Department", formData.Department.trim());
        payload.append("mode", formData.mode);
        payload.append("courseDuration", formData.courseDuration.trim());
        payload.append("courseEligibility", formData.courseEligibility.trim());
        payload.append("coursePrice", String(formData.coursePrice || 0));
        payload.append("seats", String(formData.seats || 60));
        payload.append("courseDescription", formData.courseDescription.trim());
        safeCriteria.forEach((crit) => payload.append("AdmissionCriteria", crit));

        if (thumbnailFile) {
          payload.append("courseThumbnail", thumbnailFile);
        } else if (thumbnailPreview) {
          payload.append("courseThumbnail", thumbnailPreview);
        }

        if (logoFile) {
          payload.append("courseLogo", logoFile);
        } else if (logoPreview) {
          payload.append("courseLogo", logoPreview);
        }

        try {
          await api.put(`/api/v1/admin/course/${encodeURIComponent(targetId)}/update`, payload);
        } catch (firstErr: unknown) {
          const errStatus = (firstErr as { response?: { status?: number } })?.response?.status;
          if (errStatus === 404 || errStatus === 405) {
            await api.put(`/api/v1/admin/course/update/${encodeURIComponent(targetId)}`, payload);
          } else {
            throw firstErr;
          }
        }
      } else {
        // Clean JSON payload when using existing banner or URL
        const jsonPayload = {
          courseName: formData.courseName.trim(),
          courseCode: formData.courseCode.trim(),
          Department: formData.Department.trim(),
          mode: formData.mode,
          courseDuration: formData.courseDuration.trim(),
          duration: formData.courseDuration.trim(),
          courseEligibility: formData.courseEligibility.trim(),
          eligibility: formData.courseEligibility.trim(),
          coursePrice: Number(formData.coursePrice || 0),
          fee: Number(formData.coursePrice || 0),
          seats: Number(formData.seats || 60),
          courseDescription: formData.courseDescription.trim(),
          description: formData.courseDescription.trim(),
          AdmissionCriteria: safeCriteria,
          courseThumbnail: thumbnailPreview || course.courseThumbnail || course.image || "",
          courseLogo: logoPreview || course.courseLogo || course.logo || "",
        };

        try {
          await api.put(`/api/v1/admin/course/${encodeURIComponent(targetId)}/update`, jsonPayload);
        } catch (firstErr: unknown) {
          const errStatus = (firstErr as { response?: { status?: number } })?.response?.status;
          if (errStatus === 404 || errStatus === 405) {
            await api.put(`/api/v1/admin/course/update/${encodeURIComponent(targetId)}`, jsonPayload);
          } else {
            throw firstErr;
          }
        }
      }

      toast.success(`Course "${formData.courseName}" updated successfully!`);
    } catch (error: unknown) {
      console.warn("Server API sync notice:", error);
      toast.info(`Updated "${formData.courseName}" locally (${getErrorMessage(error, "syncing with server")}).`);
    } finally {
      // Guaranteed optimistic update in store so UI immediately reflects all changes
      updateCourseInStore(updatedObject);
      onUpdated?.();
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-[#0C0D12] p-5 sm:p-7 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">
              Curriculum Management
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              Edit Course Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dual Visual Assets: Banner & Logo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            {/* 1. Banner Upload */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                1. Course Banner (Header)
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex items-center gap-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-16 rounded-xl overflow-hidden bg-zinc-900 border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 cursor-pointer flex flex-col items-center justify-center shrink-0 transition"
                >
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <Upload size={18} className="text-indigo-400" />
                      <span className="text-[9px] text-zinc-400 mt-0.5">Banner</span>
                    </>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-white transition flex items-center gap-1"
                  >
                    <ImageIcon size={12} /> Upload Banner
                  </button>
                  <input
                    type="text"
                    placeholder="Or banner URL..."
                    value={thumbnailPreview}
                    onChange={(e) => {
                      setThumbnailPreview(e.target.value);
                      setThumbnailFile(null);
                    }}
                    className="w-full px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Logo Upload */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                2. Course Logo (Badge)
              </label>

              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setLogoFile(file);
                    setLogoPreview(URL.createObjectURL(file));
                  }
                }}
                className="hidden"
              />

              <div className="flex items-center gap-3">
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 cursor-pointer flex flex-col items-center justify-center shrink-0 transition"
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <Upload size={18} className="text-indigo-400" />
                      <span className="text-[9px] text-zinc-400 mt-0.5">Logo</span>
                    </>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-white transition flex items-center gap-1"
                  >
                    <ImageIcon size={12} /> Upload Logo
                  </button>
                  <input
                    type="text"
                    placeholder="Or logo URL..."
                    value={logoPreview}
                    onChange={(e) => {
                      setLogoPreview(e.target.value);
                      setLogoFile(null);
                    }}
                    className="w-full px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400">Course Name *</label>
              <input
                type="text"
                required
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Course Code *</label>
              <input
                type="text"
                required
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-400">Department *</label>
              <select
                value={formData.Department}
                onChange={(e) => setFormData({ ...formData, Department: e.target.value })}
                className="w-full mt-1 px-3.5 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Engineering">Engineering</option>
                <option value="Management">Management</option>
                <option value="Commerce">Commerce</option>
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Mode *</label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="w-full mt-1 px-3.5 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Offline">Offline</option>
                <option value="Online">Online</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400">Duration *</label>
              <input
                type="text"
                required
                value={formData.courseDuration}
                onChange={(e) => setFormData({ ...formData, courseDuration: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Eligibility Criteria *</label>
              <input
                type="text"
                required
                value={formData.courseEligibility}
                onChange={(e) => setFormData({ ...formData, courseEligibility: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400">Course Fee (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={formData.coursePrice}
                onChange={(e) => setFormData({ ...formData, coursePrice: Number(e.target.value) })}
                className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Total Seats</label>
              <input
                type="number"
                min="1"
                value={formData.seats}
                onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
                className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-400">Admission Criteria (one per line)</label>
            <textarea
              rows={2}
              value={formData.AdmissionCriteria}
              onChange={(e) => setFormData({ ...formData, AdmissionCriteria: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400">Course Description *</label>
            <textarea
              rows={3}
              required
              value={formData.courseDescription}
              onChange={(e) => setFormData({ ...formData, courseDescription: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Course Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
