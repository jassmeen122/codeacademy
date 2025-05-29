
import { useState } from "react";
import { Menu, X, Moon, Sun, User, Youtube, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { NotificationBell } from "./navigation/NotificationBell";
import { MobileMenu } from "./navigation/MobileMenu";
import { useAuthState } from "@/hooks/useAuthState";
import { UserAvatar } from "./UserAvatar";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { session, user, loading, handleSignOut } = useAuthState();

  useState(() => {
    setMounted(true);
  });

  const handleAuth = () => {
    if (session) {
      handleSignOut().then(() => {
        toast.success('Déconnecté avec succès');
      }).catch((error: any) => {
        toast.error(error.message || 'Erreur lors de la déconnexion');
      });
    } else {
      navigate("/auth");
    }
  };

  const goToUserDashboard = () => {
    if (!user) return;
    
    switch (user.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'teacher':
        navigate('/teacher');
        break;
      case 'student':
        navigate('/student');
        break;
      default:
        navigate('/');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed top-0 z-50 w-full backdrop-blur-lg bg-background/95 border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo et Brand */}
          <div className="flex-shrink-0 flex items-center gap-6">
            <Link 
              to="/" 
              className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
            >
              CodeAcademy
            </Link>
            
            {/* Theme Toggle avec animation améliorée */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full hover:bg-accent/10 transition-all duration-300 group"
            >
              <div className="relative w-5 h-5">
                <Sun className="h-5 w-5 absolute inset-0 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
                <Moon className="h-5 w-5 absolute inset-0 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
              </div>
              <span className="sr-only">Changer le thème</span>
            </Button>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Section Découvrir pour les étudiants */}
            {!loading && session && user?.role === 'student' && (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-all duration-300 group"
                  onClick={() => navigate('/student/yt-dev-tutorials')}
                >
                  <Youtube className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Tutoriels Dev</span>
                </Button>
                
                <div className="w-px h-6 bg-border"></div>
              </div>
            )}

            {/* Section Mon Espace */}
            {!loading && session && (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  className="gap-2 text-primary hover:text-primary/80 hover:bg-primary/10 transition-all duration-300 group"
                  onClick={goToUserDashboard}
                >
                  <User className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Mon Profil</span>
                </Button>

                {/* Portal Access pour les enseignants/admins */}
                {user && (user.role === 'teacher' || user.role === 'admin') && (
                  <Button
                    variant="outline"
                    className="border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50 transition-all duration-300"
                    onClick={() => navigate(user.role === 'admin' ? '/admin' : '/teacher')}
                  >
                    <span className="font-medium">
                      {user.role === 'admin' ? 'Admin Portal' : 'Teacher Portal'}
                    </span>
                  </Button>
                )}

                <div className="w-px h-6 bg-border"></div>
              </div>
            )}

            {/* Section Profil Utilisateur */}
            {!loading && session && (
              <div className="flex items-center gap-4">
                <div className="text-right hidden lg:block">
                  <p className="font-semibold text-sm text-foreground leading-none">
                    {user?.full_name || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize mt-1">
                    {user?.role || 'Chargement...'}
                  </p>
                </div>
                
                <div className="relative group">
                  <UserAvatar user={user} size="md" className="ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-300" />
                </div>
                
                <NotificationBell userId={session.user.id} />
              </div>
            )}

            {/* Action Button */}
            {!loading && (
              <Button
                variant={session ? "destructive" : "default"}
                onClick={handleAuth}
                className="font-medium px-6 hover:scale-105 transition-all duration-200 shadow-sm"
              >
                {session ? "Se Déconnecter" : "Se Connecter"}
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {!loading && session && (
              <NotificationBell userId={session.user.id} />
            )}
            <Button
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-accent/10 transition-all duration-300"
            >
              <div className="relative w-6 h-6">
                <Menu className={`h-6 w-6 absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`} />
                <X className={`h-6 w-6 absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`} />
              </div>
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          </div>
        </div>

        <MobileMenu 
          isOpen={isOpen}
          session={session}
          loading={loading}
          onAuth={handleAuth}
          userRole={user?.role}
          onPortalClick={goToUserDashboard}
          user={user}
        />
      </div>
    </nav>
  );
};

export default Navigation;
