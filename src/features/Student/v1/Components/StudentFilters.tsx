import { useState } from "react";
import { Filter, Search } from "lucide-react";
import useStudentStore from "../../../Course/v1/store/student.store";
import api from "../../../../Utils/api.utils";
import { Button } from "../../../../Components";

interface StudentFiltersProps {
  semesters: number[];
  courses: string[];
}

export function StudentFilters({ semesters, courses }: StudentFiltersProps) {
  const setStudents = useStudentStore((state) => state.setStudents);

  const [semester, setSemester] = useState<number>(semesters[0] ?? 1);
  const [course, setCourse] = useState(courses[0] || "Bachelor of Computer Applications (BCA)");
  const [uniqueIdQuery, setUniqueIdQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const searchStudents = async () => {
    try {
      setLoading(true);
      const selectedCourse = course || courses[0] || "Bachelor of Computer Applications (BCA)";

      const res = await api.get("/api/v1/Student/FindByCourseAndSemester", {
        params: {
          course: selectedCourse,
          semester,
          PerPage: 1,
          Limit: 50,
        },
      });

      if (res.data?.data && Array.isArray(res.data.data)) {
        setStudents(res.data.data);
      }
    } catch (error) {
      console.warn("Error fetching students by course/semester:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUniqueId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniqueIdQuery.trim()) return;

    try {
      setLoading(true);
      const res = await api.get(
        `/api/v1/Student/FindByUniqueId?uniqueId=${encodeURIComponent(uniqueIdQuery.trim())}`,
      );

      if (res.data?.data) {
        setStudents([res.data.data]);
      }
    } catch (error) {
      console.warn("Student lookup by uniqueId error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Direct Unique ID Search */}
        <form onSubmit={handleSearchUniqueId} className="flex-1 max-w-md flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Instant Search by Unique ID (e.g. CIITM_906953)..."
              value={uniqueIdQuery}
              onChange={(e) => setUniqueIdQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-zinc-800 bg-zinc-900/80 text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
          <Button
            type="submit"
            variant="secondary"
            size="md"
            disabled={loading || !uniqueIdQuery.trim()}
          >
            Lookup
          </Button>
        </form>

        <span className="hidden lg:block text-xs uppercase tracking-wider text-zinc-600">
          — OR FILTER BATCH —
        </span>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Course select */}
          <div className="min-w-[200px]">
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 text-xs text-zinc-200 focus:border-indigo-500 outline-none transition"
            >
              {courses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Semester select */}
          <div>
            <select
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="h-11 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 text-xs text-zinc-200 focus:border-indigo-500 outline-none transition"
            >
              {semesters.map((item) => (
                <option key={item} value={item}>
                  Semester {item}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={searchStudents}
            disabled={loading}
            icon={<Filter size={15} />}
          >
            {loading ? "Filtering..." : "Filter Batch"}
          </Button>
        </div>
      </div>
    </div>
  );
}
export default StudentFilters;
