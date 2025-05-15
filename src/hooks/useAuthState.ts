
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

  // Helper function to clean up auth state from localStorage
  const cleanupAuthState = () => {
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  // Helper function for safe profile fetching with silent error handling
  const safelyFetchProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        // Just log the error but don't throw - we'll handle missing profiles gracefully
        console.warn("Non-critical error fetching profile:", error.message);
        return null;
      }
      return profile;
    } catch (err) {
      console.warn("Error in profile fetch:", err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed", event, currentSession?.user?.id);
      
      if (mounted) {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Defer profile fetching to prevent potential deadlocks
          setTimeout(async () => {
            if (!mounted) return;
            
            const profile = await safelyFetchProfile(currentSession.user.id);
            
            if (profile && mounted) {
              console.log("Profile fetched:", profile);
              setUser(profile as UserProfile);
            } else if (mounted) {
              // Create a minimal user object from auth data if profile fetch fails
              const minimalUser = {
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                full_name: currentSession.user.user_metadata?.full_name || null,
                avatar_url: null,
                points: 0,
                role: (currentSession.user.user_metadata?.role || 'student') as 'admin' | 'teacher' | 'student',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              setUser(minimalUser);
              console.log("Using minimal user profile:", minimalUser);
            }
            
            if (mounted) setLoading(false);
          }, 0);
        } else {
          setUser(null);
          if (mounted) setLoading(false);
        }
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.id);
      
      if (mounted) {
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetching to prevent potential deadlocks
          setTimeout(async () => {
            if (!mounted) return;
            
            const profile = await safelyFetchProfile(session.user.id);
            
            if (profile && mounted) {
              console.log("Initial profile fetch:", profile);
              setUser(profile as UserProfile);
            } else if (mounted) {
              // Create a minimal user object from auth data if profile fetch fails
              const minimalUser = {
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || null,
                avatar_url: null,
                points: 0,
                role: (session.user.user_metadata?.role || 'student') as 'admin' | 'teacher' | 'student',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              setUser(minimalUser);
              console.log("Using minimal user profile for initial session:", minimalUser);
            }
            
            if (mounted) setLoading(false);
          }, 0);
        } else {
          if (mounted) setLoading(false);
        }
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
      // Clean up auth state
      cleanupAuthState();
      
      // Sign out
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      
      // Force page reload to ensure clean state
      window.location.href = '/auth';
      toast.success('Logged out successfully');
      return true;
    } catch (error: any) {
      toast.error("Sign out error: " + (error.message || 'Unknown error'));
      console.error("Sign out error:", error);
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    user,
    loading,
    handleSignOut
  };
};
