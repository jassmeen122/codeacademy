
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("User is authenticated");
          setIsAuthenticated(true);
          
          // Get user role from profiles
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error("Error fetching profile:", error);
          } else if (profile) {
            console.log("User role:", profile.role);
            setUserRole(profile.role);
          }
        } else {
          console.log("User is not authenticated");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();

    // Also set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        // Get user role
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setUserRole(data.role);
            }
          });
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to auth");
    return <Navigate to="/auth" />;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    console.log(`User role ${userRole} not in allowed roles ${allowedRoles}, redirecting`);
    // Redirect to appropriate dashboard based on role
    if (userRole === 'admin') {
      return <Navigate to="/admin" />;
    } else if (userRole === 'teacher') {
      return <Navigate to="/teacher" />;
    } else if (userRole === 'student') {
      return <Navigate to="/student" />;
    }
    
    // Default fallback
    return <Navigate to="/" />;
  }

  console.log("Rendering protected route");
  return <>{children}</>;
};

export default ProtectedRoute;
