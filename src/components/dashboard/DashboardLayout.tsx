
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { LogOut, UserCog, Mail, User, Terminal, Code, Database, Bot } from "lucide-react";
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
      <div className="min-h-screen flex w-full cyber-grid">
        {/* Background effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-background via-muted/50 to-background pointer-events-none"></div>
        <div className="fixed inset-0 circuit-pattern opacity-10 pointer-events-none"></div>
        
        <DashboardSidebar userRole={user?.role || null} />
        <div className="flex-1 relative z-10">
          <Navigation />
          <main className="pt-16 min-h-screen">
            {/* Enhanced Profile header section with futuristic design */}
            <div className="cyber-nav shadow-xl border-b border-primary/30 p-4 relative overflow-hidden">
              {/* Animated background effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 animate-circuit-glow"></div>
              
              <div className="container mx-auto relative z-10">
                {loading ? (
                  <div className="animate-pulse flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 cyber-glow"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-primary/20 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-primary/20 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-primary/20 rounded w-48"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <UserAvatar user={user} size="lg" />
                        <div className="absolute -bottom-1 -right-1 p-1 bg-primary rounded-full animate-cyber-pulse">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <h2 className="font-cyber text-xl text-foreground mb-1">
                          {user?.full_name || 'Apprenant du Futur'}
                        </h2>
                        <div className="flex items-center gap-2 text-primary mb-1">
                          <User className="h-3.5 w-3.5" />
                          <span className="capitalize text-sm font-cyber">
                            {user?.role === 'admin' && 'Administrateur Système'}
                            {user?.role === 'teacher' && 'Instructeur IA'}
                            {user?.role === 'student' && 'Cadet de l\'Académie'}
                            {!user?.role && 'Utilisateur'}
                          </span>
                          {user?.role === 'admin' && <Database className="h-3.5 w-3.5 ml-2 text-accent animate-cyber-pulse" />}
                          {user?.role === 'teacher' && <Code className="h-3.5 w-3.5 ml-2 text-accent animate-cyber-pulse" />}
                          {user?.role === 'student' && <Terminal className="h-3.5 w-3.5 ml-2 text-accent animate-cyber-pulse" />}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="text-sm font-body">{user?.email || ''}</span>
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
                        Configurer Profil
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleLogout}
                        className="w-full sm:w-auto"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Déconnexion
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Scan line effect */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-data-stream"></div>
            </div>
            
            <div className="container mx-auto py-6 px-4 relative z-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
