
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
  Github,
  Database,
  Server,
  Terminal,
  Coffee,
  Boxes,
  FileJson,
  BadgeCheck,
  Cpu
} from 'lucide-react';

const links = [
  {
    title: 'Dashboard',
    href: '/student',
    icon: LayoutDashboard,
  },
  {
    title: 'Courses',
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
    title: 'Coding Exercises',
    href: '/student/exercises',
    icon: FileCode,
  },
  {
    title: 'Developer Tutorials',
    href: '/student/yt-dev-tutorials',
    icon: Youtube,
  },
  {
    title: 'GitHub Projects',
    href: '/student/github-projects',
    icon: Github,
  },
  {
    title: 'Code Editor',
    href: '/student/code-editor',
    icon: Code,
  },
  {
    title: 'AI Coding Assistant',
    href: '/student/ai-assistant',
    icon: Brain,
  },
  {
    title: 'API Playground',
    href: '/student/api-playground',
    icon: Database,
  },
  {
    title: 'System Architecture',
    href: '/student/architecture',
    icon: Cpu,
  },
  {
    title: 'Technical Forums',
    href: '/student/discussion',
    icon: MessageSquare,
  },
  {
    title: 'Projects Repository',
    href: '/student/projects',
    icon: FolderKanban,
  },
  {
    title: 'Internship Opportunities',
    href: '/student/internships',
    icon: Briefcase,
  },
  {
    title: 'Developer Games',
    href: '/student/mini-game',
    icon: Gamepad2,
  },
  {
    title: 'Learning Progress',
    href: '/student/progress',
    icon: TrendingUp,
  },
  {
    title: 'Achievements',
    href: '/student/achievements',
    icon: Award,
  },
  {
    title: 'Developer Network',
    href: '/student/social',
    icon: Users,
  },
  {
    title: 'Knowledge Base',
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
