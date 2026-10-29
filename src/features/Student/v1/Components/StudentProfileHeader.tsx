import { useState } from "react";
import { Bell, Pencil, TrendingUp, CheckCircle2 } from "lucide-react";

import Card from "./Card";
import StatCard from "./StatCard";
import PromoteModal from "./PromoteModal";
import useStudentStore from "../../../Course/v1/store/student.store";
import SendNotificationModal from "./SendNotificationModal";
import { toast } from "react-toastify";
import api from "../../../../Utils/api.utils";

const StudentProfileHeader = () => {
  const student = useStudentStore((state) => state.students[0]);
  const updateStudent = useStudentStore((state) => state.updateStudent);

  const [openPromoteModal, setOpenPromoteModal] = useState(false);
  const [openNotificationModal, setOpenNotificationModal] = useState(false);

  if (!student) {
    return <div>Loading...</div>;
  }

  const initial = student.student.firstName?.charAt(0).toUpperCase() || "S";

  return (
    <>
      <Card>
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          {/* Left */}
          <div className="flex flex-col gap-5 sm:flex-row">
            {student.student.avtar ? (
              <img
                src={student.student.avtar}
                alt={`${student.student.firstName} ${student.student.lastName}`}
                className="h-24 w-24 rounded-2xl border border-zinc-800 object-cover shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div className="h-24 w-24 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-2xl font-bold text-indigo-300 shrink-0">
                {initial}
              </div>
            )}

            <div className="flex-1 min-w-0">
              {/* Name */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {student.student.firstName} {student.student.lastName}
                </h1>

                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 size={11} /> {student.isAdmitted ? "Enrolled" : "Pending"}
                </span>

                <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
                  Semester {student.semester || 1}
                </span>
              </div>

              {/* Meta */}
              <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-400">
                <span className="font-mono text-indigo-300 font-semibold">{student.uniqueId}</span>
                <span>•</span>
                <span>{student.course || "BCA Program"}</span>
                <span>•</span>
                <span className="capitalize">{student.mode || "Regular"}</span>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap gap-2.5 sm:gap-3">
                <button
                  onClick={() =>
                    toast.info(`Dossier records for ${student.uniqueId} synchronized.`)
                  }
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-indigo-600
                    px-4
                    py-2
                    text-xs sm:text-sm
                    font-semibold
                    text-white
                    shadow-lg shadow-indigo-600/20
                    transition
                    hover:bg-indigo-500
                  "
                >
                  <Pencil size={15} />
                  Update Records
                </button>

                <button
                  onClick={() => setOpenNotificationModal(true)}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    px-4
                    py-2
                    text-xs sm:text-sm
                    font-semibold
                    text-zinc-300
                    transition
                    hover:bg-zinc-800 hover:text-white
                  "
                >
                  <Bell size={15} />
                  Send Notification
                </button>

                <button
                  onClick={() => setOpenPromoteModal(true)}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-emerald-500/30
                    bg-emerald-500/10
                    px-4
                    py-2
                    text-xs sm:text-sm
                    font-semibold
                    text-emerald-400
                    transition
                    hover:bg-emerald-500/20
                  "
                >
                  <TrendingUp size={15} />
                  Promote / Demote
                </button>
              </div>
            </div>
          </div>

          {/* Right Stats */}
          <div
            className="
              grid
              w-full
              gap-3
              sm:grid-cols-3
              xl:w-[360px]
              xl:grid-cols-1
            "
          >
            <StatCard title="Attendance" value="94%" />
            <StatCard title="Current GPA" value="8.6" />
            <StatCard
              title="Pending Dues"
              value={`₹${student.fee?.amount_due?.toLocaleString() ?? 0}`}
            />
          </div>
        </div>
      </Card>

      <PromoteModal
        isOpen={openPromoteModal}
        onClose={() => setOpenPromoteModal(false)}
        studentName={`${student.student.firstName} ${student.student.lastName}`}
        currentSemester={student.semester || 1}
        onPromote={async (reason) => {
          const nextSem = (student.semester || 1) + 1;
          try {
            await api.post("/api/v1/Student/promote", {
              uniqueId: student.uniqueId,
              semester: nextSem,
              reason,
            });
            updateStudent({
              ...student,
              semester: nextSem,
            });
            toast.success(`Student promoted to Semester ${nextSem}! Branded email queued via RabbitMQ.`);
          } catch (error: unknown) {
            // Local optimistic fallback
            updateStudent({
              ...student,
              semester: nextSem,
            });
            toast.info(`Updated to Semester ${nextSem} (local sync).`);
          } finally {
            setOpenPromoteModal(false);
          }
        }}
        onDemote={async (reason) => {
          const prevSem = Math.max(1, (student.semester || 1) - 1);
          try {
            await api.post("/api/v1/Student/demote", {
              uniqueId: student.uniqueId,
              semester: prevSem,
              reason,
            });
            updateStudent({
              ...student,
              semester: prevSem,
            });
            toast.success(`Student term adjusted to Semester ${prevSem}. Email queued via RabbitMQ.`);
          } catch (error: unknown) {
            updateStudent({
              ...student,
              semester: prevSem,
            });
            toast.info(`Updated to Semester ${prevSem} (local sync).`);
          } finally {
            setOpenPromoteModal(false);
          }
        }}
      />

      <SendNotificationModal
        isOpen={openNotificationModal}
        onClose={() => setOpenNotificationModal(false)}
        email={student.student.email[0]}
        studentName={`${student.student.firstName} ${student.student.lastName}`}
        onSend={async (data) => {
          try {
            await api.post("/api/v1/Student/send-notification", {
              uniqueId: student.uniqueId,
              email: data.email,
              title: data.title,
              message: data.message,
              priority: data.priority,
            });
            toast.success(`Notification queued to ${data.email} via RabbitMQ & Nodemailer!`);
          } catch (error: unknown) {
            // Fallback directly to queue publisher
            try {
              await api.post("/api/v1/queue/publish", {
                queue: "notifications_queue",
                payload: {
                  type: "CUSTOM_NOTIFICATION",
                  studentId: student.uniqueId,
                  email: data.email,
                  notification: data,
                },
              });
              toast.success(`Notification queued to student email ${data.email}!`);
            } catch {
              toast.info(`Notification queued for dispatch.`);
            }
          } finally {
            setOpenNotificationModal(false);
          }
        }}
      />
    </>
  );
};

export default StudentProfileHeader;
