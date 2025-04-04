
import {
  Book,
  Code,
  BookOpen,
  MessageSquare,
  Globe,
  FileCode,
  Terminal,
  Trophy,
  Star,
  Youtube,
  MessagesSquare,
  Briefcase,
  Users,
  Brain
} from "lucide-react";
import { SidebarItem } from "@/types/sidebar";

export const StudentMenuItems: SidebarItem[] = [
  {
    title: "Apprentissage",
    items: [
      {
        title: "Tableau de Bord",
        icon: Terminal,
        href: "/student",
        description: "Vue d'ensemble de votre parcours"
      },
      {
        title: "Cours",
        icon: Book,
        href: "/student/courses",
        description: "Parcourir et suivre des cours"
      },
      {
        title: "Cours Gratuits",
        icon: BookOpen,
        href: "/student/free-courses",
        description: "Cours gratuits populaires"
      },
      {
        title: "Exercices",
        icon: Code,
        href: "/student/exercises",
        description: "Exercices de programmation"
      },
      {
        title: "Éditeur de Code",
        icon: FileCode,
        href: "/student/code-editor",
        description: "Environnement de développement"
      },
      {
        title: "Parcours Étoilé",
        icon: Star,
        href: "/student/progress",
        description: "Suivi visuel de vos progrès"
      },
      {
        title: "Badges & Achievements",
        icon: Trophy,
        href: "/student/achievements",
        description: "Vos récompenses et objectifs"
      }
    ]
  },
  {
    title: "Ressources",
    items: [
      {
        title: "Tutoriels Vidéo",
        icon: Youtube,
        href: "/student/yt-dev-tutorials",
        description: "Tutoriels de développement"
      },
      {
        title: "IA Assistant",
        icon: Brain,
        href: "/student/ai-assistant",
        description: "Aide à l'apprentissage par IA"
      },
      {
        title: "Mini-Jeux",
        icon: Globe,
        href: "/student/mini-game",
        description: "Apprendre en s'amusant"
      }
    ]
  },
  {
    title: "Communauté",
    items: [
      {
        title: "Forum",
        icon: MessageSquare,
        href: "/student/discussion",
        description: "Poser vos questions"
      },
      {
        title: "Messagerie",
        icon: MessagesSquare,
        href: "/student/messages",
        description: "Messagerie privée"
      },
      {
        title: "Social",
        icon: Users,
        href: "/student/social",
        description: "Fil d'actualité social"
      },
      {
        title: "Stages",
        icon: Briefcase,
        href: "/student/internships",
        description: "Opportunités de stages"
      }
    ]
  }
];
