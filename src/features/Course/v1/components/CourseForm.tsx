import { ProgramDescription } from "./ProgramDescription";
import { AdmissionCriteria } from "./AdmissionCriteria";
import { ProgramConfiguration } from "./ProgramConfiguration";
import { CourseBannerUpload } from "./CourseBannerUpload";
import { ProtocolNotice } from "./ProtocolNotice";
import { CoursePageHeader } from "./CoursePageHeader";
import { toast, ToastContainer } from "react-toastify";
import useCourseFormContext from "../hooks/useCourseFormContext";
import { CourseSchema } from "../Validations/CreateCourse.Validate";
import { RequiredDocuments } from "./RequiredDocuments";
import useCreateCourse from "../hooks/useCreateCourse";
import { useNavigate } from "react-router-dom";
import { FieldErrors } from "react-hook-form";

const CourseForm = () => {
  const { handleSubmit } = useCourseFormContext();
  const createCourse = useCreateCourse();
  const navigate = useNavigate();

  const onSubmit = async (data: CourseSchema) => {
    try {
      const formData = new FormData();
      formData.append("courseName", data.courseName.trim());
      formData.append("courseCode", data.courseCode.trim());
      formData.append("mode", data.mode || "Hybrid");
      formData.append("seats", String(data.seats || 60));
      formData.append("courseDescription", data.courseDescription.trim());
      formData.append("courseDuration", data.courseDuration.trim() || "3 Years");
      formData.append("courseEligibility", data.courseEligibility.trim() || "10+2 or Equivalent");
      formData.append("coursePrice", String(data.coursePrice || 0));
      formData.append("Department", data.Department.trim() || "Computer Science");

      if (data.courseImage instanceof File) {
        formData.append("courseThumbnail", data.courseImage);
        formData.append("image", data.courseImage);
      } else if (typeof data.courseImage === "string" && data.courseImage) {
        formData.append("courseThumbnail", data.courseImage);
      }

      const validCriteria = (data.AdmissionCriteria || [])
        .map((c) => (typeof c === "string" ? c.trim() : ""))
        .filter(Boolean);

      if (validCriteria.length > 0) {
        validCriteria.forEach((crit) => {
          formData.append("AdmissionCriteria", crit);
        });
      } else {
        formData.append("AdmissionCriteria", "10+2 with minimum 50% aggregate marks");
      }

      if (data.RequiredDocuments && data.RequiredDocuments.length > 0) {
        data.RequiredDocuments.filter(Boolean).forEach((doc) => {
          formData.append("RequiredDocuments", doc);
        });
      }

      await createCourse.mutateAsync(formData);
      toast.success(`Course "${data.courseName}" created successfully!`);
      setTimeout(() => navigate("/course-management"), 1200);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to create course on server.");
    }
  };

  const onError = (errors: FieldErrors) => {
    const firstErrorMessage = Object.values(errors)[0]?.message;
    if (firstErrorMessage && typeof firstErrorMessage === "string") {
      toast.error(firstErrorMessage);
    } else {
      toast.error("Please fill in all required course fields before submitting.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="w-full bg-[#0A0A0A] pb-12">
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
      <CoursePageHeader />

      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8 p-3.5 sm:p-6 lg:p-8">
        <ProtocolNotice />

        <CourseBannerUpload />

        <ProgramConfiguration />

        <AdmissionCriteria />
        <RequiredDocuments />

        <ProgramDescription />
      </div>
    </form>
  );
};

export default CourseForm;
