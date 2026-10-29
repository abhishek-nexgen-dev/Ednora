import z from "zod";

export const CreateCourseValidation = z.object({
  courseName: z.string().min(2, "Course name must be at least 2 characters"),
  courseCode: z.string().min(2, "Course code is required"),
  mode: z.enum(["Online", "Offline", "Hybrid"]).default("Hybrid"),
  seats: z.coerce.number().min(0).default(60),
  courseDescription: z.string().min(10, "Course description must be at least 10 characters"),
  courseDuration: z.string().min(1, "Course duration is required").default("3 Years"),
  courseEligibility: z.string().min(1, "Course eligibility is required").default("10+2 or Equivalent"),
  coursePrice: z.coerce.number().min(0),
  courseImage: z.any().optional(),
  courseLogo: z.any().optional(),
  Department: z.string().min(1, "Department is required"),
  AdmissionCriteria: z.array(z.string()).optional().default(["10+2 with minimum 50% marks"]),
  RequiredDocuments: z.array(z.string()).optional().default(["Class 10 & 12 Marksheets", "Photo ID"]),
});

export type CourseSchema = z.infer<typeof CreateCourseValidation>;
