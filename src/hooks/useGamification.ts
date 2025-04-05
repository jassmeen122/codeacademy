
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

interface UserPoints {
  daily_points: number;
  weekly_points: number;
  total_points: number;
  last_updated: string;
}

export const useGamification = () => {
  const { user } = useAuthState();
  const [loading, setLoading] = useState(false);
  const [badges, setBadges] = useState<any[]>([]);
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
      const response = await supabase.functions.invoke('gamification', {
        body: { 
          points: amount 
        },
        method: 'POST',
        path: '/add-points'
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to add points');
      }
      
      // Show toast notification
      if (reason) {
        toast.success(`+${amount} XP: ${reason}`);
      } else {
        toast.success(`+${amount} XP`);
      }
      
      // Check if user earned any new badges
      if (response.data.newBadges && response.data.newBadges.length > 0) {
        toast.success("Nouveau badge débloqué !", {
          description: "Consultez votre profil pour voir vos badges"
        });
      }
      
      return { success: true, data: response.data };
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
      const response = await supabase.functions.invoke('gamification', {
        body: { 
          challenge_id: challengeId,
          progress,
          target,
          completed: progress >= target
        },
        method: 'POST',
        path: '/update-challenge'
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to update challenge');
      }
      
      // Show toast if challenge completed
      if (response.data.pointsAwarded) {
        toast.success("Défi terminé !", {
          description: `+${response.data.pointsAwarded} XP`
        });
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating challenge:', error);
      return { success: false, error };
    }
  };
  
  // Generate certificate for course completion
  const generateCertificate = async (courseId: string, courseTitle: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      const response = await supabase.functions.invoke('gamification', {
        body: { 
          course_id: courseId,
          course_title: courseTitle
        },
        method: 'POST',
        path: '/generate-certificate'
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to generate certificate');
      }
      
      // Show toast
      if (!response.data.alreadyExists) {
        toast.success("Cours terminé !", {
          description: "Certificat disponible dans votre profil"
        });
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error("Impossible de générer le certificat");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  // Track user activity and award points
  const trackActivity = async (activityType: string, detail: any, pointsToAward: number) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      // First record the activity in user_activities
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          activity_data: detail
        });
        
      if (error) throw error;
      
      // Then award points if specified
      if (pointsToAward > 0) {
        await addPoints(pointsToAward, `Activité: ${activityType}`);
      }
      
      // Check for and update challenges that might be affected
      await updateChallengesBasedOnActivity(activityType);
      
      return { success: true };
    } catch (error) {
      console.error('Error tracking activity:', error);
      return { success: false, error };
    }
  };
  
  // Update challenges based on activity type
  const updateChallengesBasedOnActivity = async (activityType: string) => {
    if (!user) return;
    
    try {
      // Get active challenges
      const { data: activeDaily } = await supabase
        .from('user_daily_challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('challenge_type', 'daily')
        .eq('completed', false)
        .gte('expires_at', new Date().toISOString())
        .maybeSingle();
        
      const { data: activeWeekly } = await supabase
        .from('user_daily_challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('challenge_type', 'weekly')
        .eq('completed', false)
        .gte('expires_at', new Date().toISOString())
        .maybeSingle();
      
      // Update lesson challenge if applicable
      if (activityType === 'lesson_viewed' && activeDaily) {
        await updateChallengeProgress(
          activeDaily.id, 
          activeDaily.current_progress + 1, 
          activeDaily.target
        );
      }
      
      // Update login streak for weekly challenge
      if (activityType === 'login' && activeWeekly) {
        // Get last 5 days of activity
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        
        const { data: recentActivity } = await supabase
          .from('user_activities')
          .select('created_at')
          .eq('user_id', user.id)
          .eq('activity_type', 'login')
          .gte('created_at', fiveDaysAgo.toISOString());
          
        if (recentActivity) {
          // Count unique days
          const uniqueDays = new Set();
          recentActivity.forEach(activity => {
            if (activity.created_at) {
              const date = new Date(activity.created_at);
              uniqueDays.add(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
            }
          });
          
          const daysActive = uniqueDays.size;
          
          // Update progress
          await updateChallengeProgress(
            activeWeekly.id,
            daysActive,
            activeWeekly.target
          );
        }
      }
    } catch (error) {
      console.error('Error updating challenges based on activity:', error);
    }
  };
  
  // Get user badges
  const getUserBadges = async () => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          id, earned_at,
          badges:badge_id (
            id, name, description, icon, points
          )
        `)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      if (data) {
        setBadges(data.map(item => ({
          id: item.id,
          earned_at: item.earned_at,
          ...item.badges
        })));
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
      
      const response = await supabase.functions.invoke('gamification', {
        queryParams: { period },
        method: 'GET',
        path: '/get-leaderboard'
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch leaderboard');
      }
      
      if (response.data?.leaderboard) {
        setLeaderboard(response.data.leaderboard);
      }
      
      return { success: true, data: response.data?.leaderboard };
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
    challenges,
    certificates,
    points,
    leaderboard,
    addPoints,
    updateChallengeProgress,
    generateCertificate,
    trackActivity,
    getUserBadges,
    getUserChallenges,
    getUserCertificates,
    getUserPoints,
    getLeaderboard
  };
};
