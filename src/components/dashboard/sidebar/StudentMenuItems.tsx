
import {
  Book,
  Code,
  BookOpen,
  MessageSquare,
  Globe,
  FileCode,
  Terminal,
  Trophy,
  Star,
  Youtube,
  MessagesSquare,
  Briefcase,
  Users,
  Brain,
  GitBranch,
  Cpu,
  GraduationCap,
  Database
} from "lucide-react";
import { SidebarItem } from "@/types/sidebar";

export const StudentMenuItems: SidebarItem[] = [
  {
    title: "Learning",
    items: [
      {
        title: "Dashboard",
        icon: Terminal,
        href: "/student",
        description: "Overview of your learning journey"
      },
      {
        title: "Courses",
        icon: Book,
        href: "/student/courses",
        description: "Browse and follow courses"
      },
      {
        title: "Free Courses",
        icon: BookOpen,
        href: "/student/free-courses",
        description: "Popular free courses"
      },
      {
        title: "Exercises",
        icon: Code,
        href: "/student/exercises",
        description: "Programming exercises"
      },
      {
        title: "Code Editor",
        icon: FileCode,
        href: "/student/code-editor",
        description: "Development environment"
      },
      {
        title: "Star Progress",
        icon: Star,
        href: "/student/progress",
        description: "Visual progress tracking"
      },
      {
        title: "Badges & Achievements",
        icon: Trophy,
        href: "/student/achievements",
        description: "Your rewards and goals"
      }
    ]
  },
  {
    title: "Developer Resources",
    items: [
      {
        title: "Video Tutorials",
        icon: Youtube,
        href: "/student/yt-dev-tutorials",
        description: "Developer tutorials"
      },
      {
        title: "AI Assistant",
        icon: Brain,
        href: "/student/ai-assistant",
        description: "AI-powered learning support"
      },
      {
        title: "Code Sandbox",
        icon: Globe,
        href: "/student/mini-game",
        description: "Learn through practice"
      },
      {
        title: "Version Control",
        icon: GitBranch,
        href: "/student/version-control",
        description: "Git and GitHub basics"
      },
      {
        title: "Data Structures",
        icon: Database,
        href: "/student/data-structures",
        description: "Learn essential patterns"
      }
    ]
  },
  {
    title: "Community",
    items: [
      {
        title: "Forum",
        icon: MessageSquare,
        href: "/student/discussion",
        description: "Ask your questions"
      },
      {
        title: "Messages",
        icon: MessagesSquare,
        href: "/student/messages",
        description: "Private messaging"
      },
      {
        title: "Network",
        icon: Users,
        href: "/student/social",
        description: "Developer community"
      },
      {
        title: "Internships",
        icon: Briefcase,
        href: "/student/internships",
        description: "Internship opportunities"
      }
    ]
  }
];
