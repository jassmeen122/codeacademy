
import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, User, BookOpen, TrendingUp, Settings, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { NotificationBell } from "./navigation/NotificationBell";
import { MobileMenu } from "./navigation/MobileMenu";
import { useAuthState } from "@/hooks/useAuthState";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { session, user, loading, handleSignOut } = useAuthState();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuth = () => {
    if (session) {
      handleSignOut().then(() => {
        toast.success('Signed out successfully');
      }).catch((error: any) => {
        toast.error(error.message || 'Error signing out');
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
    <nav className="fixed top-0 z-50 w-full backdrop-blur-lg bg-background/90 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-4">
            <Link to="/" className="text-xl font-bold text-primary">
              CodeAcademy
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {!loading && session && (
              <>
                <Button
                  variant="ghost"
                  className="gap-2"
                  onClick={() => navigate('/student/profile')}
                >
                  <User className="h-4 w-4" />
                  Mon Profil
                </Button>

                <Button
                  variant="ghost"
                  className="gap-2"
                  onClick={() => navigate('/student/courses')}
                >
                  <BookOpen className="h-4 w-4" />
                  Voir les Cours
                </Button>

                <Button
                  variant="ghost"
                  className="gap-2"
                  onClick={() => navigate('/student/progress')}
                >
                  <TrendingUp className="h-4 w-4" />
                  Mes Progrès
                </Button>

                <Button
                  variant="ghost"
                  className="gap-2"
                  onClick={() => navigate('/student/settings')}
                >
                  <Settings className="h-4 w-4" />
                  Paramètres
                </Button>
              </>
            )}
            
            {!loading && session && (user?.role === 'teacher' || user?.role === 'admin') && (
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
                onClick={() => navigate(user.role === 'admin' ? '/admin' : '/teacher')}
              >
                {user.role === 'admin' ? 'Admin Portal' : 'Teacher Portal'}
              </Button>
            )}
            
            {!loading && session && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">{user?.full_name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.role || 'Loading...'}</p>
                </div>
                <NotificationBell userId={session.user.id} />
              </div>
            )}
            
            {!loading && (
              <Button
                variant={session ? "outline" : "default"}
                onClick={handleAuth}
                className="gap-2"
              >
                {session ? (
                  <>
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </>
                ) : "Se Connecter"}
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
              className="inline-flex items-center justify-center p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
        />
      </div>
    </nav>
  );
};

export default Navigation;
