
import {
  Book,
  Code,
  GraduationCap,
  Layout,
  MessageSquare,
  Settings,
  Trophy,
  UserRound,
  Activity,
  FileCode,
  Brain
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Profile",
    icon: UserRound,
    href: "/student/profile",
  },
  {
    title: "My Courses",
    icon: Book,
    href: "/student/courses",
  },
  {
    title: "Code Editor",
    icon: Code,
    href: "/student/code-editor",
  },
  {
    title: "AI Assistant",
    icon: Brain,
    href: "/student/ai-assistant",
  },
  {
    title: "Exercises",
    icon: FileCode,
    href: "/student/exercises",
  },
  {
    title: "Projects",
    icon: Layout,
    href: "/student/projects",
  },
  {
    title: "Progress",
    icon: Activity,
    href: "/student/progress",
  },
  {
    title: "Achievements",
    icon: Trophy,
    href: "/student/achievements",
  },
  {
    title: "Discussion",
    icon: MessageSquare,
    href: "/student/discussion",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/student/settings",
  },
];

export const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">Student Portal</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <nav className="space-y-1 p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </nav>
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-200 p-4">
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
};
