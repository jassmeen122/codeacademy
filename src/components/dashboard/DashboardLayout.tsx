
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { UserAvatar } from "@/components/UserAvatar";
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
      toast.success('Session terminée avec succès');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la déconnexion');
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <DashboardSidebar userRole={user?.role || null} />
        <div className="flex-1">
          <Navigation />
          <main className="pt-16 min-h-screen">
            {/* Profile header section with clean design */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="container mx-auto">
                {loading ? (
                  <div className="animate-pulse flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-48"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <UserAvatar user={user} size="lg" />
                      <div>
                        <h2 className="text-xl font-semibold text-black mb-1">
                          {user?.full_name || 'Utilisateur'}
                        </h2>
                        <div className="flex items-center gap-2 text-blue-500 mb-1">
                          <User className="h-4 w-4" />
                          <span className="capitalize text-sm font-medium">
                            {user?.role === 'admin' && 'Administrateur'}
                            {user?.role === 'teacher' && 'Professeur'}
                            {user?.role === 'student' && 'Étudiant'}
                            {!user?.role && 'Utilisateur'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{user?.email || ''}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/${user?.role}/settings`)}
                      >
                        <UserCog className="mr-2 h-4 w-4" />
                        Paramètres
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Déconnexion
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
