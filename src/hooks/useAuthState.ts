
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
            try {
              // Fetch user profile on auth state change
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();
              
              if (error) {
                console.error("Error fetching user profile:", error);
              } else if (profile && mounted) {
                console.log("Profile fetched:", profile);
                setUser(profile as UserProfile);
              }
            } catch (error) {
              console.error("Error in profile fetch:", error);
            } finally {
              if (mounted) setLoading(false);
            }
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
            try {
              // Fetch user profile
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (error) {
                console.error("Error fetching user profile:", error);
              } else if (profile && mounted) {
                console.log("Initial profile fetch:", profile);
                setUser(profile as UserProfile);
              }
            } catch (error) {
              console.error("Error in profile fetch:", error);
            } finally {
              if (mounted) setLoading(false);
            }
          }, 0);
        } else {
          if (mounted) setLoading(false);
        }
      }
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
