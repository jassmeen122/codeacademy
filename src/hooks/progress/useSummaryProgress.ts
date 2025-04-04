
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthState } from '../useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { useStudentActivity } from '../useStudentActivity';

export const useSummaryProgress = () => {
  const [updating, setUpdating] = useState(false);
  const { user } = useAuthState();
  const { trackLessonViewed, updateUserMetrics } = useStudentActivity();

  // Track summary read progress
  const trackSummaryRead = async (languageId: string, languageName: string) => {
    if (!user) {
      toast.error('Please log in to track your progress');
      return false;
    }

    try {
      setUpdating(true);
      console.log(`Tracking summary read: language=${languageId}, name=${languageName}`);

      // Update language progress
      const { data, error } = await supabase
        .from('user_language_progress')
        .upsert({
          user_id: user.id,
          language_id: languageId,
          summary_read: true,
          last_updated: new Date().toISOString()
        }, { 
          onConflict: 'user_id,language_id' 
        }).select();

      if (error) {
        console.error("Error updating language progress:", error);
        throw error;
      }
      
      console.log("Language progress updated:", data);

      // Record activity with proper metrics update
      await trackLessonViewed(languageId, languageName, 'summary', true);
      console.log("Lesson viewed tracked");
      
      // Update user metrics directly for immediate feedback
      const { data: existingMetrics, error: fetchError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching metrics for direct update:', fetchError);
      } else if (existingMetrics) {
        // Update time metrics directly (15 minutes per summary)
        const updatedTime = (existingMetrics.total_time_spent || 0) + 15;
        const updatedCourses = (existingMetrics.course_completions || 0) + 1;
        
        await supabase
          .from('user_metrics')
          .update({ 
            total_time_spent: updatedTime,
            course_completions: updatedCourses,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingMetrics.id);
        
        console.log(`Direct metrics update: time=${updatedTime}, courses=${updatedCourses}`);
      } else {
        // Create new metrics entry if none exists
        await supabase
          .from('user_metrics')
          .insert({
            user_id: user.id,
            total_time_spent: 15,
            course_completions: 1,
            exercises_completed: 0
          });
        
        console.log("Created new metrics entry for summary read");
      }

      toast.success('Progress updated!');
      return true;
    } catch (error) {
      console.error('Error tracking summary read:', error);
      toast.error('Failed to update progress');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    trackSummaryRead,
    updating
  };
};
