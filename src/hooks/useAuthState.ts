
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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed", _event, session?.user?.id);
      setSession(session);
      
      if (session?.user) {
        // Defer profile fetching to prevent potential deadlocks
        setTimeout(async () => {
          try {
            // Fetch user profile on auth state change
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              console.error("Error fetching user profile:", error);
            } else if (profile) {
              console.log("Profile fetched:", profile);
              setUser(profile as UserProfile);
            }
          } catch (error) {
            console.error("Error in profile fetch:", error);
          }
        }, 0);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.id);
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
            } else if (profile) {
              console.log("Initial profile fetch:", profile);
              setUser(profile as UserProfile);
            }
          } catch (error) {
            console.error("Error in profile fetch:", error);
          }
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt to update user status to offline before logging out
      try {
        if (session?.user?.id) {
          await supabase
            .from('user_status')
            .upsert({
              user_id: session.user.id,
              status: 'offline',
              last_active: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            });
        }
      } catch (statusError) {
        // Continue even if this fails
        console.warn("Failed to update status on sign out:", statusError);
      }
      
      // Perform global sign out
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      navigate('/auth');
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
