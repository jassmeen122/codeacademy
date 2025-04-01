
import {
  Database,
  GraduationCap,
  School,
  UserRound,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { adminMenuItems } from "./sidebar/AdminMenuItems";
import { teacherMenuItems } from "./sidebar/TeacherMenuItems";
import { studentMenuItems } from "./sidebar/StudentMenuItems";
import { SidebarMenu } from "./sidebar/SidebarMenu";

interface DashboardSidebarProps {
  userRole: 'admin' | 'teacher' | 'student' | null;
}

export const DashboardSidebar = ({ userRole }: DashboardSidebarProps) => {
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
        <SidebarMenu menuItems={getMenuItems()} />
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4">
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
};
