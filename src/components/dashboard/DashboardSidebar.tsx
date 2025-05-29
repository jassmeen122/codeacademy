
import {
  Database,
  GraduationCap,
  School,
  UserRound,
  Settings,
  BookOpen,
  Users
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
        return BookOpen;
      case 'student':
        return GraduationCap;
      default:
        return UserRound;
    }
  };

  const getRoleTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Administration';
      case 'teacher':
        return 'Espace Professeur';
      case 'student':
        return 'Espace Étudiant';
      default:
        return 'Chargement...';
    }
  };

  const getRoleSubtitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Gestion de la plateforme';
      case 'teacher':
        return 'Création et gestion des cours';
      case 'student':
        return 'Apprentissage et progression';
      default:
        return 'Connexion en cours...';
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500 rounded-lg">
            <RoleIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-black">{getRoleTitle()}</h2>
            <p className="text-sm text-gray-600">{getRoleSubtitle()}</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-white">
        <SidebarMenu menuItems={getMenuItems()} />
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-200 p-4 bg-white">
        <div className="text-xs text-gray-500 mb-2">
          Interface de contrôle
        </div>
        <SidebarTrigger className="w-full justify-center bg-black text-white hover:bg-gray-800" />
      </SidebarFooter>
    </Sidebar>
  );
};
