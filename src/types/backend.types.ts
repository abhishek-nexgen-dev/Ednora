export interface BackendStudent {
  _id: string;
  uniqueId: string;
  semester: number;
  course_Id?: string;
  course?: string;
  mode?: string;
  university?: string;
  isAdmitted: boolean;
  dateOfAdmission?: string;
  applicationStatus?: "Approved" | "Pending" | "Rejected" | string;
  statusMessage?: string;
  student: {
    firstName: string;
    lastName: string;
    fatherName?: string;
    motherName?: string;
    email: string[];
    dateOfBirth: string;
    gender?: string;
    nationality?: string;
    contactNumber: string;
    avtar?: string;
  };
  guardian?: {
    Gname?: string;
    Grelation?: string;
    GcontactNumber?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pinCode?: number;
  };
  AadharCard?: {
    AadharCardNumber?: string;
  };
  tenth?: {
    tenthMarks?: number;
    tenthBoard?: string;
    tenthGrade?: string;
  };
  twelfth?: {
    twelfthMarks?: number;
    twelfthBoard?: string;
    twelfthGrade?: string;
  };
  fee: {
    amount_paid: number;
    late_Fine?: number;
    amount_due?: number;
    course_Fee?: number;
  };
}

export interface BackendCourse {
  _id?: string;
  courseName: string;
  courseCode: string;
  courseDescription?: string;
  description?: string;
  courseDuration?: string;
  duration?: string;
  courseEligibility?: string;
  eligibility?: string;
  courseThumbnail?: string;
  courseLogo?: string;
  image?: string;
  logo?: string;
  coursePrice?: number;
  fee?: number;
  numberOfStudentsEnrolled?: number;
  AdmissionCriteria?: string[];
  RequiredDocuments?: string[];
  mode?: string;
  Department?: string;
  seats?: number;
}

export interface BackendTeacher {
  _id: string;
  name: string;
  email: string;
  image?: string;
  Avtar?: string;
  role?: string;
  designation?: string;
  Specialization?: string;
  department?: string;
  qualification?: string;
  Experience?: number;
  phone?: string;
  social_media?: Array<{
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    _id?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendNotice {
  _id: string;
  title: string;
  content?: string;
  noticeContent?: string;
  doc_link?: string;
  fileUrl?: string;
  type?: string;
  target?: string;
  priority?: "normal" | "urgent" | "high" | string;
  expiryDate?: string;
  dateIssued?: string;
  date?: string;
}

export interface BackendAlbum {
  _id: string;
  aName?: string;
  albumName?: string;
  aDescription?: string;
  description?: string;
  aImage_url?: string;
  coverImage?: string;
  images?: string[];
  imageCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendImage {
  _id: string;
  title?: string;
  albumName?: string;
  albumID?: string;
  userID?: string;
  url?: string;
  imageUrl?: string;
  image_url?: string;
  uploadedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendContactInquiry {
  _id: string;
  cName?: string;
  name?: string;
  cEmail?: string;
  email?: string;
  cNumber?: number | string;
  phone?: string;
  subject?: string;
  cMessage?: string;
  message?: string;
  status?: "new" | "responded" | "resolved" | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendSocialLinks {
  _id?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  email?: string;
  number?: number | string;
}

export interface BackendFrontendSettings {
  logo?: string;
  landingPage?: {
    HeroSection?: {
      homeTitle?: string;
      homeParagraph?: string;
    };
  };
}

export interface BackendTestimonial {
  _id: string;
  name: string;
  email: string;
  image?: string;
  message: string;
  job_Role: string;
  star: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendQueueMetrics {
  connected: boolean;
  mode: string;
  messagesPublished: number;
  messagesProcessed: number;
  messagesFailed: number;
  activeQueues: string[];
  inMemoryQueueDepths: Record<string, number>;
}
