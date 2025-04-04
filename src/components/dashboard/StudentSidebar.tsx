
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
  Laptop,
  Command,
  GraduationCap,
  Languages,
  UserSquare2,
  Brain,
  Gamepad2,
  Users,
  MessageCircle,
  Book,
  Briefcase,
  Youtube,
  Star
} from 'lucide-react';

const links = [
  {
    title: 'Dashboard',
    href: '/student',
    icon: LayoutDashboard,
  },
  {
    title: 'Premium Courses',
    href: '/student/courses',
    icon: BookOpen,
  },
  {
    title: 'Free Courses',
    href: '/student/free-courses',
    icon: GraduationCap,
  },
  {
    title: 'Programming Languages',
    href: '/student/languages',
    icon: Languages,
  },
  {
    title: 'Exercises',
    href: '/student/exercises',
    icon: FileCode,
  },
  {
    title: 'YT Dev Tutorials',
    href: '/student/yt-dev-tutorials',
    icon: Youtube,
  },
  {
    title: 'Discussion Forum',
    href: '/student/discussion',
    icon: MessageSquare,
  },
  {
    title: 'Projects',
    href: '/student/projects',
    icon: FolderKanban,
  },
  {
    title: 'Internship Opportunities',
    href: '/student/internships',
    icon: Briefcase,
  },
  {
    title: 'Code Editor',
    href: '/student/code-editor',
    icon: Code,
  },
  {
    title: 'AI Assistant',
    href: '/student/ai-assistant',
    icon: Brain,
  },
  {
    title: 'Mini Game',
    href: '/student/mini-game',
    icon: Gamepad2,
  },
  {
    title: 'Progress',
    href: '/student/progress',
    icon: TrendingUp,
  },
  {
    title: 'Suivi Étoiles',
    href: '/student/simple-progress',
    icon: Star,
  },
  {
    title: 'Achievements',
    href: '/student/achievements',
    icon: Award,
  },
  {
    title: 'Social Feed',
    href: '/student/social',
    icon: Users,
  },
  {
    title: 'Knowledge Share',
    href: '/student/knowledge',
    icon: Book,
  },
  {
    title: 'Messages',
    href: '/student/messages',
    icon: MessageCircle,
  },
  {
    title: 'Profile',
    href: '/student/profile',
    icon: UserSquare2,
  },
  {
    title: 'Settings',
    href: '/student/settings',
    icon: Settings,
  },
];

interface StudentSidebarProps {
  className?: string;
}

export function StudentSidebar({ className }: StudentSidebarProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const location = useLocation();

  const toggleExpand = (title: string) => {
    setExpanded(expanded === title ? null : title);
  };

  return (
    <div className={cn('pb-12', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'transparent',
                    'justify-start'
                  )
                }
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.title}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
