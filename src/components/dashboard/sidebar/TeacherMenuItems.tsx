
import { 
  BookOpen, 
  PlusCircle, 
  FileEdit, 
  Settings,
  MessageSquare,
  Users
} from "lucide-react";
import { MenuItem } from "@/types/sidebar";

export const teacherMenuItems: MenuItem[] = [
  {
    title: "Mes Cours",
    href: "/teacher/courses",
    icon: BookOpen,
    description: "Gérer vos cours existants"
  },
  {
    title: "Créer un Cours",
    href: "/teacher/courses/create",
    icon: PlusCircle,
    description: "Créer un nouveau cours"
  },
  {
    title: "Mes Exercices",
    href: "/teacher/exercises",
    icon: FileEdit,
    description: "Gérer vos exercices"
  },
  {
    title: "Feed Social",
    href: "/teacher/social",
    icon: Users,
    description: "Voir et partager avec la communauté"
  },
  {
    title: "Messages Privés",
    href: "/teacher/private-messages",
    icon: MessageSquare,
    description: "Messages privés avec les étudiants"
  },
  {
    title: "Paramètres",
    href: "/teacher/settings",
    icon: Settings,
    description: "Paramètres du compte"
  }
];
