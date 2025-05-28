
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  points: number;
  start_date: string;
  end_date: string;
}

interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  status: 'in_progress' | 'completed';
  completed_at: string | null;
  challenge: Challenge;
}

interface UserBadge {
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    points: number;
  };
  earned_at: string;
}

export const useAchievements = (userId: string | undefined) => {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [challenges, setChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (userId) {
      fetchBadgesAndChallenges();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchBadgesAndChallenges = async () => {
    try {
      if (!userId) return;
      setLoading(true);

      // Fetch user badges with error handling
      try {
        const { data: badgesData, error: badgesError } = await supabase
          .from('user_badges')
          .select(`
            earned_at,
            badge:badges (
              id,
              name,
              description,
              icon,
              points
            )
          `)
          .eq('user_id', userId);

        if (badgesError) {
          console.warn('Error fetching badges:', badgesError);
          setBadges([]);
        } else {
          // Type assertion with proper error handling
          const formattedBadges = (badgesData || []).filter(item => item.badge).map(item => ({
            badge: item.badge as UserBadge['badge'],
            earned_at: item.earned_at
          }));
          setBadges(formattedBadges);
        }
      } catch (badgeError) {
        console.warn('Error in badge fetch:', badgeError);
        setBadges([]);
      }

      // Fetch all challenges with error handling
      try {
        const { data: challengesData, error: challengesError } = await supabase
          .from('challenges')
          .select('*')
          .gte('end_date', new Date().toISOString());

        if (challengesError) {
          console.warn('Error fetching challenges:', challengesError);
          setChallenges([]);
          return;
        }

        // Fetch user challenges with error handling
        const { data: userChallengesData, error: userChallengesError } = await supabase
          .from('user_challenges')
          .select(`
            id,
            user_id,
            challenge_id,
            status,
            completed_at,
            challenge:challenges (
              id,
              title,
              description,
              type,
              points,
              start_date,
              end_date
            )
          `)
          .eq('user_id', userId);

        if (userChallengesError) {
          console.warn('Error fetching user challenges:', userChallengesError);
          setChallenges([]);
          return;
        }

        // Process challenges - combine existing user challenges with all challenges
        const processedChallenges: UserChallenge[] = (challengesData || []).map((challenge: Challenge) => {
          const userChallenge = userChallengesData?.find(
            (uc) => uc.challenge_id === challenge.id
          );
          
          if (userChallenge && userChallenge.challenge) {
            return {
              id: userChallenge.id,
              user_id: userChallenge.user_id,
              challenge_id: userChallenge.challenge_id,
              status: userChallenge.status as 'in_progress' | 'completed',
              completed_at: userChallenge.completed_at,
              challenge: userChallenge.challenge as Challenge
            };
          } else {
            // Challenge exists but user hasn't started it yet
            return {
              id: 'temp-' + challenge.id,
              user_id: userId,
              challenge_id: challenge.id,
              status: 'in_progress' as const,
              completed_at: null,
              challenge: challenge
            };
          }
        });

        setChallenges(processedChallenges);
      } catch (challengeError) {
        console.warn('Error in challenge fetch:', challengeError);
        setChallenges([]);
      }

    } catch (error: any) {
      console.error('Error fetching achievements:', error);
      setError(error);
      toast.error("Impossible de charger les récompenses");
    } finally {
      setLoading(false);
    }
  };

  const completeChallenge = async (challengeId: string) => {
    try {
      if (!userId) return;

      const { data, error } = await supabase
        .from('user_challenges')
        .upsert({
          user_id: userId,
          challenge_id: challengeId,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      
      toast.success("Défi complété avec succès!");
      fetchBadgesAndChallenges();
      return data;
    } catch (error: any) {
      console.error('Error completing challenge:', error);
      toast.error("Erreur lors de la complétion du défi");
      return null;
    }
  };

  return {
    badges,
    challenges,
    loading,
    error,
    completeChallenge,
    refreshAchievements: fetchBadgesAndChallenges
  };
};
