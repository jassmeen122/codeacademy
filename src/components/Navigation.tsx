
import { useState } from "react";
import { Menu, X, User, Youtube, ChevronDown, BookOpen, GraduationCap, Video } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { NotificationBell } from "./navigation/NotificationBell";
import { MobileMenu } from "./navigation/MobileMenu";
import { useAuthState } from "@/hooks/useAuthState";
import { UserAvatar } from "./UserAvatar";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { session, user, loading, handleSignOut } = useAuthState();

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

  const goToMeet = () => {
    if (!user) return;
    
    switch (user.role) {
      case 'admin':
        navigate('/admin/private-messages');
        break;
      case 'teacher':
        navigate('/teacher/private-messages');
        break;
      case 'student':
        navigate('/student/private-messages');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full edu-nav">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo et Brand */}
          <div className="flex-shrink-0 flex items-center gap-6">
            <Link 
              to="/" 
              className="text-2xl font-bold font-heading bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 flex items-center gap-2"
            >
              <GraduationCap className="h-8 w-8 text-primary" />
              CodeAcademy
            </Link>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Section Découvrir pour les étudiants */}
            {!loading && session && user?.role === 'student' && (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  className="gap-2 text-warning hover:text-warning/80 hover:bg-warning/10 transition-all duration-300 group"
                  onClick={() => navigate('/student/yt-dev-tutorials')}
                >
                  <Youtube className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Tutoriels Dev</span>
                </Button>
                
                <Button
                  variant="ghost"
                  className="gap-2 text-accent hover:text-accent/80 hover:bg-accent/10 transition-all duration-300 group"
                  onClick={() => navigate('/student/courses')}
                >
                  <BookOpen className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Mes Cours</span>
                </Button>
                
                <div className="w-px h-6 bg-border/50"></div>
              </div>
            )}

            {/* Section Meet pour tous les utilisateurs connectés */}
            {!loading && session && user && (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  className="gap-2 text-info hover:text-info/80 hover:bg-info/10 transition-all duration-300 group"
                  onClick={goToMeet}
                >
                  <Video className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Meet</span>
                </Button>
                
                <div className="w-px h-6 bg-border/50"></div>
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
                  <span className="font-medium">Mon Tableau de Bord</span>
                </Button>

                {/* Portal Access pour les enseignants/admins */}
                {user && (user.role === 'teacher' || user.role === 'admin') && (
                  <Button
                    variant="accent"
                    onClick={() => navigate(user.role === 'admin' ? '/admin' : '/teacher')}
                  >
                    <span className="font-medium">
                      {user.role === 'admin' ? 'Administration' : 'Espace Enseignant'}
                    </span>
                  </Button>
                )}

                <div className="w-px h-6 bg-border/50"></div>
              </div>
            )}

            {/* Section Profil Utilisateur */}
            {!loading && session && (
              <div className="flex items-center gap-4">
                <div className="text-right hidden lg:block">
                  <p className="font-semibold text-sm text-foreground leading-none font-heading">
                    {user?.full_name || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize mt-1">
                    {user?.role === 'student' ? 'Étudiant' : 
                     user?.role === 'teacher' ? 'Enseignant' : 
                     user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </p>
                </div>
                
                <div className="relative group">
                  <UserAvatar 
                    user={user} 
                    size="md" 
                    className="ring-2 ring-transparent group-hover:ring-accent/50 transition-all duration-300 hover:scale-105" 
                  />
                </div>
                
                <NotificationBell userId={session.user.id} />
              </div>
            )}

            {/* Action Button */}
            {!loading && (
              <Button
                variant={session ? "destructive" : "default"}
                onClick={handleAuth}
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
              className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-primary/10 transition-all duration-300"
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
