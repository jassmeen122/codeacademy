
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
import { MenuItem } from "@/types/sidebar";

export const getStudentMenuItems = (): MenuItem[] => [
  {
    title: "Cours",
    icon: BookOpen,
    href: "/student/courses",
  },
  {
    title: "Exercices",
    icon: Code,
    href: "/student/exercises",
  },
  {
    title: "Réalisations",
    icon: Trophy,
    href: "/student/achievements",
  },
  {
    title: "Progrès",
    icon: BarChart3,
    href: "/student/progress",
  },
  {
    title: "Mini-Jeu",
    icon: PlayCircle,
    href: "/student/mini-game",
  },
  {
    title: "Éditeur de Code",
    icon: Code,
    href: "/student/code-editor",
  },
  {
    title: "Assistant IA",
    icon: Brain,
    href: "/student/ai-assistant",
  },
  {
    title: "IA Locale",
    icon: Zap,
    href: "/student/local-ai-assistant",
    isNew: true
  },
  {
    title: "Discussions",
    icon: MessageSquare,
    href: "/student/discussion",
  },
  {
    title: "Messages",
    icon: Users,
    href: "/student/messages",
  },
  {
    title: "Stages",
    icon: Briefcase,
    href: "/student/internships",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/student/notifications",
  },
  {
    title: "Profil",
    icon: User,
    href: "/student/profile",
  },
  {
    title: "Paramètres",
    icon: Settings,
    href: "/student/settings",
  },
];
