
import React from 'react';
import { BarChart, BookOpen, BookText, Calendar, GraduationCap, Home, MessageSquare, Target, Trophy, Users } from 'lucide-react';
import { MenuItem } from '@/types/sidebar';

export const StudentMenuItems: MenuItem[] = [
  {
    title: "Tableau de bord",
    href: "/student/dashboard",
    icon: Home,
  },
  {
    title: "Cours",
    href: "/student/courses",
    icon: BookText,
  },
  {
    title: "Exercices",
    href: "/student/exercises",
    icon: GraduationCap,
  },
  {
    title: "Mes Notes",
    href: "/student/notes",
    icon: BookOpen,
  },
  {
    title: "Achievements",
    href: "/student/achievements",
    icon: Trophy,
  },
  {
    title: "Défis",
    href: "/student/challenges",
    icon: Target,
  },
  {
    title: "Statistiques",
    href: "/student/stats",
    icon: BarChart,
  },
  {
    title: "Calendrier",
    href: "/student/calendar",
    icon: Calendar,
  },
  {
    title: "Forum",
    href: "/student/forum",
    icon: MessageSquare,
  },
  {
    title: "Communauté",
    href: "/student/community",
    icon: Users,
  },
];
