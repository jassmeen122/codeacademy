
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
}

export interface UserBadge {
  badge: Badge;
  earned_at: string;
}

export const useUserBadges = () => {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthState();

  useEffect(() => {
    const fetchUserBadges = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch badges earned by the user with badge details
        const { data, error } = await supabase
          .from('user_badges')
          .select(`
            earned_at,
            badge:badge_id (
              id,
              name,
              description,
              icon,
              points
            )
          `)
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false });
          
        if (error) throw error;
        
        const userBadges = data.map((item: any) => ({
          badge: item.badge,
          earned_at: item.earned_at
        }));
        
        setBadges(userBadges);
      } catch (err: any) {
        console.error('Error fetching user badges:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBadges();
  }, [user]);

  return { badges, loading, error };
};
