
import { 
  LayoutDashboard, 
  BookOpen, 
  Code, 
  MessageSquare, 
  FolderKanban, 
  Award, 
  TrendingUp, 
  Settings,
  FileCode,
  Brain,
  Gamepad2,
  Users,
  MessageCircle,
  Book,
  Briefcase,
  Youtube,
  Trophy,
  UserSquare2,
  Activity
} from 'lucide-react';

export const STUDENT_NAVIGATION = [
  {
    title: 'Dashboard',
    href: '/student',
    icon: LayoutDashboard,
    category: 'main'
  },
  {
    title: 'Courses',
    href: '/student/courses',
    icon: BookOpen,
    category: 'learning'
  },
  {
    title: 'Exercises',
    href: '/student/exercises',
    icon: FileCode,
    category: 'learning'
  },
  {
    title: 'YT Dev Tutorials',
    href: '/student/yt-dev-tutorials',
    icon: Youtube,
    category: 'learning'
  },
  {
    title: 'Code Editor',
    href: '/student/code-editor',
    icon: Code,
    category: 'tools'
  },
  {
    title: 'AI Assistant',
    href: '/student/ai-assistant',
    icon: Brain,
    category: 'tools'
  },
  {
    title: 'Projects',
    href: '/student/projects',
    icon: FolderKanban,
    category: 'work'
  },
  {
    title: 'Internships',
    href: '/student/internships',
    icon: Briefcase,
    category: 'work'
  },
  {
    title: 'My Journey',
    href: '/student/progress-simple',
    icon: TrendingUp,
    category: 'progress'
  },
  {
    title: 'Progress',
    href: '/student/progress',
    icon: Activity,
    category: 'progress'
  },
  {
    title: 'Achievements',
    href: '/student/achievements',
    icon: Award,
    category: 'progress'
  },
  {
    title: 'Discussion',
    href: '/student/discussion',
    icon: MessageSquare,
    category: 'social'
  },
  {
    title: 'Private Messages',
    href: '/student/private-messages',
    icon: MessageCircle,
    category: 'social'
  },
  {
    title: 'Social Feed',
    href: '/student/social',
    icon: Users,
    category: 'social'
  },
  {
    title: 'Mini Game',
    href: '/student/mini-game',
    icon: Gamepad2,
    category: 'entertainment'
  },
  {
    title: 'Profile',
    href: '/student/profile',
    icon: UserSquare2,
    category: 'account'
  },
  {
    title: 'Settings',
    href: '/student/settings',
    icon: Settings,
    category: 'account'
  }
] as const;

export const NAVIGATION_CATEGORIES = {
  main: 'Principal',
  learning: 'Apprentissage',
  tools: 'Outils',
  work: 'Travail',
  progress: 'Progression',
  social: 'Social',
  entertainment: 'Divertissement',
  account: 'Compte'
} as const;
