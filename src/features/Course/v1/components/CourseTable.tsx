import React, { useState } from "react";
import CoursePagination from "./CoursePagination";
import CourseTableRow from "./CourseTableRow";
import useCourseStore, { Course } from "../store/course.store";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../../Utils/api.utils";
import { EditCourseModal } from "./EditCourseModal";

const entriesPerPage = 10;

const CourseTable: React.FC = () => {
  const course = useCourseStore((state) => state.course);
  const setCourse = useCourseStore((state) => state.setCourse);
  const removeCourse = useCourseStore((state) => state.removeCourse);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const totalEntries = course.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / entriesPerPage));

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const refreshCourses = async () => {
    try {
      const res = await api.get("/api/v1/user/findAllCourse");
      if (res.data?.data) {
        setCourse(res.data.data);
      }
    } catch (err) {
      console.warn("Failed to refresh courses:", err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete course ${name}?`)) return;

    try {
      await api.delete(`/api/v1/admin/course/${id}/delete`);
      removeCourse(id);
      toast.success(`Course "${name}" deleted successfully.`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to delete course.");
    }
  };

  const handleEdit = (c: Course) => {
    setEditingCourse(c);
  };

  return (
    <div className="bg-zinc-950 text-white rounded-2xl border border-zinc-800 shadow-xl overflow-hidden mt-4 sm:mt-6">
      {/* Mobile Card View (< md) */}
      <div className="md:hidden divide-y divide-zinc-800/80">
        {course.length > 0 ? (
          course.map((c) => (
            <div key={c._id || c.courseCode} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {c.courseCode}
                  </span>
                  <h3 className="font-bold text-sm text-white mt-1.5">{c.courseName}</h3>
                  <p className="text-xs text-zinc-500">
                    {c.Department || "Engineering & Technology"}
                  </p>
                </div>

                <span className="font-mono text-xs font-bold text-emerald-400 shrink-0">
                  ₹{c.fee || c.coursePrice}
                </span>
              </div>

              <div className="text-xs text-zinc-400 flex items-center justify-between bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/60">
                <span>
                  Duration:{" "}
                  <strong className="text-zinc-200">
                    {c.duration || c.courseDuration || "3 Years"}
                  </strong>
                </span>
                <span className="capitalize">{c.mode || "Regular"}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => navigate(`/course-view?id=${c._id || c.courseCode}`)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white"
                >
                  <FaEye size={12} /> View
                </button>
                <button
                  onClick={() => handleEdit(c)}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400"
                  title="Edit"
                >
                  <FaEdit size={12} />
                </button>
                <button
                  onClick={() => handleDelete(c._id || c.courseCode, c.courseName)}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400"
                  title="Delete"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-zinc-500">No courses catalogued yet.</div>
        )}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm min-w-[750px]">
          <thead className="bg-zinc-900/95 border-b border-zinc-800 text-xs uppercase text-zinc-400 font-semibold">
            <tr>
              <th className="px-5 py-4">CODE</th>
              <th className="px-5 py-4">COURSE NAME</th>
              <th className="px-5 py-4">PROGRAM FEE</th>
              <th className="px-5 py-4">DURATION</th>
              <th className="px-5 py-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {course.length > 0 ? (
              course.map((c) => (
                <CourseTableRow
                  key={c._id || c.courseCode}
                  course={c}
                  onEdit={handleEdit}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-zinc-500">
                  No courses found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalEntries > entriesPerPage && (
        <CoursePagination
          currentPage={currentPage}
          entriesPerPage={entriesPerPage}
          totalEntries={totalEntries}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onUpdated={refreshCourses}
        />
      )}
    </div>
  );
};

export default CourseTable;
