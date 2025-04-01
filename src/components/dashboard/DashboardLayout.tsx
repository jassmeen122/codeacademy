
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { LogOut, UserCog, Mail, User, Terminal, Code, Database } from "lucide-react";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, loading, handleSignOut } = useAuthState();
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

  const handleLogout = async () => {
    try {
      await handleSignOut();
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-900 text-white">
        <DashboardSidebar userRole={user?.role || null} />
        <div className="flex-1">
          <Navigation />
          <main className="pt-16 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Enhanced Profile header section */}
            <div className="bg-gray-800 shadow-md border-b border-gray-700 p-4">
              <div className="container mx-auto">
                {loading ? (
                  <div className="animate-pulse flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-700"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-700 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-48"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <UserAvatar user={user} size="lg" />
                      <div>
                        <h2 className="font-bold text-xl">{user?.full_name || 'User'}</h2>
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                          <User className="h-3.5 w-3.5" />
                          <span className="capitalize text-sm">{user?.role || 'User'}</span>
                          {user?.role === 'admin' && <Database className="h-3.5 w-3.5 ml-2" />}
                          {user?.role === 'teacher' && <Code className="h-3.5 w-3.5 ml-2" />}
                          {user?.role === 'student' && <Terminal className="h-3.5 w-3.5 ml-2" />}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="text-sm">{user?.email || ''}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 sm:mt-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/${user?.role}/settings`)}
                        className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <UserCog className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleLogout}
                        className="w-full sm:w-auto"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="container mx-auto py-6 px-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
