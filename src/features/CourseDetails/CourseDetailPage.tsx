import { useEffect, useState } from "react";
import AdmissionCriteria from "./v1/Components/AdmissionCriteria";
import CourseHero from "./v1/Components/CourseHero";
import CourseSidebar from "./v1/Components/CourseSidebar";
import ProgramDescription from "./v1/Components/ProgramDescription";
import useCourseStore, { Course } from "../Course/v1/store/course.store";
import api from "../../Utils/api.utils";
import { BackendCourse } from "../../types/backend.types";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import { EditCourseModal } from "../Course/v1/components/EditCourseModal";

export default function CourseDetailsPage() {
  const [searchParams] = useSearchParams();
  const requestedId = searchParams.get("id");

  const storeCourses = useCourseStore((state) => state.course);
  const [courses, setCourses] = useState<Course[]>(storeCourses);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const fetchCourses = () => {
    api
      .get("/api/v1/user/findAllCourse")
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data)) {
          setCourses(res.data.data);
          useCourseStore.getState().setCourse(res.data.data);
          if (requestedId) {
            const idx = res.data.data.findIndex(
              (c: BackendCourse) => c._id === requestedId || c.courseCode === requestedId,
            );
            if (idx !== -1) setSelectedIndex(idx);
          }
        }
      })
      .catch(console.warn);
  };

  useEffect(() => {
    if (storeCourses.length === 0) {
      fetchCourses();
    } else {
      setCourses(storeCourses);
      if (requestedId) {
        const idx = storeCourses.findIndex(
          (c: BackendCourse) => c._id === requestedId || c.courseCode === requestedId,
        );
        if (idx !== -1) setSelectedIndex(idx);
      }
    }
  }, [storeCourses, requestedId]);

  const activeCourse = courses[selectedIndex] ||
    courses[0] || {
      courseName: "Bachelor of Computer Applications (BCA)",
      courseCode: "BCA-101",
      Department: "Computer Science",
      courseDuration: "3 Years",
      duration: "3 Years",
      mode: "Regular (Full Time)",
      courseThumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600",
    };

  return (
    <div className="w-full bg-[#07080C] text-white p-3.5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Navigation & Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/course-management"
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition"
              title="Back to Catalog"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">
                Curriculum Syllabus
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Course Specification Dossier
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {courses.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {courses.map((c, i) => (
                  <button
                    key={c._id || c.courseCode || i}
                    onClick={() => setSelectedIndex(i)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      selectedIndex === i
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {c.courseCode || c.courseName?.slice(0, 15)}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition shrink-0"
            >
              <Edit size={14} /> Edit Course
            </button>
          </div>
        </div>

        <CourseHero
          title={activeCourse.courseName}
          department={activeCourse.Department || "Computer Science"}
          image={
            activeCourse.courseThumbnail ||
            activeCourse.image ||
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600"
          }
          duration={activeCourse.courseDuration || activeCourse.duration || "3 Years"}
          mode={activeCourse.mode || "Full Time"}
        />

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-8">
            <ProgramDescription
              description={activeCourse.courseDescription || activeCourse.description}
            />
            <AdmissionCriteria
              criteria={activeCourse.AdmissionCriteria}
              eligibility={activeCourse.courseEligibility || activeCourse.eligibility}
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4">
            <CourseSidebar />
          </div>
        </div>
      </div>

      {isEditing && (
        <EditCourseModal
          course={activeCourse}
          onClose={() => setIsEditing(false)}
          onUpdated={fetchCourses}
        />
      )}
    </div>
  );
}
