
import {
  BarChart,
  Bell,
  Book,
  BookOpen,
  ClipboardList,
  FileText,
  MessageSquare,
  Pencil,
  PlusCircle,
  School,
  Settings,
} from "lucide-react";
import { MenuItem } from "@/types/sidebar";

export const teacherMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: School,
    href: "/teacher",
  },
  {
    title: "My Courses",
    icon: BookOpen,
    href: "/teacher/courses",
    description: "Manage your courses"
  },
  {
    title: "Course Creator",
    icon: PlusCircle,
    href: "/teacher/courses/create",
    description: "Create new courses"
  },
  {
    title: "Exercises",
    icon: ClipboardList,
    href: "/teacher/exercises",
    description: "Manage exercises"
  },
  {
    title: "Create Exercise",
    icon: Pencil,
    href: "/teacher/exercises/create",
    description: "Create new exercises"
  },
  {
    title: "Knowledge Share",
    icon: Book,
    href: "/teacher/knowledge",
    description: "Share knowledge and resources"
  },
  {
    title: "Student Progress",
    icon: BarChart,
    href: "/teacher/progress",
    description: "Track student performance"
  },
  {
    title: "Discussion",
    icon: MessageSquare,
    href: "/teacher/discussion",
    description: "Course forums"
  },
  {
    title: "Materials",
    icon: FileText,
    href: "/teacher/materials",
    description: "Course resources"
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/teacher/notifications",
    description: "Alerts and updates"
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/teacher/settings",
    description: "Personal preferences"
  },
];
