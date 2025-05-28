
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Settings, 
  FileText,
  Building2,
  MessageSquare
} from "lucide-react";
import { MenuItem } from "@/types/sidebar";

export const adminMenuItems: MenuItem[] = [
  {
    title: "Gestion Utilisateurs",
    href: "/admin/users",
    icon: Users,
    description: "Gérer les utilisateurs et leurs rôles"
  },
  {
    title: "Gestion Cours",
    href: "/admin/courses",
    icon: BookOpen,
    description: "Administrer les cours et contenus"
  },
  {
    title: "Gestion Exercices",
    href: "/admin/exercises",
    icon: GraduationCap,
    description: "Superviser les exercices"
  },
  {
    title: "Gestion Posts",
    href: "/admin/posts",
    icon: FileText,
    description: "Modérer les publications"
  },
  {
    title: "Gestion Stages",
    href: "/admin/internships",
    icon: Building2,
    description: "Administrer les offres de stage"
  },
  {
    title: "Messages Privés",
    href: "/admin/private-messages",
    icon: MessageSquare,
    description: "Messages privés avec les utilisateurs"
  },
  {
    title: "Paramètres",
    href: "/admin/settings",
    icon: Settings,
    description: "Configuration système"
  }
];
