import { Eye, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  student: {
    _id: string;
    uniqueId: string;
    isAdmitted: boolean;
    course?: string;
    semester?: number;
    student: {
      firstName: string;
      lastName: string;
      avtar?: string;
      dateOfBirth?: string;
      email?: string[];
      contactNumber?: string;
    };
    fee?: {
      amount_paid?: number;
      course_Fee?: number;
    };
  };
}

export function StudentRow({ student }: Props) {
  const firstName = student.student?.firstName || "Student";
  const lastName = student.student?.lastName || "";
  const initial = firstName.charAt(0).toUpperCase();
  const dob = student.student?.dateOfBirth
    ? String(student.student.dateOfBirth).slice(0, 10)
    : "N/A";
  const email = student.student?.email ? student.student.email.join(", ") : "N/A";
  const phone = student.student?.contactNumber || "N/A";
  const feePaid =
    student.fee?.amount_paid !== undefined ? `₹${student.fee.amount_paid.toLocaleString()}` : "₹0";

  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-900/40 transition-colors">
      {/* Student ID */}
      <td className="px-5 py-4 font-mono text-xs font-semibold text-indigo-400">
        <Link to={`/student/${student.uniqueId}`} className="hover:underline">
          {student.uniqueId}
        </Link>
      </td>

      {/* Student Details */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {student.student?.avtar ? (
            <img
              src={student.student.avtar}
              alt={firstName}
              className="h-9 w-9 rounded-full object-cover border border-zinc-700 shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600/30 border border-indigo-500/40 text-xs font-bold text-indigo-300 shrink-0">
              {initial}
            </div>
          )}

          <div className="min-w-0">
            <p className="font-semibold text-sm text-white truncate">
              {firstName} {lastName}
            </p>
            <p className="text-xs text-zinc-500 truncate max-w-xs">{email}</p>
          </div>
        </div>
      </td>

      {/* DOB */}
      <td className="px-5 py-4 text-xs text-zinc-400">{dob}</td>

      {/* Contact */}
      <td className="px-5 py-4 text-xs text-zinc-300 font-mono">{phone}</td>

      {/* Fee Paid */}
      <td className="px-5 py-4 text-xs font-semibold text-emerald-400 font-mono">{feePaid}</td>

      {/* Actions */}
      <td className="px-5 py-4 text-right">
        <Link
          to={`/student/${student.uniqueId}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition"
        >
          <Eye size={13} />
          <span>Profile</span>
          <ChevronRight size={12} className="text-zinc-500" />
        </Link>
      </td>
    </tr>
  );
}
