
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserAvatar } from "@/components/UserAvatar";
import { UserProfile } from "@/hooks/useAuthState";
import { User, Youtube, Settings, LogOut, ChevronRight } from "lucide-react";

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
          <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border/30">
            <UserAvatar user={user} size="md" />
            <div className="flex-1">
              <p className="font-semibold text-foreground">{user?.full_name || 'Utilisateur'}</p>
              <p className="text-sm text-muted-foreground capitalize">{user?.role || 'Utilisateur'}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        
        {/* Navigation Links */}
        <div className="space-y-3">
          <Link
            to="/"
            className="flex items-center gap-3 p-3 rounded-lg text-foreground hover:bg-accent/50 transition-all duration-300 group"
          >
            <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-150 transition-transform duration-300"></div>
            <span className="font-medium">Accueil</span>
          </Link>
          
          {/* Tutoriels pour les étudiants */}
          {!loading && session && userRole === 'student' && (
            <Link
              to="/student/yt-dev-tutorials"
              className="flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-all duration-300 group"
            >
              <Youtube className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Tutoriels Dev</span>
            </Link>
          )}
        </div>
        
        {/* Actions */}
        <div className="space-y-3 pt-4 border-t border-border/30">
          {/* Portal Access */}
          {!loading && session && (userRole === 'teacher' || userRole === 'admin') && (
            <Button
              variant="outline"
              className="w-full justify-start gap-3 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50 transition-all duration-300"
              onClick={onPortalClick}
            >
              <Settings className="h-5 w-5" />
              {userRole === 'admin' ? 'Admin Portal' : 'Teacher Portal'}
            </Button>
          )}
          
          {/* Mon Profil */}
          {!loading && session && (
            <Button
              variant="outline"
              className="w-full justify-start gap-3 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
              onClick={onPortalClick}
            >
              <User className="h-5 w-5" />
              Mon Profil
            </Button>
          )}
          
          {/* Connexion/Déconnexion */}
          {!loading && (
            <Button
              className={`w-full justify-start gap-3 font-medium transition-all duration-300 ${
                session 
                  ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
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
