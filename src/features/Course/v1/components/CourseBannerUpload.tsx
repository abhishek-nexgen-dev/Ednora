import { ImagePlus, Sparkles, X } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { useRef, useState } from "react";
import useCourseFormContext from "../hooks/useCourseFormContext";
import { useFormState } from "react-hook-form";
import clsx from "clsx";

type CourseBannerUploadProps = {
  onImageChange?: (file: File | null) => void;
  onLogoChange?: (file: File | null) => void;
};

export function CourseBannerUpload({
  onImageChange,
  onLogoChange,
}: CourseBannerUploadProps) {
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const { watch, setValue, control } = useCourseFormContext();

  const { errors } = useFormState({
    control,
  });

  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const handleBannerUpload = (file: File | null) => {
    setBannerFile(file);
    setValue("courseImage", file, { shouldValidate: true });
    onImageChange?.(file);
  };

  const handleLogoUpload = (file: File | null) => {
    setLogoFile(file);
    setValue("courseLogo", file, { shouldValidate: true });
    onLogoChange?.(file);
  };

  return (
    <section className="space-y-6">
      <SectionTitle number="01" title="Course Visual Identity (Banner & Logo)" />

      {/* Hidden File Inputs */}
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleBannerUpload(e.target.files[0]);
          }
        }}
        className="hidden"
        id="course-banner-upload"
      />

      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleLogoUpload(e.target.files[0]);
          }
        }}
        className="hidden"
        id="course-logo-upload"
      />

      {/* Dual Upload Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Course Banner (2 Cols) */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={13} className="text-indigo-400" />
              1. Course Banner Image (Primary Header)
            </span>
            {bannerFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBannerUpload(null);
                  if (bannerInputRef.current) bannerInputRef.current.value = "";
                }}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <X size={13} /> Remove
              </button>
            )}
          </div>

          <div
            onClick={() => bannerInputRef.current?.click()}
            className="relative p-6 sm:p-8 overflow-hidden rounded-2xl border border-dashed border-indigo-500/40 bg-zinc-950 cursor-pointer hover:border-indigo-400 transition group min-h-[200px] flex flex-col items-center justify-center text-center"
          >
            {bannerFile ? (
              <div className="w-full relative">
                <img
                  src={URL.createObjectURL(watch("courseImage") as File)}
                  alt="Course Banner"
                  className="max-h-64 w-full object-cover rounded-xl shadow-lg border border-zinc-800"
                />
                <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-black/75 text-[10px] text-white backdrop-blur">
                  Change Banner
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-105 transition">
                  <ImagePlus size={36} />
                </div>
                <p className="mt-3 font-semibold text-white text-sm sm:text-base">
                  Upload Course Banner
                </p>
                <p
                  className={clsx(
                    "mt-1 text-xs",
                    errors.courseImage?.message ? "text-red-400" : "text-zinc-500"
                  )}
                >
                  Recommended: 1200x600px (16:9). Stored securely on Cloudinary.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Course Logo / Emblem (1 Col) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={13} className="text-indigo-400" />
              2. Course Logo (Badge)
            </span>
            {logoFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogoUpload(null);
                  if (logoInputRef.current) logoInputRef.current.value = "";
                }}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <X size={13} /> Remove
              </button>
            )}
          </div>

          <div
            onClick={() => logoInputRef.current?.click()}
            className="relative p-6 overflow-hidden rounded-2xl border border-dashed border-indigo-500/40 bg-zinc-950 cursor-pointer hover:border-indigo-400 transition group min-h-[200px] flex flex-col items-center justify-center text-center"
          >
            {logoFile ? (
              <div className="flex flex-col items-center justify-center w-full">
                <img
                  src={URL.createObjectURL(watch("courseLogo") as File)}
                  alt="Course Logo"
                  className="h-32 w-32 object-cover rounded-2xl shadow-xl border border-indigo-500/30"
                />
                <span className="mt-2 text-[11px] text-zinc-400">Click to replace</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-105 transition">
                  <ImagePlus size={32} />
                </div>
                <p className="mt-3 font-semibold text-white text-xs sm:text-sm">
                  Upload Course Logo
                </p>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Recommended: 400x400px (1:1). Program badge or crest.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
