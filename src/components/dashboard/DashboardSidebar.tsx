import React, { useState, useEffect } from "react";
import {
  Home,
  BookOpen,
  GraduationCap,
  Users,
  Settings,
  LayoutDashboard,
  ListChecks,
  Languages,
  LucideIcon,
  Plus,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/useMobile";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  exact?: boolean;
}

const NavItem = ({ icon: Icon, label, to, exact }: NavItemProps) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      className={cn(
        "group relative flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground focus:bg-secondary focus:text-secondary-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        isActive
          ? "bg-secondary text-secondary-foreground"
          : "text-muted-foreground"
      )}
    >
      <Icon className="mr-2.5 h-4 w-4" />
      <span>{label}</span>
    </NavLink>
  );
};

interface DashboardSidebarProps {
  role: 'student' | 'teacher' | 'admin';
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<string>("");

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  const isMobile = useMobile();

  return (
    <div className="flex h-full select-none flex-col gap-2 py-4">
      <div className="px-3 py-2">
        <NavLink
          to="/"
          className="mb-2 flex items-center gap-2 font-semibold text-lg"
        >
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span>CodeAcademy</span>
        </NavLink>
        <Accordion type="single" collapsible className="w-full">
          <NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" exact />

          {role === "student" && (
            <>
              <NavItem icon={Languages} label="Languages" to="/student/languages" />
              <NavItem icon={BookOpen} label="My Courses" to="/student/courses" />
              <NavItem icon={GraduationCap} label="My Learning Path" to="/student/learning-path" />
              <NavItem icon={ListChecks} label="My Exercises" to="/student/exercises" />
            </>
          )}

          {role === "teacher" && (
            <>
              <NavItem icon={Languages} label="Languages" to="/teacher/languages" />
              <AccordionItem value="courses">
                <AccordionTrigger className="data-[state=open]:bg-secondary hover:bg-secondary hover:text-secondary-foreground focus:bg-secondary focus:text-secondary-foreground focus:outline-none">
                  <BookOpen className="mr-2.5 h-4 w-4" />
                  <span>Courses</span>
                </AccordionTrigger>
                <AccordionContent>
                  <NavItem icon={Plus} label="Create Course" to="/teacher/courses/create" />
                  <NavItem icon={BookOpen} label="Manage Courses" to="/teacher/courses" />
                </AccordionContent>
              </AccordionItem>
              <NavItem icon={ListChecks} label="Exercises" to="/teacher/exercises" />
            </>
          )}

          {role === "admin" && (
            <>
              <NavItem icon={Users} label="Manage Users" to="/admin/users" />
              <NavItem icon={Settings} label="Settings" to="/admin/settings" />
            </>
          )}
        </Accordion>
      </div>
    </div>
  );
}
