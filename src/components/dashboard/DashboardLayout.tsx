
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, UserCog, Mail, User } from "lucide-react";
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
            {/* Enhanced Profile header section */}
            <div className="bg-background shadow-sm border-b border-border p-4">
              <div className="container mx-auto">
                {loading ? (
                  <div className="animate-pulse flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-300"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-48"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-primary">
                        <AvatarImage src={user?.avatar_url || ''} alt={user?.full_name || 'User'} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                          {getInitials(user?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-bold text-xl">{user?.full_name || 'User'}</h2>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <User className="h-3.5 w-3.5" />
                          <span className="capitalize text-sm">{user?.role || 'User'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
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
                        className="w-full sm:w-auto"
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
