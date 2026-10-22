import { useEffect, useState } from "react";
import { StudentFilters } from "./v1/Components/StudentFilters";
import { StudentHeader } from "./v1/Components/StudentHeader";
import { StudentTable } from "./v1/Components/StudentTable";
import api from "../../Utils/api.utils";
import useStudentStore from "../Course/v1/store/student.store";
import { BackendCourse } from "../../types/backend.types";

export default function StudentDirectoryPage() {
  const [courses, setCourses] = useState<string[]>([
    "Bachelor of Computer Applications (BCA)",
    "Master of Computer Applications (MCA)",
    "Bachelor of Commerce (B.Com)",
    "Bachelor of Business Administration (BBA)",
  ]);
  const setStudents = useStudentStore((state) => state.setStudents);

  useEffect(() => {
    const initData = async () => {
      try {
        const cRes = await api.get("/api/v1/user/findAllCourse");
        if (cRes.data?.data && Array.isArray(cRes.data.data) && cRes.data.data.length > 0) {
          const names = cRes.data.data.map((c: BackendCourse) => c.courseName).filter(Boolean);
          if (names.length > 0) {
            setCourses(names);
          }
        }

        const defaultCourse =
          cRes.data?.data?.[0]?.courseName || "Bachelor of Computer Applications (BCA)";
        const sRes = await api.get("/api/v1/Student/FindByCourseAndSemester", {
          params: {
            course: defaultCourse,
            semester: 1,
            PerPage: 1,
            Limit: 50,
          },
        });

        if (sRes.data?.data && Array.isArray(sRes.data.data)) {
          setStudents(sRes.data.data);
        }
      } catch (err) {
        console.warn("Could not load initial student directory:", err);
      }
    };

    initData();
  }, [setStudents]);

  return (
    <div className="w-full bg-[#07080C] text-white p-3.5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <StudentHeader />
        <StudentFilters courses={courses} semesters={[1, 2, 3, 4, 5, 6]} />
        <StudentTable />
      </div>
    </div>
  );
}
