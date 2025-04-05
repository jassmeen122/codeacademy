
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { toast } from 'sonner';

interface UserChallenge {
  id: string;
  description: string;
  target: number;
  current_progress: number;
  challenge_type: string;
  reward_xp: number;
  expires_at: string;
  completed: boolean;
}

interface Certificate {
  id: string;
  title: string;
  description: string;
  certificate_url: string | null;
  issued_at: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  earned?: boolean;
  earned_at?: string;
}

interface UserPoints {
  daily_points: number;
  weekly_points: number;
  total_points: number;
  last_updated: string;
}

export const useGamification = () => {
  const { user } = useAuthState();
  const [loading, setLoading] = useState(false);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<UserChallenge[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [points, setPoints] = useState<UserPoints | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Add points to user
  const addPoints = async (amount: number, reason?: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      // Call our edge function to add points
      const { data, error } = await supabase.functions.invoke('gamification', {
        body: { 
          points: amount 
        },
        method: 'POST',
        headers: {
          'endpoint': 'add-points'
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to add points');
      }
      
      // Show toast notification
      if (reason) {
        toast.success(`+${amount} XP: ${reason}`);
      } else {
        toast.success(`+${amount} XP`);
      }
      
      // Check if user earned any new badges
      if (data?.newBadges && data.newBadges.length > 0) {
        // Refresh badges to get the newly earned ones
        await getUserBadges();
        
        toast.success("Nouveau badge débloqué !", {
          description: "Consultez votre profil pour voir vos badges"
        });
      }
      
      return { success: true, data: data };
    } catch (error) {
      console.error('Error adding points:', error);
      toast.error("Impossible d'ajouter des points");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  // Update challenge progress
  const updateChallengeProgress = async (challengeId: string, progress: number, target: number) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      // Call our edge function to update challenge
      const { data, error } = await supabase.functions.invoke('gamification', {
        body: { 
          challenge_id: challengeId,
          progress,
          target,
          completed: progress >= target
        },
        method: 'POST',
        headers: {
          'endpoint': 'update-challenge'
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to update challenge');
      }
      
      // Show toast if challenge completed
      if (data.pointsAwarded) {
        toast.success("Défi terminé !", {
          description: `+${data.pointsAwarded} XP`
        });
        
        // Check for new badges
        await checkForBadges();
      }
      
      return { success: true, data: data };
    } catch (error) {
      console.error('Error updating challenge:', error);
      return { success: false, error };
    }
  };
  
  // Check for new badges
  const checkForBadges = async () => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      const { data, error } = await supabase.rpc('check_and_award_badges', {
        user_uuid: user.id
      });
      
      if (error) throw error;
      
      // If new badges were earned, refresh the badges
      if (data && data.length > 0) {
        await getUserBadges();
        
        // Display notification
        toast.success("Nouveau badge débloqué !", {
          description: "Consultez votre page d'achievements pour voir vos badges"
        });
      }
      
      return { success: true, data: data };
    } catch (error) {
      console.error('Error checking badges:', error);
      return { success: false, error };
    }
  };
  
  // Generate certificate for course completion
  const generateCertificate = async (courseId: string, courseTitle: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('gamification', {
        body: { 
          course_id: courseId,
          course_title: courseTitle
        },
        method: 'POST',
        headers: {
          'endpoint': 'generate-certificate'
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to generate certificate');
      }
      
      // Show toast
      if (!data.alreadyExists) {
        toast.success("Cours terminé !", {
          description: "Certificat disponible dans votre profil"
        });
      }
      
      return { success: true, data: data };
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error("Impossible de générer le certificat");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  // Get user badges
  const getUserBadges = async () => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      // Use the RPC function to get all badges with earned status
      const { data, error } = await supabase.rpc('get_user_badges', {
        user_uuid: user.id
      });
        
      if (error) throw error;
      
      if (data) {
        // Split badges into earned and not earned
        const earned = data.filter(badge => badge.earned);
        const notEarned = data.filter(badge => !badge.earned);
        
        // Set all badges for display on the achievements page
        setAllBadges(data);
        
        // Set earned badges for other components that might need them
        setBadges(earned);
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching badges:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  // Get user challenges
  const getUserChallenges = async () => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_daily_challenges')
        .select('*')
        .eq('user_id', user.id)
        .gte('expires_at', new Date().toISOString())
        .order('challenge_type');
        
      if (error) throw error;
      
      if (data) {
        setChallenges(data as UserChallenge[]);
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching challenges:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  // Get user certificates
  const getUserCertificates = async () => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_certificates')
        .select('*')
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setCertificates(data as Certificate[]);
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching certificates:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  // Get user points
  const getUserPoints = async () => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setPoints(data as UserPoints);
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching points:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  // Get leaderboard
  const getLeaderboard = async (period: 'global' | 'weekly' = 'global') => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('gamification', {
        method: 'GET',
        headers: {
          'endpoint': 'get-leaderboard',
          'period': period
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to fetch leaderboard');
      }
      
      if (data?.leaderboard) {
        setLeaderboard(data.leaderboard);
      }
      
      return { success: true, data: data?.leaderboard };
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    badges,
    allBadges,
    challenges,
    certificates,
    points,
    leaderboard,
    addPoints,
    updateChallengeProgress,
    checkForBadges,
    generateCertificate,
    getUserBadges,
    getUserChallenges,
    getUserCertificates,
    getUserPoints,
    getLeaderboard
  };
};
