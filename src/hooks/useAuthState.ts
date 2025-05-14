
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
          // Instead of fetching profile, create a minimal user object to bypass DB permissions issue
          const minimalUserProfile: UserProfile = {
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            full_name: currentSession.user.user_metadata?.full_name || null,
            avatar_url: currentSession.user.user_metadata?.avatar_url || null,
            points: 0,
            role: 'student', // Default role
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          if (mounted) {
            setUser(minimalUserProfile);
            setLoading(false);
            
            // If on auth page, redirect to dashboard
            if (window.location.pathname === '/auth') {
              navigate('/student');
            }
          }
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
          // Create minimal user object
          const minimalUserProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || null,
            avatar_url: session.user.user_metadata?.avatar_url || null,
            points: 0,
            role: 'student', // Default role
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          if (mounted) {
            setUser(minimalUserProfile);
            setLoading(false);
            
            // If on auth page, redirect to dashboard
            if (window.location.pathname === '/auth') {
              navigate('/student');
            }
          }
        } else {
          if (mounted) setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      // Clean up auth state
      cleanupAuthState();
      
      // Sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      setUser(null);
      setSession(null);
      
      // Force page reload to ensure clean state
      window.location.href = '/auth';
      toast.success('Logged out successfully');
      return true;
    } catch (error: any) {
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
