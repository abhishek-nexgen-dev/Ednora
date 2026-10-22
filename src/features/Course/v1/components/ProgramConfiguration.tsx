import { Controller, useFormState } from "react-hook-form";

import DropDown from "../../../../Components/DropDown";
import Input from "../../../../Components/Input";
import useCourseFormContext from "../hooks/useCourseFormContext";
import { SectionTitle } from "./SectionTitle";

export function ProgramConfiguration() {
  const { control } = useCourseFormContext();

  const { errors } = useFormState({
    control,
  });

  return (
    <section className="space-y-6">
      <SectionTitle number="02" title="Program Configuration" />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Course Name */}
        <Controller
          name="courseName"
          control={control}
          render={({ field }) => (
            <Input
              label="Course Name"
              name={field.name}
              placeholder="Bachelor of Computer Applications"
              value={field.value ?? ""}
              readonly={false}
              error={errors.courseName?.message}
              onChange={(_, value) => field.onChange(value)}
            />
          )}
        />

        {/* Course Code */}
        <Controller
          name="courseCode"
          control={control}
          render={({ field }) => (
            <Input
              label="Course Code"
              name={field.name}
              placeholder="BCA-001"
              value={field.value ?? ""}
              readonly={false}
              error={errors.courseCode?.message}
              onChange={(_, value) => field.onChange(value)}
            />
          )}
        />

        {/* Department */}
        <Controller
          name="Department"
          control={control}
          render={({ field }) => (
            <DropDown
              label="Department"
              value={field.value}
              error={errors.Department?.message}
              options={[
                "Computer Science",
                "Information Technology",
                "Electronics and Communication",
                "Mechanical Engineering",
                "Civil Engineering",
                "Electrical Engineering",
                "Chemical Engineering",
                "Business Administration",
                "Commerce",
                "Arts",
              ]}
              onSelect={field.onChange}
            />
          )}
        />

        {/* Course Mode */}
        <Controller
          name="mode"
          control={control}
          render={({ field }) => (
            <DropDown
              label="Course Mode"
              value={field.value}
              error={errors.mode?.message}
              options={["Offline", "Online", "Hybrid"]}
              onSelect={field.onChange}
            />
          )}
        />

        {/* Course Price */}
        <Controller
          name="coursePrice"
          control={control}
          render={({ field }) => (
            <Input
              type="number"
              label="Course Fee (₹)"
              name={field.name}
              placeholder="75000"
              value={Number(field.value)}
              readonly={false}
              error={errors.coursePrice?.message}
              onChange={(_, value) => field.onChange(value)}
            />
          )}
        />

        {/* Total Seats */}
        <Controller
          name="seats"
          control={control}
          render={({ field }) => (
            <Input
              type="number"
              label="Total Seats"
              name={field.name}
              placeholder="120"
              value={field.value !== undefined ? Number(field.value) : ""}
              readonly={false}
              error={errors.seats?.message}
              onChange={(_, value) => field.onChange(value)}
            />
          )}
        />
      </div>
    </section>
  );
}
