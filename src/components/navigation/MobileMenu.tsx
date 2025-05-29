
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserAvatar } from "@/components/UserAvatar";
import { UserProfile } from "@/hooks/useAuthState";
import { User, Youtube, Settings, LogOut, ChevronRight, BookOpen, GraduationCap } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  session: any;
  loading: boolean;
  onAuth: () => void;
  userRole?: string;
  onPortalClick?: () => void;
  user: UserProfile | null;
}

export const MobileMenu = ({ 
  isOpen, 
  session, 
  loading, 
  onAuth,
  userRole,
  onPortalClick,
  user
}: MobileMenuProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg">
      <div className="px-4 py-6 space-y-6">
        {/* Profil utilisateur */}
        {!loading && session && user && (
          <div className="education-card p-4">
            <div className="flex items-center gap-4">
              <UserAvatar user={user} size="md" />
              <div className="flex-1">
                <p className="font-semibold text-foreground">{user?.full_name || 'Utilisateur'}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {user?.role === 'student' ? 'Étudiant' : 
                   user?.role === 'teacher' ? 'Enseignant' : 
                   user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        )}
        
        {/* Navigation Links */}
        <div className="space-y-3">
          <Link
            to="/"
            className="flex items-center gap-3 p-3 rounded-lg text-foreground hover:bg-primary/10 transition-all duration-300 group"
          >
            <GraduationCap className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Accueil</span>
          </Link>
          
          {/* Tutoriels pour les étudiants */}
          {!loading && session && userRole === 'student' && (
            <>
              <Link
                to="/student/yt-dev-tutorials"
                className="flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
              >
                <Youtube className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Tutoriels Dev</span>
              </Link>
              
              <Link
                to="/student/courses"
                className="flex items-center gap-3 p-3 rounded-lg text-accent hover:bg-accent/10 transition-all duration-300 group"
              >
                <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Mes Cours</span>
              </Link>
            </>
          )}
        </div>
        
        {/* Actions */}
        <div className="space-y-3 pt-4 border-t border-border/30">
          {/* Portal Access */}
          {!loading && session && (userRole === 'teacher' || userRole === 'admin') && (
            <Button
              className="w-full justify-start gap-3 education-button-secondary"
              onClick={onPortalClick}
            >
              <Settings className="h-5 w-5" />
              {userRole === 'admin' ? 'Administration' : 'Espace Enseignant'}
            </Button>
          )}
          
          {/* Mon Profil */}
          {!loading && session && (
            <Button
              className="w-full justify-start gap-3 border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
              variant="outline"
              onClick={onPortalClick}
            >
              <User className="h-5 w-5" />
              Mon Tableau de Bord
            </Button>
          )}
          
          {/* Connexion/Déconnexion */}
          {!loading && (
            <Button
              className={`w-full justify-start gap-3 font-medium transition-all duration-300 ${
                session 
                  ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
                  : 'education-button'
              }`}
              onClick={onAuth}
            >
              {session ? (
                <>
                  <LogOut className="h-5 w-5" />
                  Se Déconnecter
                </>
              ) : (
                <>
                  <User className="h-5 w-5" />
                  Se Connecter
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
