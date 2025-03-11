
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, UserCog } from "lucide-react";
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

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar userRole={user?.role || null} />
        <div className="flex-1">
          <Navigation />
          <main className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Profile header section */}
            <div className="bg-background shadow-sm border-b border-border p-4">
              <div className="container mx-auto flex justify-between items-center">
                {loading ? (
                  <div className="animate-pulse flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                    <div>
                      <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-32"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary">
                      <AvatarImage src={user?.avatar_url || ''} alt={user?.full_name || 'User'} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-bold text-lg">{user?.full_name || 'User'}</h2>
                      <div className="flex flex-col sm:flex-row sm:gap-2 text-sm text-muted-foreground">
                        <span className="capitalize">{user?.role || 'Loading...'}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{user?.email || ''}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/${user?.role}/settings`)}
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
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
