
import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Book,
  FileCode,
  Youtube,
  Terminal,
  MessagesSquare,
  MessageCircle,
  LineChart,
  Trophy,
  FolderGit,
  Bell,
  User,
  Settings,
  GraduationCap,
  Code,
} from "lucide-react";
import { Sidebar, SidebarHeader, SidebarNav, SidebarNavItem, SidebarFooter, SidebarMenuSection } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-5 flex items-center">
        <Link to="/student" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">CodeAcademy</span>
        </Link>
      </SidebarHeader>
      
      <ScrollArea className="flex-1 px-4">
        <SidebarNav>
          <SidebarMenuSection>
            <SidebarNavItem 
              icon={<LayoutDashboard className="h-4 w-4" />} 
              title="Dashboard"
              isActive={location.pathname === '/student'}
              onClick={() => navigate('/student')}
            />
            <SidebarNavItem 
              icon={<Book className="h-4 w-4" />} 
              title="Mes Cours"
              isActive={location.pathname === '/student/courses'}
              onClick={() => navigate('/student/courses')}
            />
            <SidebarNavItem 
              icon={<Code className="h-4 w-4" />} 
              title="Langages de Programmation" 
              isActive={location.pathname.includes('/student/languages')}
              onClick={() => navigate('/student/languages')}
            />
            <SidebarNavItem 
              icon={<FileCode className="h-4 w-4" />} 
              title="Exercices" 
              isActive={location.pathname === '/student/exercises'}
              onClick={() => navigate('/student/exercises')}
            />
            <SidebarNavItem 
              icon={<Youtube className="h-4 w-4" />} 
              title="Cours Gratuits" 
              isActive={location.pathname === '/student/free-courses'}
              onClick={() => navigate('/student/free-courses')}
            />
          </SidebarMenuSection>
          
          <SidebarMenuSection title="Outils">
            <SidebarNavItem 
              icon={<Terminal className="h-4 w-4" />} 
              title="Éditeur de Code" 
              isActive={location.pathname === '/student/editor'}
              onClick={() => navigate('/student/editor')}
            />
            <SidebarNavItem 
              icon={<MessagesSquare className="h-4 w-4" />} 
              title="Assistant AI" 
              isActive={location.pathname === '/student/ai-assistant'}
              onClick={() => navigate('/student/ai-assistant')}
            />
            <SidebarNavItem 
              icon={<MessageCircle className="h-4 w-4" />} 
              title="Forum" 
              isActive={location.pathname === '/student/discussion'}
              onClick={() => navigate('/student/discussion')}
            />
          </SidebarMenuSection>

          <SidebarMenuSection title="Mon Profil">
            <SidebarNavItem 
              icon={<LineChart className="h-4 w-4" />} 
              title="Progression" 
              isActive={location.pathname === '/student/progress'}
              onClick={() => navigate('/student/progress')}
            />
            <SidebarNavItem 
              icon={<Trophy className="h-4 w-4" />} 
              title="Récompenses" 
              isActive={location.pathname === '/student/achievements'}
              onClick={() => navigate('/student/achievements')}
            />
            <SidebarNavItem 
              icon={<FolderGit className="h-4 w-4" />} 
              title="Projets" 
              isActive={location.pathname === '/student/projects'}
              onClick={() => navigate('/student/projects')}
            />
          </SidebarMenuSection>
        </SidebarNav>
      </ScrollArea>
      
      <SidebarFooter className="border-t mt-auto p-4">
        <SidebarNavItem 
          icon={<Bell className="h-4 w-4" />} 
          title="Notifications" 
          isActive={location.pathname === '/student/notifications'}
          onClick={() => navigate('/student/notifications')}
        />
        <SidebarNavItem 
          icon={<User className="h-4 w-4" />} 
          title="Mon Profil" 
          isActive={location.pathname === '/student/profile'}
          onClick={() => navigate('/student/profile')}
        />
        <SidebarNavItem 
          icon={<Settings className="h-4 w-4" />} 
          title="Paramètres" 
          isActive={location.pathname === '/student/settings'}
          onClick={() => navigate('/student/settings')}
        />
      </SidebarFooter>
    </Sidebar>
  );
};
