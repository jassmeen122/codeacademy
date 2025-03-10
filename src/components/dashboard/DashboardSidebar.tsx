
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
  Brain,
  Users,
  FilePlus,
  Gauge,
  School,
  CircuitBoard,
  Database,
  BookOpen,
  ClipboardList,
  BarChart,
  Bell,
  Video,
  FileText
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

interface DashboardSidebarProps {
  userRole: 'admin' | 'teacher' | 'student' | null;
}

const adminMenuItems = [
  {
    title: "Dashboard",
    icon: Gauge,
    href: "/admin",
  },
  {
    title: "User Management",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Course Management",
    icon: Book,
    href: "/admin/courses",
  },
  {
    title: "Exercises",
    icon: FileCode,
    href: "/admin/exercises",
  },
  {
    title: "Analytics",
    icon: Activity,
    href: "/admin/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

const teacherMenuItems = [
  {
    title: "Dashboard",
    icon: School,
    href: "/teacher",
  },
  {
    title: "My Courses",
    icon: BookOpen,
    href: "/teacher/courses",
  },
  {
    title: "Course Creator",
    icon: Book,
    href: "/teacher/courses/create",
  },
  {
    title: "Exercises",
    icon: ClipboardList,
    href: "/teacher/exercises",
  },
  {
    title: "Create Exercise",
    icon: FilePlus,
    href: "/teacher/exercises/create",
  },
  {
    title: "Student Progress",
    icon: BarChart,
    href: "/teacher/progress",
  },
  {
    title: "Discussion",
    icon: MessageSquare,
    href: "/teacher/discussion",
  },
  {
    title: "Materials",
    icon: FileText,
    href: "/teacher/materials",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/teacher/notifications",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/teacher/settings",
  },
];

const studentMenuItems = [
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

export const DashboardSidebar = ({ userRole }: DashboardSidebarProps) => {
  const location = useLocation();

  const getMenuItems = () => {
    switch (userRole) {
      case 'admin':
        return adminMenuItems;
      case 'teacher':
        return teacherMenuItems;
      case 'student':
        return studentMenuItems;
      default:
        return [];
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'admin':
        return Database;
      case 'teacher':
        return School;
      case 'student':
        return GraduationCap;
      default:
        return UserRound;
    }
  };

  const getRoleTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Admin Portal';
      case 'teacher':
        return 'Teacher Portal';
      case 'student':
        return 'Student Portal';
      default:
        return 'Loading...';
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <RoleIcon className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">{getRoleTitle()}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <nav className="space-y-1 p-2">
          {getMenuItems().map((item) => {
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
      <SidebarFooter className="border-t border-border p-4">
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
};
