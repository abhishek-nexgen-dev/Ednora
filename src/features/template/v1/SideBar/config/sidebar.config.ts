import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  Briefcase,
  Wallet,
  Megaphone,
  MessageSquareText,
  Images,
  Quote,
  Activity,
  Settings,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export interface SidebarItemConfig {
  id: string;
  title: string;
  icon: LucideIcon;
  path: string;
  badge?: string;
}

export const sidebarConfig: SidebarItemConfig[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "admissions",
    title: "Admissions Review",
    icon: GraduationCap,
    path: "/admissions",
    badge: "Review",
  },
  {
    id: "students",
    title: "Student Directory",
    icon: Users,
    path: "/student",
  },
  {
    id: "courses",
    title: "Course Catalog",
    icon: BookOpen,
    path: "/course-management",
  },
  {
    id: "faculty",
    title: "Faculty & Staff",
    icon: Briefcase,
    path: "/teacher",
  },
  {
    id: "finance",
    title: "Tuition & Fees",
    icon: Wallet,
    path: "/payment",
  },
  {
    id: "notices",
    title: "Campus Notices",
    icon: Megaphone,
    path: "/notices",
  },
  {
    id: "inquiries",
    title: "Contact Inquiries",
    icon: MessageSquareText,
    path: "/inquiries",
  },
  {
    id: "media",
    title: "Media Gallery",
    icon: Images,
    path: "/media",
  },
  {
    id: "testimonials",
    title: "Testimonials",
    icon: Quote,
    path: "/testimonials",
  },
  {
    id: "system",
    title: "Queue & System",
    icon: Activity,
    path: "/system",
    badge: "Live",
  },
  {
    id: "settings",
    title: "Portal Settings",
    icon: Settings,
    path: "/settings",
  },
];
