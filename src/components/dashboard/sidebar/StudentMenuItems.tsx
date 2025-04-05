import React from 'react';
import { BarChart, BookOpen, BookText, Calendar, GraduationCap, Home, LucideIcon, MessageSquare, Target, Trophy, Users } from 'lucide-react';
import { SidebarItem } from './SidebarItem';

interface StudentMenuItemsProps {
  pathname: string;
}

export const StudentMenuItems: React.FC<StudentMenuItemsProps> = ({ pathname }) => {
  const menuItems = [
    {
      title: "Tableau de bord",
      href: "/student/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Cours",
      href: "/student/courses",
      icon: <BookText className="h-5 w-5" />,
    },
    {
      title: "Exercices",
      href: "/student/exercises",
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      title: "Mes Notes",
      href: "/student/notes",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Achievements",
      href: "/student/achievements",
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      title: "Défis",
      href: "/student/challenges",
      icon: <Target className="h-5 w-5" />,
    },
    {
      title: "Statistiques",
      href: "/student/stats",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "Calendrier",
      href: "/student/calendar",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Forum",
      href: "/student/forum",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "Communauté",
      href: "/student/community",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-1">
      {menuItems.map((item) => (
        <SidebarItem
          key={item.href}
          title={item.title}
          href={item.href}
          icon={item.icon}
          isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
        />
      ))}
    </div>
  );
};
