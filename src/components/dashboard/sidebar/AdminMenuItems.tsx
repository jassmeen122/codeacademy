
import {
  Activity,
  Book,
  BookOpen,
  Briefcase,
  FileCode,
  Gauge,
  Settings,
  Users,
  MessageSquare,
  GraduationCap,
  School,
  BookText,
  FileSearch,
  Library
} from "lucide-react";
import { MenuItem } from "@/types/sidebar";

export const adminMenuItems: MenuItem[] = [
  {
    title: "Learning Dashboard",
    icon: Gauge,
    href: "/admin",
    description: "Monitor platform statistics and activities"
  },
  {
    title: "Learners Management",
    icon: GraduationCap,
    href: "/admin/users",
    description: "Manage student and teacher accounts"
  },
  {
    title: "Community Discussions",
    icon: MessageSquare,
    href: "/admin/posts",
    description: "Moderate and manage student discussions"
  },
  {
    title: "Learning Modules",
    icon: BookText,
    href: "/admin/courses",
    description: "Create and manage educational courses"
  },
  {
    title: "Learning Assessments",
    icon: FileSearch,
    href: "/admin/exercises",
    description: "Manage coding challenges and quizzes"
  },
  {
    title: "Knowledge Library",
    icon: Library,
    href: "/admin/knowledge",
    description: "Manage educational resources"
  },
  {
    title: "Internship Program",
    icon: Briefcase,
    href: "/admin/internships",
    description: "Manage work experience opportunities"
  },
  {
    title: "Learning Analytics",
    icon: Activity,
    href: "/admin/analytics",
    description: "View educational performance metrics"
  },
  {
    title: "Platform Settings",
    icon: Settings,
    href: "/admin/settings",
    description: "Configure the learning platform"
  },
];
