
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import { toast } from 'sonner';

export const useQuizProgress = () => {
  const [updating, setUpdating] = useState(false);
  const { user } = useAuthState();
  
  const trackQuizCompletion = async (
    languageId: string,
    language: string, 
    passed: boolean, 
    score: number
  ) => {
    if (!user) return false;
    
    try {
      setUpdating(true);
      
      // Record the activity
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'quiz_completion',
          activity_data: {
            language_id: languageId,
            language,
            passed,
            score,
            timestamp: new Date().toISOString()
          }
        });
        
      if (error) throw error;
      
      // Update user language progress record
      const { data: existingProgress, error: fetchError } = await supabase
        .from('user_language_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('language_id', languageId)
        .maybeSingle();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching language progress:', fetchError);
      } else if (existingProgress) {
        // Update existing record
        await supabase
          .from('user_language_progress')
          .update({
            quiz_completed: true,
            last_updated: new Date().toISOString()
          })
          .eq('id', existingProgress.id);
      } else {
        // Create new record
        await supabase
          .from('user_language_progress')
          .insert({
            user_id: user.id,
            language_id: languageId,
            quiz_completed: true,
            summary_read: false,
            badge_earned: false,
            last_updated: new Date().toISOString()
          });
      }
      
      // If passed, update the user's skill for that language
      if (passed) {
        const progressIncrement = Math.round((score / 100) * 15); // Up to 15% progress based on score
        
        await supabase
          .from('user_skills_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('skill_name', language)
          .maybeSingle()
          .then(async ({ data, error: fetchSkillError }) => {
            if (fetchSkillError && fetchSkillError.code !== 'PGRST116') {
              console.error('Error fetching skill:', fetchSkillError);
              return;
            }
            
            if (data) {
              // Update existing skill
              let newProgress = Math.min(data.progress + progressIncrement, 100);
              
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
                  progress: progressIncrement,
                  last_updated: new Date().toISOString()
                });
            }
          });
      }
      
      return true;
    } catch (error) {
      console.error('Error tracking quiz completion:', error);
      toast.error('Failed to save your quiz results');
      return false;
    } finally {
      setUpdating(false);
    }
  };
  
  return {
    trackQuizCompletion,
    updating
  };
};
