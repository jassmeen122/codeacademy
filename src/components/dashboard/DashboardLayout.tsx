
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [userRole, setUserRole] = useState<'admin' | 'teacher' | 'student' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserRole(profile.role);
        // Redirect users to their appropriate dashboard if they're on the wrong one
        const currentPath = window.location.pathname;
        const correctPath = `/${profile.role.toLowerCase()}`;
        if (!currentPath.startsWith(correctPath)) {
          navigate(correctPath);
        }
      }
    };

    checkUserRole();
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar userRole={userRole} />
        <div className="flex-1">
          <Navigation />
          <main className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
