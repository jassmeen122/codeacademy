
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
  Library,
  Code,
  BarChart2,
  Brain,
  Youtube,
  Gamepad2,
  UserSquare2,
  MessageCircle,
  FolderKanban,
  Languages,
  Award,
  TrendingUp
} from "lucide-react";
import { MenuItem } from "@/types/sidebar";

export const studentMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: Gauge,
    href: "/student",
    description: "View your learning dashboard"
  },
  {
    title: "My Courses",
    icon: BookOpen,
    href: "/student/courses",
    description: "Access your enrolled courses"
  },
  {
    title: "Free Courses",
    icon: GraduationCap,
    href: "/student/free-courses",
    description: "Explore free learning content"
  },
  {
    title: "Programming Languages",
    icon: Languages,
    href: "/student/languages",
    description: "Learn different programming languages"
  },
  {
    title: "Coding Exercises",
    icon: FileCode,
    href: "/student/exercises",
    description: "Practice with coding exercises"
  },
  {
    title: "Code Editor",
    icon: Code,
    href: "/student/code-editor",
    description: "Write and test code online"
  },
  {
    title: "AI Assistant",
    icon: Brain,
    href: "/student/ai-assistant",
    description: "Get help from our AI tutor"
  },
  {
    title: "YT Dev Tutorials",
    icon: Youtube,
    href: "/student/yt-dev-tutorials",
    description: "Watch developer tutorials from YouTube"
  },
  {
    title: "Analytics",
    icon: BarChart2,
    href: "/student/analytics",
    description: "Track your learning progress and stats"
  },
  {
    title: "Mini Game",
    icon: Gamepad2,
    href: "/student/mini-game",
    description: "Have fun while learning to code"
  },
  {
    title: "Progress",
    icon: TrendingUp,
    href: "/student/progress",
    description: "View your learning progress"
  },
  {
    title: "Achievements",
    icon: Award,
    href: "/student/achievements",
    description: "View your earned badges and achievements"
  },
  {
    title: "Projects",
    icon: FolderKanban,
    href: "/student/projects",
    description: "Manage your coding projects"
  },
  {
    title: "Internships",
    icon: Briefcase,
    href: "/student/internships",
    description: "Explore internship opportunities"
  },
  {
    title: "Discussion",
    icon: MessageSquare,
    href: "/student/discussion",
    description: "Participate in learning discussions"
  },
  {
    title: "Social Feed",
    icon: Users,
    href: "/student/social",
    description: "Connect with other learners"
  },
  {
    title: "Messages",
    icon: MessageCircle,
    href: "/student/messages",
    description: "Chat with teachers and students"
  },
  {
    title: "Knowledge Share",
    icon: Book,
    href: "/student/knowledge",
    description: "Share and access learning resources"
  },
  {
    title: "Profile",
    icon: UserSquare2,
    href: "/student/profile",
    description: "Manage your profile"
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/student/settings",
    description: "Configure your account"
  }
];
