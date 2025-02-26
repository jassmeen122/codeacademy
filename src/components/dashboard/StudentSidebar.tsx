
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Code,
  Trophy,
  MessageSquare,
  Bell,
  Settings,
  Folder,
  UserCircle,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: BookOpen,
    href: "/student",
  },
  {
    title: "Profile",
    icon: UserCircle,
    href: "/student/profile",
  },
  {
    title: "Projects",
    icon: Folder,
    href: "/student/projects",
  },
  {
    title: "Code Editor",
    icon: Code,
    href: "/student/code-editor",
  },
  {
    title: "Achievements",
    icon: Trophy,
    href: "/student/achievements",
  },
  {
    title: "Discussion",
    icon: MessageSquare,
    href: "/student/discussion",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/student/notifications",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/student/settings",
  },
];

export function StudentSidebar() {
  const location = useLocation();

  return (
    <nav className="space-y-2">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
            location.pathname === item.href &&
              "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
