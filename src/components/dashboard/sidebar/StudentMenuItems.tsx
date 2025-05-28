import React from "react";
import { 
  BookOpen, 
  Trophy, 
  Code, 
  MessageSquare, 
  Briefcase, 
  Settings, 
  Bell, 
  Users, 
  User, 
  BarChart3, 
  PlayCircle,
  Brain,
  Zap
} from "lucide-react";
import { SidebarMenuItem } from "../DashboardSidebar";

export const getStudentMenuItems = (): SidebarMenuItem[] => [
  {
    icon: BookOpen,
    label: "Cours",
    href: "/student/courses",
  },
  {
    icon: Code,
    label: "Exercices",
    href: "/student/exercises",
  },
  {
    icon: Trophy,
    label: "Réalisations",
    href: "/student/achievements",
  },
  {
    icon: BarChart3,
    label: "Progrès",
    href: "/student/progress",
  },
  {
    icon: PlayCircle,
    label: "Mini-Jeu",
    href: "/student/mini-game",
  },
  {
    icon: Code,
    label: "Éditeur de Code",
    href: "/student/code-editor",
  },
  {
    icon: Brain,
    label: "Assistant IA",
    href: "/student/ai-assistant",
  },
  {
    icon: Zap,
    label: "IA Locale",
    href: "/student/local-ai-assistant",
    badge: "Nouveau"
  },
  {
    icon: MessageSquare,
    label: "Discussions",
    href: "/student/discussion",
  },
  {
    icon: Users,
    label: "Messages",
    href: "/student/messages",
  },
  {
    icon: Briefcase,
    label: "Stages",
    href: "/student/internships",
  },
  {
    icon: Bell,
    label: "Notifications",
    href: "/student/notifications",
  },
  {
    icon: User,
    label: "Profil",
    href: "/student/profile",
  },
  {
    icon: Settings,
    label: "Paramètres",
    href: "/student/settings",
  },
];
