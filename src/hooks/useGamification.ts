
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { toast } from 'sonner';
import { checkForNewBadges } from '@/utils/badgeChecker';

interface UserChallenge {
  id: string;
  description: string;
  target: number;
  current_progress: number;
  challenge_type: string;
  reward_xp: number;
  expires_at: string;
  completed: boolean;
  completed_at?: string;
}

interface Certificate {
  id: string;
  title: string;
  description: string;
  certificate_url: string | null;
  issued_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  earned: boolean;
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
      
      if (reason) {
        toast.success(`+${amount} XP: ${reason}`);
      } else {
        toast.success(`+${amount} XP`);
      }
      
      if (data?.newBadges && data.newBadges.length > 0) {
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
      
      if (data.pointsAwarded) {
        toast.success("Défi terminé !", {
          description: `+${data.pointsAwarded} XP`
        });
        
        await checkForBadges();
        await getUserChallenges(); // Refresh challenges after update
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
      const newBadges = await checkForNewBadges(user.id);
      
      if (newBadges && newBadges.length > 0) {
        await getUserBadges();
        
        toast.success("Nouveau badge débloqué !", {
          description: "Consultez votre page d'achievements pour voir vos badges"
        });
      }
      
      return { success: true, data: newBadges };
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
      
      const { data: userBadgesData, error: userBadgesError } = await supabase
        .from('user_badges')
        .select('badge_id, earned_at')
        .eq('user_id', user.id);
      
      if (userBadgesError) throw userBadgesError;
      
      const { data: allBadgesData, error: allBadgesError } = await supabase
        .from('badges')
        .select('*');
      
      if (allBadgesError) throw allBadgesError;
      
      if (allBadgesData) {
        const earnedBadgesMap = new Map<string, string>();
        if (userBadgesData) {
          userBadgesData.forEach((userBadge: any) => {
            earnedBadgesMap.set(userBadge.badge_id, userBadge.earned_at);
          });
        }
        
        const badgesWithEarnedStatus: Badge[] = allBadgesData.map((badge: any) => {
          const isEarned = earnedBadgesMap.has(badge.id);
          
          return {
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            points: badge.points,
            earned: isEarned,
            earned_at: isEarned ? earnedBadgesMap.get(badge.id) : undefined
          };
        });
        
        const earnedBadges = badgesWithEarnedStatus.filter(badge => badge.earned);
        setBadges(earnedBadges);
        setAllBadges(badgesWithEarnedStatus);
      }
      
      return { success: true };
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
      
      // Check if user has active challenges, if not, generate them
      const { data: existingChallenges, error: existingError } = await supabase
        .from('user_daily_challenges')
        .select('*')
        .eq('user_id', user.id)
        .gte('expires_at', new Date().toISOString())
        .order('challenge_type');
        
      if (existingError) throw existingError;
      
      if (!existingChallenges || existingChallenges.length === 0) {
        // Generate daily challenge
        await supabase.rpc('generate_daily_challenge', { user_uuid: user.id });
        
        // Generate weekly challenge if needed
        await supabase.rpc('generate_weekly_challenge', { user_uuid: user.id });
        
        // Fetch newly generated challenges
        const { data: newChallenges, error: newError } = await supabase
          .from('user_daily_challenges')
          .select('*')
          .eq('user_id', user.id)
          .gte('expires_at', new Date().toISOString())
          .order('challenge_type');
          
        if (newError) throw newError;
        
        if (newChallenges) {
          setChallenges(newChallenges as UserChallenge[]);
        }
      } else {
        setChallenges(existingChallenges as UserChallenge[]);
      }
      
      return { success: true };
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
  
  // Get leaderboard - Modified to only show students
  const getLeaderboard = async (period: 'global' | 'weekly' = 'global') => {
    try {
      setLoading(true);
      
      let query;
      
      if (period === 'weekly') {
        query = supabase
          .from('user_points')
          .select(`
            user_id,
            weekly_points,
            profiles:user_id (
              id,
              full_name,
              avatar_url,
              role
            )
          `)
          .eq('profiles.role', 'student')
          .order('weekly_points', { ascending: false })
          .limit(20);
      } else {
        query = supabase
          .from('profiles')
          .select('id, full_name, avatar_url, points, role')
          .eq('role', 'student')
          .order('points', { ascending: false })
          .limit(20);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        setLeaderboard(data);
      }
      
      return { success: true, data };
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
