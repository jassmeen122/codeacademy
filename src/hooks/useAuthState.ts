
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
  
  // Check if we're inside a Router context
  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    // Outside Router context - useNavigate is not available
    console.log("useNavigate() is not available yet");
  }

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed", _event, session?.user?.id);
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
            console.log("Profile fetched:", profile);
            setUser(profile as UserProfile);
          }
        } catch (error) {
          console.error("Error in profile fetch:", error);
        }
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
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      
      // Only navigate if we're inside a Router context
      if (navigate) {
        navigate('/auth');
      }
      return true;
    } catch (error) {
      console.error("Sign out error:", error);
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
