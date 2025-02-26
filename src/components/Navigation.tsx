
import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "next-themes";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    }
  };

  const handleAuth = () => {
    if (session) {
      handleSignOut();
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
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-fadeIn">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/student"
                className="block px-3 py-2 text-base font-medium text-foreground/60 hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                to="#courses"
                className="block px-3 py-2 text-base font-medium text-foreground/60 hover:text-foreground"
              >
                Courses
              </Link>
              <Link
                to="#features"
                className="block px-3 py-2 text-base font-medium text-foreground/60 hover:text-foreground"
              >
                Features
              </Link>
              {!loading && (
                <Button
                  className="w-full mt-4"
                  onClick={handleAuth}
                >
                  {session ? "Sign Out" : "Sign In"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
