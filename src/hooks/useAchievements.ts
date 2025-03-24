
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

      // Fetch user badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('user_badges')
        .select(`
          earned_at,
          badge:badges (*)
        `)
        .eq('user_id', userId);

      if (badgesError) throw badgesError;
      setBadges(badgesData || []);

      // Fetch all challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from('challenges')
        .select('*')
        .gte('end_date', new Date().toISOString());

      if (challengesError) throw challengesError;

      // Fetch user challenges
      const { data: userChallengesData, error: userChallengesError } = await supabase
        .from('user_challenges')
        .select(`
          id,
          user_id,
          challenge_id,
          status,
          completed_at,
          challenge:challenges (*)
        `)
        .eq('user_id', userId);

      if (userChallengesError) throw userChallengesError;

      // Process challenges - combine existing user challenges with all challenges
      const processedChallenges: UserChallenge[] = challengesData.map((challenge: Challenge) => {
        const userChallenge = userChallengesData?.find(
          (uc) => uc.challenge_id === challenge.id
        );
        
        if (userChallenge) {
          return userChallenge as UserChallenge;
        } else {
          // Challenge exists but user hasn't started it yet
          return {
            id: 'temp-' + challenge.id,
            user_id: userId,
            challenge_id: challenge.id,
            status: 'in_progress',
            completed_at: null,
            challenge: challenge
          };
        }
      });

      setChallenges(processedChallenges);
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
