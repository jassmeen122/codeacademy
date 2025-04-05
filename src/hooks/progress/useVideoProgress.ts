
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import { toast } from 'sonner';

export const useVideoProgress = () => {
  const [updating, setUpdating] = useState(false);
  const { user } = useAuthState();
  
  const trackVideoProgress = async (
    courseId: string, 
    language: string, 
    progress: number, 
    completed: boolean
  ) => {
    if (!user) return false;
    
    try {
      setUpdating(true);
      
      // Record the activity
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'video_progress',
          activity_data: {
            course_id: courseId,
            language,
            progress,
            completed,
            timestamp: new Date().toISOString()
          }
        });
        
      if (error) throw error;
      
      // If the video is completed, update the user's skill for that language
      if (completed) {
        await supabase
          .from('user_skills_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('skill_name', language)
          .maybeSingle()
          .then(async ({ data, error: fetchError }) => {
            if (fetchError && fetchError.code !== 'PGRST116') {
              console.error('Error fetching skill:', fetchError);
              return;
            }
            
            if (data) {
              // Update existing skill
              let newProgress = Math.min(data.progress + 5, 100); // Increase by 5%, max 100%
              
              await supabase
                .from('user_skills_progress')
                .update({ 
                  progress: newProgress,
                  last_updated: new Date().toISOString()
                })
                .eq('id', data.id);
            } else {
              // Create new skill
              await supabase
                .from('user_skills_progress')
                .insert({
                  user_id: user.id,
                  skill_name: language,
                  progress: 10, // Start at 10%
                  last_updated: new Date().toISOString()
                });
            }
          });
      }
      
      return true;
    } catch (error) {
      console.error('Error tracking video progress:', error);
      toast.error('Failed to save your progress');
      return false;
    } finally {
      setUpdating(false);
    }
  };
  
  return {
    trackVideoProgress,
    updating
  };
};
