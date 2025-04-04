
import { useQuizProgress } from './progress/useQuizProgress';
import { useSummaryProgress } from './progress/useSummaryProgress';
import { useVideoProgress } from './progress/useVideoProgress';
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { toast } from 'sonner';

export const useProgressTracking = () => {
  const { trackSummaryRead, updating: summaryUpdating } = useSummaryProgress();
  const { trackQuizCompletion, updating: quizUpdating } = useQuizProgress();
  const { trackVideoProgress, updating: videoUpdating } = useVideoProgress();
  const [updating, setUpdating] = useState(false);
  const { user } = useAuthState();
  
  // Improved function to update user metrics with direct DB operations
  const updateUserMetrics = useCallback(async (type: 'course' | 'exercise' | 'time', value: number = 1) => {
    if (!user) {
      toast.error('You need to be logged in to track progress');
      return false;
    }
    
    setUpdating(true);
    try {
      console.log(`Direct metrics update: type=${type}, value=${value}, userId=${user.id}`);
      
      // First check if metrics exist
      const { data: existingMetrics, error: fetchError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user metrics:', fetchError);
        return false;
      }
      
      if (existingMetrics) {
        // Update existing metrics with direct DB operation
        const updateData: any = {
          updated_at: new Date().toISOString()
        };
        
        if (type === 'course') {
          updateData.course_completions = (existingMetrics.course_completions || 0) + value;
        } else if (type === 'exercise') {
          updateData.exercises_completed = (existingMetrics.exercises_completed || 0) + value;
        } else if (type === 'time') {
          updateData.total_time_spent = (existingMetrics.total_time_spent || 0) + value;
        }
        
        console.log("Updating metrics with:", updateData);
        
        const { error: updateError } = await supabase
          .from('user_metrics')
          .update(updateData)
          .eq('id', existingMetrics.id);
          
        if (updateError) {
          console.error('Error updating metrics:', updateError);
          return false;
        }
        
        console.log("Metrics updated successfully");
      } else {
        // Create new metrics for first-time users
        const newMetrics = {
          user_id: user.id,
          course_completions: type === 'course' ? value : 0,
          exercises_completed: type === 'exercise' ? value : 0,
          total_time_spent: type === 'time' ? value : 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        console.log("Creating new metrics:", newMetrics);
        
        const { error: insertError } = await supabase
          .from('user_metrics')
          .insert([newMetrics]);
          
        if (insertError) {
          console.error('Error creating metrics:', insertError);
          return false;
        }
        
        console.log("New metrics created successfully");
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateUserMetrics:', error);
      toast.error('Failed to update your progress');
      return false;
    } finally {
      setUpdating(false);
    }
  }, [user]);
  
  // Determine if any tracking operation is in progress
  const isUpdating = summaryUpdating || quizUpdating || videoUpdating || updating;

  return {
    trackSummaryRead,
    trackQuizCompletion,
    trackVideoProgress,
    updateUserMetrics,
    updating: isUpdating
  };
};
