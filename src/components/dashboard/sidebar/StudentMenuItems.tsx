
import {
  Book,
  Code,
  BookOpen,
  MessageSquare,
  FileCode,
  Terminal,
  Trophy,
  Star,
  Youtube,
  MessagesSquare,
  Briefcase,
  Users,
  Brain,
  Coffee
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
        description: "Overview of your learning path"
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
        title: "Progress Path",
        icon: Star,
        href: "/student/progress",
        description: "Visual tracking of your progress"
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
        title: "Dev Tutorials",
        icon: Youtube,
        href: "/student/yt-dev-tutorials",
        description: "Video tutorials for developers"
      },
      {
        title: "AI Coding Assistant",
        icon: Brain,
        href: "/student/ai-assistant",
        description: "AI-powered learning support"
      },
      {
        title: "Developer Games",
        icon: Terminal,
        href: "/student/mini-game",
        description: "Learn while having fun"
      }
    ]
  },
  {
    title: "Dev Community",
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
        title: "Developer Network",
        icon: Users,
        href: "/student/social",
        description: "Social feed for developers"
      },
      {
        title: "Internships",
        icon: Briefcase,
        href: "/student/internships",
        description: "Internship opportunities"
      },
      {
        title: "Open Source",
        icon: Coffee,
        href: "/student/open-source",
        description: "Contribute to projects"
      }
    ]
  }
];
