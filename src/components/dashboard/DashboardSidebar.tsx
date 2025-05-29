
import {
  Database,
  GraduationCap,
  School,
  UserRound,
  Terminal,
  Code,
  Cpu,
  Bot
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
        return 'SYSTÈME_ADMIN';
      case 'teacher':
        return 'INSTRUCTEUR_IA';
      case 'student':
        return 'ACADÉMIE_TERMINAL';
      default:
        return 'INITIALISATION...';
    }
  };

  const getRoleSubtitle = () => {
    switch (userRole) {
      case 'admin':
        return '> controle.système.actif';
      case 'teacher':
        return '> module.enseignement.prêt';
      case 'student':
        return '> session.apprentissage.démarrée';
      default:
        return '> chargement.en.cours...';
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <Sidebar className="cyber-sidebar border-r-2 border-primary/30">
      <SidebarHeader className="border-b border-primary/20 p-4 relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent"></div>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg border border-primary/30 shadow-lg backdrop-blur-sm">
              <RoleIcon className="h-6 w-6 text-primary animate-cyber-pulse" />
            </div>
            {/* Robot assistant indicator */}
            <div className="absolute -top-1 -right-1 p-1 bg-accent rounded-full animate-cyber-pulse">
              <Bot className="h-3 w-3 text-white" />
            </div>
          </div>
          <div>
            <span className="font-cyber font-bold text-lg text-primary">{getRoleTitle()}</span>
            <div className="text-xs text-accent font-display">{getRoleSubtitle()}</div>
          </div>
        </div>
        
        {/* Scan line */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-data-stream"></div>
      </SidebarHeader>
      
      <SidebarContent className="cyber-sidebar">
        <SidebarMenu menuItems={getMenuItems()} />
      </SidebarContent>
      
      <SidebarFooter className="border-t border-primary/20 p-4 bg-gradient-to-t from-primary/5 to-transparent relative">
        <div className="text-xs text-muted-foreground font-display mb-2">
          // interface.contrôle.sidebar
        </div>
        <SidebarTrigger className="cyber-button w-full justify-center" />
        
        {/* Circuit pattern */}
        <div className="absolute top-0 left-0 w-full h-full circuit-pattern opacity-20 pointer-events-none"></div>
      </SidebarFooter>
    </Sidebar>
  );
};
