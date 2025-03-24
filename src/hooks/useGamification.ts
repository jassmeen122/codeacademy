
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { Badge, UserBadge, Challenge, UserChallenge } from '@/types/course';
import { toast } from 'sonner';

export const useUserBadges = () => {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();

  useEffect(() => {
    if (!user) {
      setBadges([]);
      setLoading(false);
      return;
    }

    const fetchBadges = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_badges')
          .select(`
            id,
            user_id,
            badge_id,
            earned_at,
            badge:badges (*)
          `)
          .eq('user_id', user.id);

        if (error) throw error;
        setBadges(data || []);
      } catch (error: any) {
        console.error('Error fetching badges:', error.message);
        toast.error('Failed to load badges');
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [user]);

  return { badges, loading };
};

export const useChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();

  useEffect(() => {
    if (!user) {
      setChallenges([]);
      setUserChallenges([]);
      setLoading(false);
      return;
    }

    const fetchChallenges = async () => {
      try {
        setLoading(true);
        // Fetch active challenges (end date is in the future)
        const { data: challengesData, error: challengesError } = await supabase
          .from('challenges')
          .select('*')
          .gte('end_date', new Date().toISOString());

        if (challengesError) throw challengesError;

        // Fetch user's challenge participation
        const { data: userChallengesData, error: userChallengesError } = await supabase
          .from('user_challenges')
          .select('*')
          .eq('user_id', user.id);

        if (userChallengesError) throw userChallengesError;

        setChallenges(challengesData || []);
        setUserChallenges(userChallengesData || []);
      } catch (error: any) {
        console.error('Error fetching challenges:', error.message);
        toast.error('Failed to load challenges');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [user]);

  const completeChallenge = async (challengeId: string) => {
    if (!user) return;

    try {
      // Check if the user already has this challenge
      const existingChallenge = userChallenges.find(
        (uc) => uc.challenge_id === challengeId
      );

      if (existingChallenge && existingChallenge.completed) {
        toast.info('Challenge already completed');
        return;
      }

      if (existingChallenge) {
        // Update existing record
        const { error } = await supabase
          .from('user_challenges')
          .update({
            completed: true,
            completion_date: new Date().toISOString()
          })
          .eq('id', existingChallenge.id);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('user_challenges')
          .insert({
            user_id: user.id,
            challenge_id: challengeId,
            completed: true,
            completion_date: new Date().toISOString()
          });

        if (error) throw error;
      }

      // Refresh challenges
      const { data, error } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserChallenges(data || []);

      toast.success('Challenge completed! Points awarded.');
    } catch (error: any) {
      console.error('Error completing challenge:', error.message);
      toast.error('Failed to complete challenge');
    }
  };

  return { challenges, userChallenges, loading, completeChallenge };
};

export const useUserPoints = () => {
  const [points, setPoints] = useState<number>(0);
  const [rank, setRank] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();

  useEffect(() => {
    if (!user) {
      setPoints(0);
      setRank(0);
      setLoading(false);
      return;
    }

    const fetchPoints = async () => {
      try {
        setLoading(true);
        // Get user's points from profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // Calculate user's rank
        const { data: betterProfiles, error: rankError } = await supabase
          .from('profiles')
          .select('id')
          .gt('points', profile?.points || 0)
          .not('id', 'eq', user.id);

        if (rankError) throw rankError;

        setPoints(profile?.points || 0);
        setRank(betterProfiles?.length ? betterProfiles.length + 1 : 1);
      } catch (error: any) {
        console.error('Error fetching user points:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [user]);

  return { points, rank, loading };
};
