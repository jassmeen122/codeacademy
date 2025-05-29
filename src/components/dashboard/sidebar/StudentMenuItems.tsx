
import {
  Activity,
  Book,
  BookOpen,
  Brain,
  Briefcase,
  Code,
  FileCode,
  Gamepad2,
  Layout,
  MessageSquare,
  School,
  Settings,
  Trophy,
  UserRound,
  Youtube,
} from "lucide-react";
import { MenuItem } from "@/types/sidebar";

export const studentMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: School,
    href: "/student",
  },
  {
    title: "Profile",
    icon: UserRound,
    href: "/student/profile",
  },
  {
    title: "My Courses",
    icon: Book,
    href: "/student/courses",
  },
  {
    title: "Code Editor",
    icon: Code,
    href: "/student/editor",
  },
  {
    title: "AI Assistant",
    icon: Brain,
    href: "/student/ai-assistant",
  },
  {
    title: "Exercises",
    icon: FileCode,
    href: "/student/exercises",
  },
  {
    title: "YT Dev Tutorials",
    icon: Youtube,
    href: "/student/yt-dev-tutorials",
  },
  {
    title: "Projects",
    icon: Layout,
    href: "/student/projects",
  },
  {
    title: "Internship Opportunities",
    icon: Briefcase,
    href: "/student/internships",
  },
  {
    title: "Knowledge Share",
    icon: BookOpen,
    href: "/student/knowledge",
  },
  {
    title: "Progress",
    icon: Activity,
    href: "/student/progress",
  },
  {
    title: "Achievements",
    icon: Trophy,
    href: "/student/achievements",
  },
  {
    title: "Mini-Jeu",
    icon: Gamepad2,
    href: "/student/mini-game",
  },
  {
    title: "Discussion",
    icon: MessageSquare,
    href: "/student/discussion",
  },
  {
    title: "Messages Privés",
    icon: MessageSquare,
    href: "/student/private-messages",
    description: "Messages privés avec les utilisateurs"
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/student/settings",
  },
];
