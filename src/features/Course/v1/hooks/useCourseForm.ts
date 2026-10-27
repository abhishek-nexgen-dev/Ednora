import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCourseValidation } from "../Validations/CreateCourse.Validate";

const useCourseForm = () => {
  return useForm({
    mode: "onSubmit",
    resolver: zodResolver(CreateCourseValidation),
    defaultValues: {
      courseName: "",
      courseCode: "",
      courseDescription: "",
      mode: "Hybrid" as const,
      courseDuration: "3 Years",
      courseEligibility: "10+2 with minimum 50% marks",
      coursePrice: 45000,
      seats: 60,
      courseImage: undefined,
      Department: "Computer Science",
      AdmissionCriteria: ["10+2 with minimum 50% aggregate marks"],
      RequiredDocuments: ["10th & 12th Marksheet", "Government ID Proof"],
    },
  });
};

export default useCourseForm;
