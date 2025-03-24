
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
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
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
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={location.pathname === '/student' ? 'bg-secondary' : ''}
                  onClick={() => navigate('/student')}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={location.pathname === '/student/courses' ? 'bg-secondary' : ''}
                  onClick={() => navigate('/student/courses')}
                >
                  <Book className="h-4 w-4 mr-2" />
                  Mes Cours
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={location.pathname.includes('/student/languages') ? 'bg-secondary' : ''}
                  onClick={() => navigate('/student/languages')}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Langages de Programmation
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={location.pathname === '/student/exercises' ? 'bg-secondary' : ''}
                  onClick={() => navigate('/student/exercises')}
                >
                  <FileCode className="h-4 w-4 mr-2" />
                  Exercices
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={location.pathname === '/student/free-courses' ? 'bg-secondary' : ''}
                  onClick={() => navigate('/student/free-courses')}
                >
                  <Youtube className="h-4 w-4 mr-2" />
                  Cours Gratuits
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          
          <SidebarGroup>
            <div className="text-xs uppercase font-semibold mt-6 mb-2 text-muted-foreground">Outils</div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={location.pathname === '/student/editor' ? 'bg-secondary' : ''}
                  onClick={() => navigate('/student/editor')}
                >
                  <Terminal className="h-4 w-4 mr-2" />
                  Éditeur de Code
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={location.pathname === '/student/ai-assistant' ? 'bg-secondary' : ''}
                  onClick={() => navigate('/student/ai-assistant')}
                >
                  <MessagesSquare className="h-4 w-4 mr-2" />
                  Assistant AI
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={location.pathname === '/student/discussion' ? 'bg-secondary' : ''}
                  onClick={() => navigate('/student/discussion')}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Forum
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <div className="text-xs uppercase font-semibold mt-6 mb-2 text-muted-foreground">Mon Profil</div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={location.pathname === '/student/progress' ? 'bg-secondary' : ''}
                  onClick={() => navigate('/student/progress')}
                >
                  <LineChart className="h-4 w-4 mr-2" />
                  Progression
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={location.pathname === '/student/achievements' ? 'bg-secondary' : ''}
                  onClick={() => navigate('/student/achievements')}
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Récompenses
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={location.pathname === '/student/projects' ? 'bg-secondary' : ''}
                  onClick={() => navigate('/student/projects')}
                >
                  <FolderGit className="h-4 w-4 mr-2" />
                  Projets
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </ScrollArea>
      
      <SidebarFooter className="border-t mt-auto p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className={location.pathname === '/student/notifications' ? 'bg-secondary' : ''}
              onClick={() => navigate('/student/notifications')}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className={location.pathname === '/student/profile' ? 'bg-secondary' : ''}
              onClick={() => navigate('/student/profile')}
            >
              <User className="h-4 w-4 mr-2" />
              Mon Profil
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className={location.pathname === '/student/settings' ? 'bg-secondary' : ''}
              onClick={() => navigate('/student/settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
