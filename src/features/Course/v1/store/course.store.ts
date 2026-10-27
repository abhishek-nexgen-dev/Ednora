import { create } from "zustand";

export interface Course {
  _id?: string;
  courseName: string;
  courseCode: string;
  duration?: string;
  courseDuration?: string;
  fee?: number;
  coursePrice?: number;
  eligibility?: string;
  courseEligibility?: string;
  description?: string;
  courseDescription?: string;
  courseThumbnail?: string;
  image?: string;
  mode?: string;
  seats?: number;
  Department?: string;
  AdmissionCriteria?: string[];
  RequiredDocuments?: string[];
}

interface CourseStore {
  course: Course[];
  setCourse: (course: Course[]) => void;
  addCourse: (course: Course) => void;
  updateCourseInStore: (course: Course) => void;
  removeCourse: (id: string) => void;
}

const useCourseStore = create<CourseStore>((set) => ({
  course: [],

  setCourse: (course) => {
    set({
      course,
    });
  },

  addCourse: (newCourse) => {
    set((state) => ({
      course: [newCourse, ...state.course],
    }));
  },

  updateCourseInStore: (updatedCourse) => {
    set((state) => ({
      course: state.course.map((c) =>
        (c._id && c._id === updatedCourse._id) || c.courseCode === updatedCourse.courseCode
          ? { ...c, ...updatedCourse }
          : c
      ),
    }));
  },

  removeCourse: (id) => {
    set((state) => ({
      course: state.course.filter((c) => c._id !== id && c.courseCode !== id),
    }));
  },
}));

export default useCourseStore;
