import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  Terminal,
  Coffee,
  LogOut,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthState } from '@/hooks/useAuthState';
import { UserAvatar } from '@/components/UserAvatar';
import { toast } from 'sonner';

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
  const navigate = useNavigate();
  const { session, user, loading, handleSignOut } = useAuthState();

  const toggleExpand = (title: string) => {
    setExpanded(expanded === title ? null : title);
  };

  const handleLogout = async () => {
    try {
      await handleSignOut();
      toast.success("Successfully logged out");
      navigate("/auth");
    } catch (error) {
      toast.error("Failed to log out");
      console.error("Logout error:", error);
    }
  };

  const goToDashboard = () => {
    navigate("/");
  };

  return (
    <div className={cn('pb-12', className)}>
      {/* User Profile Section */}
      <div className="px-3 py-4 border-b border-gray-700 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <UserAvatar user={user} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 truncate">
              {user?.full_name || 'User'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {user?.role || 'Loading...'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center gap-2"
            onClick={goToDashboard}
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center gap-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200 dark:border-red-800"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
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
