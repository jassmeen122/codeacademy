
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  GraduationCap, 
  PenTool,
  MessageCircle,
  FolderKanban,
  BrainCircuit,
  TrendingUp,
  Trophy,
  User,
  Bell,
  Settings,
  YoutubeIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export const StudentSidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/student",
    },
    {
      title: "My Courses",
      icon: GraduationCap,
      href: "/student/courses",
    },
    {
      title: "Free Courses",
      icon: YoutubeIcon,
      href: "/student/free-courses",
    },
    {
      title: "Exercises",
      icon: PenTool,
      href: "/student/exercises",
    },
    {
      title: "Discussion",
      icon: MessageCircle,
      href: "/student/discussion",
    },
    {
      title: "Projects",
      icon: FolderKanban,
      href: "/student/projects",
    },
    {
      title: "AI Assistant",
      icon: BrainCircuit,
      href: "/student/ai-assistant",
    },
    {
      title: "My Progress",
      icon: TrendingUp,
      href: "/student/progress",
    },
    {
      title: "Achievements",
      icon: Trophy,
      href: "/student/achievements",
    },
    {
      title: "Profile",
      icon: User,
      href: "/student/profile",
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/student/notifications",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/student/settings",
    },
  ];

  return (
    <ScrollArea className="h-full py-6">
      <div className="px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.href}
              variant={isActive(item.href) ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive(item.href) ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
              )}
              asChild
            >
              <Link to={item.href}>
                <Icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
};
