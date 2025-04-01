
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
} from "lucide-react";
import { MenuItem } from "@/types/sidebar";

export const adminMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: Gauge,
    href: "/admin",
  },
  {
    title: "User Management",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Post Management",
    icon: MessageSquare,
    href: "/admin/posts",
  },
  {
    title: "Course Management",
    icon: Book,
    href: "/admin/courses",
  },
  {
    title: "Exercise Management",
    icon: FileCode,
    href: "/admin/exercises",
  },
  {
    title: "Knowledge Share",
    icon: BookOpen,
    href: "/admin/knowledge",
  },
  {
    title: "Internship Opportunities",
    icon: Briefcase,
    href: "/admin/internships",
  },
  {
    title: "Analytics",
    icon: Activity,
    href: "/admin/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];
