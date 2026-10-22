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
      mode: "Hybrid",
      courseDuration: "",
      courseEligibility: "",
      coursePrice: 0,
      seats: 0,
      courseImage: undefined,
      Department: "",
      AdmissionCriteria: [""],
      RequiredDocuments: [""],
    },
  });
};

export default useCourseForm;
