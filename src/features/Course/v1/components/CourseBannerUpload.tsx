import { ImagePlus } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { useRef, useState } from "react";
import useCourseFormContext from "../hooks/useCourseFormContext";
import { useFormState } from "react-hook-form";
import clsx from "clsx";

type CourseBannerUploadProps = {
  onImageChange?: (file: File | null) => void;
};

export function CourseBannerUpload({ onImageChange }: CourseBannerUploadProps) {
  const [courseImage, setCourseImage] = useState<File | null>(null);

  const { watch, setValue, control } = useCourseFormContext();

  const { errors } = useFormState({
    control,
  });

  const ImageRef = useRef<HTMLInputElement | null>(null);

  const onImageUploadClick = () => {
    if (ImageRef.current) {
      ImageRef.current.click();
    }
  };

  return (
    <section className="space-y-6">
      <SectionTitle number="01" title="Course Visual Identity" />

      <input
        ref={ImageRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setCourseImage(e.target.files[0]);
            setValue("courseImage", e.target.files[0]);
            onImageChange?.(e.target.files[0]);
          }
        }}
        className="hidden"
        id="course-banner-upload"
      />

      <div
        onClick={onImageUploadClick}
        className="relative p-6 sm:p-10 overflow-hidden rounded-2xl border border-dashed border-indigo-500/40 bg-zinc-950 cursor-pointer hover:border-indigo-400 transition"
      >
        <div className="flex min-h-[160px] flex-col items-center justify-center text-center">
          {courseImage ? (
            <img
              src={URL.createObjectURL(watch("courseImage") as File)}
              alt="Course Banner"
              className="max-h-72 w-full object-cover rounded-xl"
            />
          ) : (
            <>
              <ImagePlus size={44} className="text-indigo-400" />

              <p className="mt-3 font-semibold text-white text-sm sm:text-base">
                Upload Course Banner Image
              </p>

              <p
                className={clsx(
                  "mt-1 text-xs",
                  errors.courseImage?.message ? "text-red-400" : "text-zinc-500",
                )}
              >
                {errors.courseImage
                  ? errors.courseImage.message
                  : "Click to select banner. Recommended: 1200x600px. Max size: 5MB."}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
