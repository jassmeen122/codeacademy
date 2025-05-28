
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
        } catch (error) {
          console.error("Error creating user profile:", error);
          // Still allow authentication to proceed with basic user data
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            full_name: currentSession.user.user_metadata?.full_name || null,
            avatar_url: null,
            points: 0,
            role: 'student',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
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
        } catch (error) {
          console.error("Error creating initial user profile:", error);
          // Still allow authentication to proceed
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || null,
            avatar_url: null,
            points: 0,
            role: 'student',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
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
    systemAvailable: true
  };
};
