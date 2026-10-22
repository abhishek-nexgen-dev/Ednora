import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function StudentHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Student Directory
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Search academic transcripts, semester records, and enrollment dossiers.
        </p>
      </div>

      <button
        onClick={() => navigate("/admissions")}
        className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition active:scale-[0.98]"
      >
        <UserPlus size={17} />
        New Enrollment
      </button>
    </div>
  );
}
