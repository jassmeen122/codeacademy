
import { 
  BookOpen, 
  PlusCircle, 
  FileEdit, 
  Settings,
  MessageSquare
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
    href: "/teacher/create-course",
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
