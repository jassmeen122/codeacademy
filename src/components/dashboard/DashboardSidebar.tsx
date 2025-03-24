import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, BookOpen, FileText, Users, MessageSquare, 
  Code, Terminal, Brain, Award, BarChart2, Settings, 
  Bell, User, Calculator, FolderKanban, GraduationCap, School, Database, Activity, FileCode, FilePlus, Gauge, BookOpenCheck, ListChecks, Pencil, Gamepad2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const StudentNavItems = [
  {
    title: "Tableau de Bord",
    href: "/student",
    icon: Home,
  },
  {
    title: "Mes Cours",
    href: "/student/courses",
    icon: BookOpen,
  },
  {
    title: "Langages de Programmation",
    href: "/student/programming",
    icon: Code,
  },
  {
    title: "Exercices",
    href: "/student/exercises",
    icon: FileText,
  },
  {
    title: "Forum",
    href: "/student/discussion",
    icon: MessageSquare,
  },
  {
    title: "Projets",
    href: "/student/projects",
    icon: FolderKanban,
  },
  {
    title: "Éditeur de Code",
    href: "/student/code-editor",
    icon: Terminal,
  },
  {
    title: "Assistant IA",
    href: "/student/ai-assistant",
    icon: Brain,
  },
  {
    title: "Mini-Jeu",
    href: "/student/mini-game",
    icon: Calculator,
  },
  {
    title: "Progression",
    href: "/student/progress",
    icon: BarChart2,
  },
  {
    title: "Réussites",
    href: "/student/achievements",
    icon: Award,
  },
  {
    title: "Paramètres",
    href: "/student/settings",
    icon: Settings,
  },
];

export const TeacherNavItems = [
  {
    title: "Tableau de Bord",
    href: "/teacher",
    icon: Home,
  },
  {
    title: "Mes Cours",
    href: "/teacher/courses",
    icon: BookOpen,
  },
  {
    title: "Gestion des Langages",
    href: "/teacher/languages",
    icon: Code,
  },
  {
    title: "Exercices",
    href: "/teacher/exercises",
    icon: FileText,
  },
  {
    title: "Étudiants",
    href: "/teacher/students",
    icon: Users,
  },
  {
    title: "Messages",
    href: "/teacher/messages",
    icon: MessageSquare,
  },
  {
    title: "Paramètres",
    href: "/teacher/settings",
    icon: Settings,
  },
];

export const AdminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Gauge,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Course Management",
    href: "/admin/courses",
    icon: BookOpenCheck,
  },
  {
    title: "Exercises",
    href: "/admin/exercises",
    icon: ListChecks,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart2,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface DashboardSidebarProps {
  role?: 'student' | 'teacher' | 'admin';
}

export const DashboardSidebar = ({ role = 'student' }: DashboardSidebarProps) => {
  const location = useLocation();
  
  // Choose nav items based on role
  const navItems = 
    role === 'teacher' ? TeacherNavItems :
    role === 'admin' ? AdminNavItems :
    StudentNavItems;
  
  return (
    <aside className="hidden md:flex md:flex-col w-64 border-r bg-white">
      <div className="flex items-center justify-center h-14 border-b px-4">
        <Link to="/" className="flex items-center">
          <span className="font-bold text-xl">Code Academy</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="px-2 space-y-1">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
            
            return (
              <Link key={index} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${isActive ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            JS
          </div>
          <div>
            <p className="text-sm font-medium">John Smith</p>
            <p className="text-xs text-muted-foreground">{role === 'teacher' ? 'Professeur' : role === 'admin' ? 'Administrateur' : 'Étudiant'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
