
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
        return 'ADMIN_PORTAL';
      case 'teacher':
        return 'TEACHER_INTERFACE';
      case 'student':
        return 'STUDENT_TERMINAL';
      default:
        return 'LOADING...';
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <Sidebar className="cyber-sidebar">
      <SidebarHeader className="border-b border-neon-blue/20 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black/60 rounded-md border border-neon-blue/30 shadow-cyber-sm">
            <RoleIcon className="h-6 w-6 text-neon-blue animate-cyber-glow" />
          </div>
          <div>
            <span className="font-mono font-bold text-lg text-cyber-gradient typewriter">{getRoleTitle()}</span>
            <div className="text-xs text-neon-green font-mono terminal-text">{`> system.initialized`}</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="cyber-sidebar">
        <SidebarMenu menuItems={getMenuItems()} />
      </SidebarContent>
      <SidebarFooter className="border-t border-neon-blue/20 p-4 bg-black/40">
        <div className="text-xs text-muted-foreground font-mono mb-2 terminal-text">{`// toggle_sidebar()`}</div>
        <SidebarTrigger className="cyber-button" />
      </SidebarFooter>
    </Sidebar>
  );
};
