import Card from "./v1/Components/Card";
import PersonalInformation from "./v1/Components/PersonalInformation";
import AcademicCredentials from "./v1/Components/AcademicCredentials";
import AddressCard from "./v1/Components/AddressCard";
import EngagementCard from "./EngagementCard";
import AdministrativeNotes from "./v1/Components/AdministrativeNotes";
import { toast, ToastContainer } from "react-toastify";

import StudentProfileHeader from "./v1/Components/StudentProfileHeader";
import { ParentInfoCard } from "./v1/Components/ParentInfoCard";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../Utils/api.utils";
import useStudentStore from "../Course/v1/store/student.store";

export default function StudentProfilePage() {
  const { studentId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    useStudentStore.getState().clearStudents();

    async function fetchStudent() {
      try {
        const response = await api.get(`/api/v1/Student/FindByUniqueId?uniqueId=${studentId}`);

        const { data } = response.data;

        if (!cancelled) {
          useStudentStore.getState().setStudents([data]);
        }
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    fetchStudent();

    return () => {
      cancelled = true;
    };
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex w-full py-32 items-center justify-center bg-[#0B0C10] text-zinc-300">
        Loading student profile…
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0B0C10] p-3.5 sm:p-6">
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <StudentProfileHeader />

        {/* Content */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
          <div className="space-y-4 sm:space-y-6 lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PersonalInformation />
              <ParentInfoCard />
            </div>
            <AcademicCredentials />
            <AddressCard />
          </div>

          <div className="space-y-4 sm:space-y-6 lg:col-span-4">
            <EngagementCard />
            <AdministrativeNotes />
            <SystemActions />
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemActions() {
  const student = useStudentStore((state) => state.students[0]);

  const handleResetLMS = () => {
    if (!student) return;
    toast.success(`Temporary LMS access key sent to ${student.student?.email?.[0] || "student email"}.`);
  };

  const handleIssueBonafide = () => {
    if (!student) return;
    toast.success(`Generated official Bonafide Certificate PDF for ${student.uniqueId}. Ready for download.`);
  };

  const handleSuspension = () => {
    if (!student) return;
    if (window.confirm(`Are you sure you want to flag student ${student.uniqueId} for disciplinary review?`)) {
      toast.warn(`Disciplinary suspension notice drafted for Academic Dean review.`);
    }
  };

  return (
    <Card>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
        System Actions
      </h3>

      <div className="mt-5 space-y-3">
        <ActionButton onClick={handleResetLMS}>Reset LMS Credentials</ActionButton>

        <ActionButton onClick={handleIssueBonafide}>Issue Bonafide Certificate</ActionButton>

        <ActionButton danger onClick={handleSuspension}>Mark For Disciplinary Review</ActionButton>
      </div>
    </Card>
  );
}

function ActionButton({
  children,
  danger,
  onClick,
}: {
  children: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border px-4 py-3 text-left text-xs sm:text-sm font-medium transition active:scale-[0.99] ${
        danger
          ? "border-red-900/60 bg-red-950/20 text-red-300 hover:bg-red-950/40"
          : "border-zinc-800 bg-zinc-900/80 text-zinc-200 hover:bg-zinc-800 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
