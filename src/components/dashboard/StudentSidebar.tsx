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
import { Sidebar, SidebarHeader, SidebarItem, SidebarSection } from "@/components/ui/sidebar";
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
        <SidebarSection>
          <SidebarItem 
            icon={<LayoutDashboard className="h-4 w-4" />} 
            title="Dashboard"
            isActive={location.pathname === '/student'}
            onClick={() => navigate('/student')}
          />
          <SidebarItem 
            icon={<Book className="h-4 w-4" />} 
            title="Mes Cours"
            isActive={location.pathname === '/student/courses'}
            onClick={() => navigate('/student/courses')}
          />
          <SidebarItem 
            icon={<Code className="h-4 w-4" />} 
            title="Langages de Programmation" 
            isActive={location.pathname.includes('/student/languages')}
            onClick={() => navigate('/student/languages')}
          />
          <SidebarItem 
            icon={<FileCode className="h-4 w-4" />} 
            title="Exercices" 
            isActive={location.pathname === '/student/exercises'}
            onClick={() => navigate('/student/exercises')}
          />
          <SidebarItem 
            icon={<Youtube className="h-4 w-4" />} 
            title="Cours Gratuits" 
            isActive={location.pathname === '/student/free-courses'}
            onClick={() => navigate('/student/free-courses')}
          />
        </SidebarSection>
        
        <SidebarSection title="Outils">
          <SidebarItem 
            icon={<Terminal className="h-4 w-4" />} 
            title="Éditeur de Code" 
            isActive={location.pathname === '/student/editor'}
            onClick={() => navigate('/student/editor')}
          />
          <SidebarItem 
            icon={<MessagesSquare className="h-4 w-4" />} 
            title="Assistant AI" 
            isActive={location.pathname === '/student/ai-assistant'}
            onClick={() => navigate('/student/ai-assistant')}
          />
          <SidebarItem 
            icon={<MessageCircle className="h-4 w-4" />} 
            title="Forum" 
            isActive={location.pathname === '/student/discussion'}
            onClick={() => navigate('/student/discussion')}
          />
        </SidebarSection>

        <SidebarSection title="Mon Profil">
          <SidebarItem 
            icon={<LineChart className="h-4 w-4" />} 
            title="Progression" 
            isActive={location.pathname === '/student/progress'}
            onClick={() => navigate('/student/progress')}
          />
          <SidebarItem 
            icon={<Trophy className="h-4 w-4" />} 
            title="Récompenses" 
            isActive={location.pathname === '/student/achievements'}
            onClick={() => navigate('/student/achievements')}
          />
          <SidebarItem 
            icon={<FolderGit className="h-4 w-4" />} 
            title="Projets" 
            isActive={location.pathname === '/student/projects'}
            onClick={() => navigate('/student/projects')}
          />
        </SidebarSection>
      </ScrollArea>
      
      <SidebarSection className="border-t mt-auto p-4">
        <SidebarItem 
          icon={<Bell className="h-4 w-4" />} 
          title="Notifications" 
          isActive={location.pathname === '/student/notifications'}
          onClick={() => navigate('/student/notifications')}
        />
        <SidebarItem 
          icon={<User className="h-4 w-4" />} 
          title="Mon Profil" 
          isActive={location.pathname === '/student/profile'}
          onClick={() => navigate('/student/profile')}
        />
        <SidebarItem 
          icon={<Settings className="h-4 w-4" />} 
          title="Paramètres" 
          isActive={location.pathname === '/student/settings'}
          onClick={() => navigate('/student/settings')}
        />
      </SidebarSection>
    </Sidebar>
  );
};
