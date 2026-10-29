import React, { useState } from "react";
import DropDown from "../../../../Components/DropDown";
import { SlidersHorizontal } from "lucide-react";

interface ManageCourseFilterProps {
  academicYears: string[];
  departments: string[];
  programLevels: string[];
  onFilterChange?: (filters: Filters) => void;
}

export interface Filters {
  academicYear: string;
  department: string;
  programLevel: string;
  status: "all" | "active" | "draft";
}

const ManageCourseFilter: React.FC<ManageCourseFilterProps> = ({
  academicYears,
  departments,
  programLevels,
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<Filters>({
    academicYear: academicYears[0] || "",
    department: "All Departments",
    programLevel: "All Levels",
    status: "all",
  });

  const updateFilters = (updatedFields: Partial<Filters>) => {
    setFilters((prev) => {
      const newFilters = { ...prev, ...updatedFields };
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
      return newFilters;
    });
  };

  return (
    <div
      className="
        filter-bar 
        border border-zinc-800/80 
        bg-zinc-950/70 backdrop-blur-md
        p-4 sm:p-5 rounded-2xl shadow-xl
        flex flex-wrap items-end gap-4 text-white
      "
      style={{ minWidth: 0 }}
    >
      {/* Academic Year */}
      <div className="filter-item flex flex-col min-w-[150px] flex-grow sm:flex-grow-0">
        <DropDown
          label="Academic Year"
          options={academicYears}
          value={filters.academicYear}
          onSelect={(val) => updateFilters({ academicYear: String(val) })}
          className="w-full"
        />
      </div>

      {/* Department */}
      <div className="filter-item flex flex-col min-w-[190px] flex-grow sm:flex-grow-0">
        <DropDown
          label="Department"
          options={["All Departments", ...departments]}
          value={filters.department}
          onSelect={(val) => updateFilters({ department: String(val) })}
          className="w-full"
        />
      </div>

      {/* Program Level */}
      <div className="filter-item flex flex-col min-w-[150px] flex-grow sm:flex-grow-0">
        <DropDown
          label="Program Level"
          options={["All Levels", ...programLevels]}
          value={filters.programLevel}
          onSelect={(val) => updateFilters({ programLevel: String(val) })}
          className="w-full"
        />
      </div>

      {/* Status Buttons */}
      <div className="filter-item flex items-center gap-2 ml-auto flex-wrap pt-2 sm:pt-0">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
          {(["all", "active", "draft"] as Filters["status"][]).map((statusKey) => {
            const isActive = filters.status === statusKey;
            return (
              <button
                key={statusKey}
                type="button"
                onClick={() => updateFilters({ status: statusKey })}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
                aria-pressed={isActive}
                aria-label={`Filter by status ${statusKey}`}
              >
                {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Filter Indicator Icon Button */}
        <button
          type="button"
          aria-label="Filter status indicator"
          title="Active Filters"
          className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};

export default ManageCourseFilter;
