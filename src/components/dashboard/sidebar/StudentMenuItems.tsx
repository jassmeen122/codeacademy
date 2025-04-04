
import { 
  LayoutDashboard, 
  BookOpen, 
  Code, 
  TestTube2, 
  Users2, 
  Award, 
  BrainCircuit, 
  Settings, 
  MessagesSquare, 
  BriefcaseBusiness, 
  LineChart,
  Star 
} from 'lucide-react';
import { MenuItem } from "@/types/sidebar";

export const StudentMenuItems: MenuItem[] = [
  {
    title: 'Tableau de bord',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: '/student',
    items: []
  },
  {
    title: 'Cours',
    icon: <BookOpen className="h-5 w-5" />,
    href: '/student/courses',
    items: []
  },
  {
    title: 'Cours Gratuits',
    icon: <BookOpen className="h-5 w-5" />,
    href: '/student/free-courses',
    items: []
  },
  {
    title: 'Exercices',
    icon: <TestTube2 className="h-5 w-5" />,
    href: '/student/exercises',
    items: []
  },
  {
    title: 'Discussions',
    icon: <Users2 className="h-5 w-5" />,
    href: '/student/discussion',
    items: []
  },
  {
    title: 'Editor de Code',
    icon: <Code className="h-5 w-5" />,
    href: '/student/code-editor',
    items: []
  },
  {
    title: 'IA Assistant',
    icon: <BrainCircuit className="h-5 w-5" />,
    href: '/student/ai-assistant',
    items: []
  },
  {
    title: 'Progrès',
    icon: <LineChart className="h-5 w-5" />,
    href: '/student/progress',
    items: []
  },
  {
    title: 'Progrès Étoiles',
    icon: <Star className="h-5 w-5" />,
    href: '/student/simple-progress',
    items: []
  },
  {
    title: 'Réalisations',
    icon: <Award className="h-5 w-5" />,
    href: '/student/achievements',
    items: []
  },
  {
    title: 'Messages',
    icon: <MessagesSquare className="h-5 w-5" />,
    href: '/student/messages',
    items: []
  },
  {
    title: 'Stages',
    icon: <BriefcaseBusiness className="h-5 w-5" />,
    href: '/student/internships',
    items: []
  },
  {
    title: 'Paramètres',
    icon: <Settings className="h-5 w-5" />,
    href: '/student/settings',
    items: []
  }
];
