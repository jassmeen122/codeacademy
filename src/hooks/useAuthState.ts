
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

  // Create user profile from auth metadata only (no database calls)
  const createUserFromAuth = (authUser: any): UserProfile => {
    return {
      id: authUser.id,
      email: authUser.email || '',
      full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
      avatar_url: authUser.user_metadata?.avatar_url || null,
      points: 0,
      role: (authUser.user_metadata?.role || 'student') as 'admin' | 'teacher' | 'student',
      created_at: authUser.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession?.user?.id);
      
      if (!mounted) return;
      
      setSession(currentSession);
      
      if (currentSession?.user) {
        // Create user from auth data immediately - no database calls
        const userProfile = createUserFromAuth(currentSession.user);
        setUser(userProfile);
        console.log("User profile created:", userProfile);
        
        if (mounted) setLoading(false);
      } else {
        setUser(null);
        if (mounted) setLoading(false);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn("Session check error:", error);
      }
      
      console.log("Initial session check:", session?.user?.id);
      
      if (!mounted) return;
      
      setSession(session);
      
      if (session?.user) {
        const userProfile = createUserFromAuth(session.user);
        setUser(userProfile);
        console.log("Initial user profile:", userProfile);
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
  }, []);

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
    systemAvailable: true // Always true since we're not using database calls
  };
};
