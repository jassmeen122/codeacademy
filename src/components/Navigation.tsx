
import { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
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
  const { session, loading, handleSignOut } = useAuthState();

  useState(() => {
    setMounted(true);
  });

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
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/student" 
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="#courses" 
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              Courses
            </Link>
            <Link 
              to="#features" 
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              Features
            </Link>
            {!loading && session && (
              <NotificationBell userId={session.user.id} />
            )}
            {!loading && (
              <Button
                variant="default"
                className="ml-4"
                onClick={handleAuth}
              >
                {session ? "Sign Out" : "Sign In"}
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
        />
      </div>
    </nav>
  );
};

export default Navigation;
