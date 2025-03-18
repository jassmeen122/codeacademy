
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Settings, TrendingUp, LogOut, User } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  session: any;
  loading: boolean;
  onAuth: () => void;
  userRole?: string;
  onPortalClick?: () => void;
}

export const MobileMenu = ({ 
  isOpen, 
  session, 
  loading, 
  onAuth,
  userRole,
  onPortalClick 
}: MobileMenuProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-2 border-t border-border">
        <Link
          to="/"
          className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent/50"
        >
          Accueil
        </Link>
        
        {!loading && session && (
          <>
            <Link
              to="/student/profile"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent/50"
            >
              <User className="h-4 w-4" />
              Mon Profil
            </Link>
            
            <Link
              to="/student/courses"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent/50"
            >
              <BookOpen className="h-4 w-4" />
              Voir les Cours
            </Link>
            
            <Link
              to="/student/progress"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent/50"
            >
              <TrendingUp className="h-4 w-4" />
              Mes Progrès
            </Link>
            
            <Link
              to="/student/settings"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent/50"
            >
              <Settings className="h-4 w-4" />
              Paramètres
            </Link>
          </>
        )}
        
        {!loading && session && (userRole === 'teacher' || userRole === 'admin') && (
          <Button
            variant="outline"
            className="w-full justify-start border-primary text-primary hover:bg-primary/10"
            onClick={onPortalClick}
          >
            {userRole === 'admin' ? 'Admin Portal' : 'Teacher Portal'}
          </Button>
        )}
        
        {!loading && (
          <Button
            className="w-full mt-4 flex items-center gap-2"
            onClick={onAuth}
            variant={session ? "outline" : "default"}
          >
            {session ? (
              <>
                <LogOut className="h-4 w-4" />
                Déconnexion
              </>
            ) : (
              "Se Connecter"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
