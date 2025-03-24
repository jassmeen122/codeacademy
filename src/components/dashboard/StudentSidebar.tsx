
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Book, Code, GraduationCap, Settings, MessageSquare, 
  Award, BarChart2, User, FileCode, Trophy, Star
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthState } from '@/hooks/useAuthState';

type SidebarItem = {
  icon: React.ElementType;
  label: string;
  href: string;
};

export function StudentSidebar() {
  const { user } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const courseItems: SidebarItem[] = [
    {
      icon: Home,
      label: 'Dashboard',
      href: '/student/dashboard'
    },
    {
      icon: Book,
      label: 'Courses',
      href: '/student/courses'
    },
    {
      icon: Code,
      label: 'Programming Languages',
      href: '/student/languages'
    },
    {
      icon: FileCode,
      label: 'Exercises',
      href: '/student/exercises'
    },
    {
      icon: BarChart2,
      label: 'Progress',
      href: '/student/progress'
    }
  ];

  const communityItems: SidebarItem[] = [
    {
      icon: MessageSquare,
      label: 'Discussion Forum',
      href: '/student/discussion'
    },
    {
      icon: Award,
      label: 'Achievements',
      href: '/student/achievements'
    },
    {
      icon: Trophy,
      label: 'Challenges',
      href: '/student/challenges'
    }
  ];

  const toolsItems: SidebarItem[] = [
    {
      icon: GraduationCap,
      label: 'AI Assistant',
      href: '/student/ai-assistant'
    },
    {
      icon: FileCode,
      label: 'Code Editor',
      href: '/student/code-editor'
    }
  ];

  const accountItems: SidebarItem[] = [
    {
      icon: User,
      label: 'Profile',
      href: '/student/profile'
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/student/settings'
    }
  ];

  const handleNavigate = (href: string) => {
    navigate(href);
  };

  if (!user) return null;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background md:flex md:flex-col">
      <div className="flex h-14 items-center px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">CodeAcademy</span>
        </div>
      </div>
      <ScrollArea className="flex-1 py-2 px-4">
        <nav className="flex flex-col gap-6">
          <div>
            <h3 className="mb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Learning</h3>
            <div className="space-y-1">
              {courseItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-muted-foreground hover:text-foreground",
                    pathname === item.href && "bg-muted text-foreground"
                  )}
                  onClick={() => handleNavigate(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Community</h3>
            <div className="space-y-1">
              {communityItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-muted-foreground hover:text-foreground",
                    pathname === item.href && "bg-muted text-foreground"
                  )}
                  onClick={() => handleNavigate(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Tools</h3>
            <div className="space-y-1">
              {toolsItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-muted-foreground hover:text-foreground",
                    pathname === item.href && "bg-muted text-foreground"
                  )}
                  onClick={() => handleNavigate(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Account</h3>
            <div className="space-y-1">
              {accountItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-muted-foreground hover:text-foreground",
                    pathname === item.href && "bg-muted text-foreground"
                  )}
                  onClick={() => handleNavigate(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </nav>
      </ScrollArea>
    </aside>
  );
}
