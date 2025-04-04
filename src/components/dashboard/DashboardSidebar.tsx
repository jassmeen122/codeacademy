
import {
  Database,
  GraduationCap,
  School,
  UserRound,
  Terminal,
  Code,
  Cpu
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
import { StudentMenuItems } from "./sidebar/StudentMenuItems";
import { SidebarMenu } from "./sidebar/SidebarMenu";
import { MenuItem } from "@/types/sidebar";

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
        return StudentMenuItems;
      default:
        return [];
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'admin':
        return Database;
      case 'teacher':
        return Code;
      case 'student':
        return Terminal;
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
    <Sidebar className="border-r border-gray-700 bg-gray-900">
      <SidebarHeader className="border-b border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-800 rounded-md">
            <RoleIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <span className="font-mono font-semibold text-lg">{getRoleTitle()}</span>
            <div className="text-xs text-gray-500 font-mono">{`> CodeAcademy`}</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-gray-900">
        <SidebarMenu menuItems={getMenuItems()} />
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-700 p-4 bg-gray-800">
        <div className="text-xs text-gray-500 font-mono mb-2">{`// Toggle sidebar`}</div>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
};
