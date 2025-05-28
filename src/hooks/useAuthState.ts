
import { useState, useEffect } from "react";
import { supabase, authWithRetry } from "@/integrations/supabase/client";
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
  const [systemAvailable, setSystemAvailable] = useState(true);
  const navigate = useNavigate();

  // Helper function to clean up auth state from localStorage
  const cleanupAuthState = () => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("Error cleaning auth state:", error);
    }
  };

  // Enhanced profile fetching with system degradation handling
  const safelyFetchProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.warn("Error fetching profile:", error.message);
        setSystemAvailable(false);
        return null;
      }
      
      setSystemAvailable(true);
      return profile;
    } catch (err: any) {
      console.warn("Error in profile fetch:", err);
      setSystemAvailable(false);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed", event, currentSession?.user?.id);
      
      if (!mounted) return;
      
      setSession(currentSession);
      
      if (currentSession?.user) {
        // Fetch profile separately to prevent deadlocks
        setTimeout(async () => {
          if (!mounted) return;
          
          const profile = await safelyFetchProfile(currentSession.user.id);
          
          if (profile && mounted) {
            console.log("Profile fetched:", profile);
            setUser(profile as UserProfile);
          } else if (mounted) {
            // Create a minimal user object from auth metadata
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
            
            // Try to create profile if system is available
            if (systemAvailable) {
              try {
                await supabase.from('profiles').upsert(minimalUser, { onConflict: 'id' });
              } catch (profileError) {
                console.warn("Non-critical: Error creating profile:", profileError);
                setSystemAvailable(false);
              }
            }
          }
          
          if (mounted) setLoading(false);
        }, 0);
      } else {
        setUser(null);
        if (mounted) setLoading(false);
      }
    });

    // After setting up listener, check for existing session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.warn("Session check error:", error);
        setSystemAvailable(false);
      }
      
      console.log("Initial session check:", session?.user?.id);
      
      if (!mounted) return;
      
      setSession(session);
      
      if (session?.user) {
        setTimeout(async () => {
          if (!mounted) return;
          
          const profile = await safelyFetchProfile(session.user.id);
          
          if (profile && mounted) {
            setUser(profile as UserProfile);
          } else if (mounted) {
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
            
            if (systemAvailable) {
              try {
                await supabase.from('profiles').upsert(minimalUser, { onConflict: 'id' });
              } catch (error) {
                console.warn("Non-critical initialization error:", error);
                setSystemAvailable(false);
              }
            }
          }
          
          if (mounted) setLoading(false);
        }, 0);
      } else {
        if (mounted) setLoading(false);
      }
    }).catch(error => {
      console.error("Error in initial session check:", error);
      setSystemAvailable(false);
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [systemAvailable]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      
      // Clean up auth state
      cleanupAuthState();
      
      // Sign out with retry mechanism
      await authWithRetry(async () => {
        const { error } = await supabase.auth.signOut({ scope: 'global' });
        if (error) throw error;
        return { error: null };
      });
      
      setUser(null);
      setSession(null);
      
      // Force page reload to ensure clean state
      window.location.href = '/auth';
      toast.success('Déconnexion réussie');
      return true;
    } catch (error: any) {
      toast.error("Erreur de déconnexion: " + (error.message || 'Erreur inconnue'));
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
    handleSignOut,
    systemAvailable
  };
};
