
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    console.log("useAuthState: Initializing auth state");
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("useAuthState: Initial session", session ? "exists" : "doesn't exist");
      setSession(session);
      
      if (session?.user) {
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
            console.log("useAuthState: User profile fetched", profile.role);
            setUser(profile as UserProfile);
          }
        } catch (error) {
          console.error("Error in profile fetch:", error);
        }
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("useAuthState: Auth state changed", _event);
      setSession(session);
      
      if (session?.user) {
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
            console.log("useAuthState: User profile updated on auth change", profile.role);
            setUser(profile as UserProfile);
          }
        } catch (error) {
          console.error("Error in profile fetch:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      console.log("useAuthState: Signing out");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      navigate('/auth');
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return {
    session,
    user,
    loading,
    handleSignOut
  };
};
