import { memo } from "react";
import { BadgeCheck, Mail, Phone, GraduationCap, IdCard } from "lucide-react";

import useStudentStore from "../../../Course/v1/store/student.store";

function StudentProfileCard() {
  const student = useStudentStore((state) => state.students[0]);

  console.log("ss---->", student);

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[2rem]
        border
        border-white/10
        bg-gradient-to-b
        from-white/[0.06]
        to-white/[0.03]
        p-6
        shadow-[0_20px_60px_rgba(0,0,0,0.28)]
        backdrop-blur-xl
        xl:p-8
      "
    >
      {/* Glow */}
      <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative">
          {student.student.avtar ? (
            <img
              src={student.student.avtar}
              alt={student.student.firstName}
              className="
                h-28
                w-28
                sm:h-32
                sm:w-32
                rounded-[2rem]
                border-4
                border-violet-400/20
                object-cover
                shadow-[0_20px_50px_rgba(0,0,0,0.35)]
              "
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-[2rem] bg-indigo-600/30 border-4 border-indigo-500/40 flex items-center justify-center text-3xl font-bold text-indigo-300">
              {student.student.firstName?.charAt(0).toUpperCase() || "S"}
            </div>
          )}

          <div className="absolute -bottom-2 -right-2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
            <BadgeCheck size={18} className="text-white" />
          </div>
        </div>

        {/* Status */}
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300">
          <BadgeCheck size={14} />
          {student.isAdmitted ? "Enrolled & Active" : "Pending Verification"}
        </div>

        {/* Name */}
        <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
          {student.student.firstName + " " + student.student.lastName}
        </h2>

        {/* Student ID */}
        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-xs sm:text-sm text-violet-300 font-mono">
          <IdCard size={14} />
          {student.uniqueId}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/5 bg-black/20 p-4 text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Program</p>

            <p className="mt-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-white truncate">
              <GraduationCap size={15} className="shrink-0" />
              <span className="truncate">{student.course || "BCA Program"}</span>
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-black/20 p-4 text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Semester</p>

            <p className="mt-2 text-xs sm:text-sm font-medium text-white">
              Semester {student.semester || 1}
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-black/20 p-4 text-left col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Email Address</p>

            <p className="mt-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-white truncate">
              <Mail size={15} className="text-zinc-400 shrink-0" />
              <span className="truncate">
                {student.student.email ? student.student.email[0] : "N/A"}
              </span>
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-black/20 p-4 text-left col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Mobile Number</p>

            <p className="mt-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-white font-mono">
              <Phone size={15} className="text-zinc-400 shrink-0" />
              <span>{student.student.contactNumber || "N/A"}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(StudentProfileCard);
