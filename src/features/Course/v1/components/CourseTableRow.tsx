import React from "react";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Course } from "../store/course.store";
import useCourseStore from "../store/course.store";
import { toast } from "react-toastify";
import api from "../../../../Utils/api.utils";

interface CourseTableRowProps {
  course: Course;
  onEdit?: (course: Course) => void;
}

const CourseTableRow: React.FC<CourseTableRowProps> = ({ course, onEdit }) => {
  const navigate = useNavigate();
  const removeCourse = useCourseStore((state) => state.removeCourse);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete course ${course.courseName}?`)) return;

    try {
      if (course._id) {
        await api.delete(`/api/v1/admin/course/${course._id}/delete`);
      }
      removeCourse(course._id || course.courseCode);
      toast.success(`Course "${course.courseName}" deleted successfully.`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to delete course.");
    }
  };

  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-900/40 transition-colors">
      <td className="px-4 py-3.5 font-mono text-xs font-semibold text-indigo-400">
        {course.courseCode}
      </td>
      <td className="px-4 py-3.5">
        <div className="font-semibold text-sm text-white">{course.courseName}</div>
        <div className="text-xs text-zinc-500 mt-0.5">
          {course.Department || "Engineering & Technology"}
        </div>
      </td>
      <td className="px-4 py-3.5 font-mono text-xs text-zinc-300">
        ₹{course.fee || course.coursePrice}
      </td>
      <td className="px-4 py-3.5 text-xs text-zinc-300">
        {course.duration || course.courseDuration}
      </td>
      <td className="px-4 py-3.5 text-right">
        <div className="flex items-center justify-end gap-2 text-zinc-400">
          <button
            onClick={() => navigate(`/course-view?id=${course._id || course.courseCode}`)}
            aria-label={`View ${course.courseName}`}
            title="View Course Curriculum"
            className="p-1.5 rounded-lg hover:text-indigo-400 hover:bg-zinc-800 transition"
          >
            <FaEye size={14} />
          </button>
          <button
            onClick={() => onEdit?.(course)}
            aria-label={`Edit ${course.courseName}`}
            title="Edit Course Details"
            className="p-1.5 rounded-lg hover:text-amber-400 hover:bg-zinc-800 transition"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={handleDelete}
            aria-label={`Delete ${course.courseName}`}
            title="Delete Course"
            className="p-1.5 rounded-lg hover:text-rose-400 hover:bg-rose-950/30 transition"
          >
            <FaTrash size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CourseTableRow;
