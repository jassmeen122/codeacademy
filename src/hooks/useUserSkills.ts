
import { useState, useEffect, useCallback } from 'react';
import { UserSkill } from '@/types/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { toast } from 'sonner';

export const useUserSkills = () => {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthState();

  const fetchUserSkills = useCallback(async () => {
    if (!user) {
      console.log("No user available, cannot fetch skills");
      setSkills([]);
      setLoading(false);
      return [];
    }
    
    try {
      setLoading(true);
      
      // Fetch user skills from the database
      const { data, error } = await supabase
        .from('user_skills_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('progress', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      const userSkills: UserSkill[] = data.map(item => ({
        id: item.id,
        skill_name: item.skill_name,
        progress: item.progress,
        last_updated: item.last_updated
      }));
      
      setSkills(userSkills);
      return userSkills;
    } catch (error: any) {
      console.error('Error fetching user skills:', error);
      toast.error('Failed to load skills data');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      fetchUserSkills();
    }
  }, [user, fetchUserSkills]);

  return { skills, loading, fetchUserSkills };
};
