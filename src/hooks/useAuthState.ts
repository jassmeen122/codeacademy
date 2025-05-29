
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  points: number | null;
  role: 'admin' | 'teacher' | 'student';
  created_at: string;
  updated_at: string;
  bio?: string | null;
  specialization?: string | null;
}

export const useAuthState = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  // Create user profile from auth data and database profile
  const createUserProfile = async (authUser: any): Promise<UserProfile> => {
    try {
      // Try to get profile from database first
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile && !error) {
        console.log("Profile loaded from database:", profile);
        return profile;
      }
    } catch (error) {
      console.warn("Could not load profile from database:", error);
    }

    // Fallback to auth metadata if database profile doesn't exist
    const fallbackProfile: UserProfile = {
      id: authUser.id,
      email: authUser.email || '',
      full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
      avatar_url: authUser.user_metadata?.avatar_url || null,
      points: 0,
      role: (authUser.user_metadata?.role || 'student') as 'admin' | 'teacher' | 'student',
      created_at: authUser.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log("Using fallback profile:", fallbackProfile);
    return fallbackProfile;
  };

  // Update user status safely (optional, won't block auth)
  const updateUserStatusSafely = async () => {
    try {
      await supabase.rpc('update_user_status_safe', { status_value: 'online' });
    } catch (error) {
      console.warn("Could not update user status (non-critical):", error);
    }
  };

  // Redirect user based on role
  const redirectUserByRole = (role: string) => {
    console.log("Redirecting user with role:", role);
    
    // Get current path to avoid unnecessary redirects
    const currentPath = window.location.pathname;
    
    setTimeout(() => {
      switch (role) {
        case 'admin': 
          if (!currentPath.startsWith('/admin')) {
            console.log("Navigating to /admin");
            navigate('/admin');
          }
          break;
        case 'teacher': 
          if (!currentPath.startsWith('/teacher')) {
            console.log("Navigating to /teacher");
            navigate('/teacher'); 
          }
          break;
        default: 
          if (!currentPath.startsWith('/student')) {
            console.log("Navigating to /student");
            navigate('/student'); 
          }
          break;
      }
    }, 100);
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession?.user?.id);
      
      if (!mounted) return;
      
      setSession(currentSession);
      
      if (currentSession?.user) {
        try {
          const userProfile = await createUserProfile(currentSession.user);
          setUser(userProfile);
          console.log("User profile created:", userProfile);
          
          // Update status in background (non-blocking)
          setTimeout(() => updateUserStatusSafely(), 0);

          // Auto-redirect based on role if we're on auth page or home
          if (window.location.pathname === '/auth' || window.location.pathname === '/') {
            redirectUserByRole(userProfile.role);
          }
        } catch (error) {
          console.error("Error creating user profile:", error);
          // Still allow authentication to proceed with basic user data
          const basicProfile: UserProfile = {
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            full_name: currentSession.user.user_metadata?.full_name || null,
            avatar_url: null,
            points: 0,
            role: (currentSession.user.user_metadata?.role || 'student') as 'admin' | 'teacher' | 'student',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setUser(basicProfile);

          // Auto-redirect even with basic profile
          if (window.location.pathname === '/auth' || window.location.pathname === '/') {
            redirectUserByRole(basicProfile.role);
          }
        }
        
        if (mounted) setLoading(false);
      } else {
        setUser(null);
        if (mounted) setLoading(false);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.warn("Session check error:", error);
      }
      
      console.log("Initial session check:", session?.user?.id);
      
      if (!mounted) return;
      
      setSession(session);
      
      if (session?.user) {
        try {
          const userProfile = await createUserProfile(session.user);
          setUser(userProfile);
          console.log("Initial user profile:", userProfile);
          
          // Update status in background (non-blocking)
          setTimeout(() => updateUserStatusSafely(), 0);

          // Auto-redirect based on role if we're on auth page or home
          if (window.location.pathname === '/auth' || window.location.pathname === '/') {
            redirectUserByRole(userProfile.role);
          }
        } catch (error) {
          console.error("Error creating initial user profile:", error);
          // Still allow authentication to proceed
          const basicProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || null,
            avatar_url: null,
            points: 0,
            role: (session.user.user_metadata?.role || 'student') as 'admin' | 'teacher' | 'student',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setUser(basicProfile);

          // Auto-redirect even with basic profile
          if (window.location.pathname === '/auth' || window.location.pathname === '/') {
            redirectUserByRole(basicProfile.role);
          }
        }
        
        if (mounted) setLoading(false);
      } else {
        if (mounted) setLoading(false);
      }
    }).catch(error => {
      console.error("Error in initial session check:", error);
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      
      // Clear localStorage
      try {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.warn("Error cleaning auth state:", error);
      }
      
      // Sign out
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      
      // Force page reload
      window.location.href = '/auth';
      toast.success('Déconnexion réussie');
      return true;
    } catch (error: any) {
      toast.error("Erreur de déconnexion: " + (error.message || 'Erreur inconnue'));
      console.error("Sign out error:", error);
      setLoading(false);
      throw error;
    }
  };

  return {
    session,
    user,
    loading,
    handleSignOut,
    systemAvailable: true
  };
};
