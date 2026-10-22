import z from "zod";

export const CreateCourseValidation = z.object({
  courseName: z.string().min(10, "Course name is required"),
  courseCode: z.string().min(3, "Course code is required"),
  mode: z.enum(["Online", "Offline", "Hybrid"]),
  seats: z.number(),
  courseDescription: z.string().min(120, "Course description is required"),
  courseDuration: z.string().min(1, "Course duration is required"),
  courseEligibility: z.string().min(1, "Course eligibility is required"),
  coursePrice: z.coerce.number().min(0),
  courseImage: z.instanceof(File),
  Department: z.string().min(1),
  AdmissionCriteria: z.array(z.string()).min(1),
  RequiredDocuments: z.array(z.string()).min(1),
});

export type CourseSchema = z.infer<typeof CreateCourseValidation>;
