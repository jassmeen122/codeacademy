
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
  Github,
  Database,
  Coffee,
  Cpu,
  Boxes,
  FileJson,
  Folder,
  FolderArchive
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
        icon: Globe,
        href: "/student/mini-game",
        description: "Learn while having fun"
      },
      {
        title: "GitHub Projects",
        icon: Github,
        href: "/student/github-projects",
        description: "Open source contributions"
      },
      {
        title: "API Playground",
        icon: Database,
        href: "/student/api-playground",
        description: "Test and explore APIs"
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
  },
  {
    title: "Tools & Resources",
    items: [
      {
        title: "Technical Documentation",
        icon: FileJson,
        href: "/student/documentation",
        description: "Reference materials"
      },
      {
        title: "System Architecture",
        icon: Cpu,
        href: "/student/architecture",
        description: "Architecture diagrams"
      },
      {
        title: "Package Manager",
        icon: Boxes,
        href: "/student/packages",
        description: "Find and install packages"
      },
      {
        title: "Project Templates",
        icon: Folder,
        href: "/student/templates",
        description: "Starter project templates"
      },
      {
        title: "Code Snippets",
        icon: FolderArchive,
        href: "/student/snippets",
        description: "Reusable code snippets"
      }
    ]
  }
];
