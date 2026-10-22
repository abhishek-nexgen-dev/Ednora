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

const CourseForm = () => {
  const { handleSubmit } = useCourseFormContext();
  const createCourse = useCreateCourse();
  const navigate = useNavigate();

  const onSubmit = async (data: CourseSchema) => {
    try {
      const formData = new FormData();
      formData.append("courseName", data.courseName);
      formData.append("courseCode", data.courseCode);
      formData.append("mode", data.mode);
      formData.append("seats", String(data.seats));
      formData.append("courseDescription", data.courseDescription);
      formData.append("courseDuration", data.courseDuration);
      formData.append("courseEligibility", data.courseEligibility);
      formData.append("coursePrice", String(data.coursePrice));
      formData.append("Department", data.Department);

      if (data.courseImage) {
        formData.append("image", data.courseImage);
      }
      if (data.AdmissionCriteria) {
        data.AdmissionCriteria.forEach((crit) => {
          formData.append("AdmissionCriteria", crit);
        });
      }
      if (data.RequiredDocuments) {
        data.RequiredDocuments.forEach((doc) => {
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

  const onError = () => {
    toast.error("Please fix the validation errors before submitting.");
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
