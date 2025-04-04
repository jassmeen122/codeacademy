
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
  
  // Improved function to update user metrics with direct DB operations and retry logic
  const updateUserMetrics = useCallback(async (type: 'course' | 'exercise' | 'time', value: number = 1) => {
    if (!user) {
      toast.error('You need to be logged in to track progress');
      return false;
    }
    
    setUpdating(true);
    let attempts = 0;
    const maxAttempts = 3;
    
    try {
      console.log(`Direct metrics update: type=${type}, value=${value}, userId=${user.id}`);
      
      while (attempts < maxAttempts) {
        attempts++;
        
        // First check if metrics exist with specific field selection
        const { data: existingMetrics, error: fetchError } = await supabase
          .from('user_metrics')
          .select('id, user_id, course_completions, exercises_completed, total_time_spent, last_login, created_at, updated_at')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error(`Error fetching user metrics (attempt ${attempts}):`, fetchError);
          // Wait a moment before retrying
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500));
            continue;
          }
          return false;
        }
        
        if (existingMetrics) {
          console.log(`Found existing metrics for update: ID=${existingMetrics.id}`);
          
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
            console.error(`Error updating metrics (attempt ${attempts}):`, updateError);
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 500));
              continue;
            }
            return false;
          }
          
          console.log("Metrics updated successfully:", type, updateData);
          return true;
        } else {
          console.log("No existing metrics found, creating new entry");
          
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
          
          const { data: insertData, error: insertError } = await supabase
            .from('user_metrics')
            .insert([newMetrics])
            .select('*');
            
          if (insertError) {
            console.error(`Error creating metrics (attempt ${attempts}):`, insertError);
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 500));
              continue;
            }
            return false;
          }
          
          console.log("New metrics created successfully:", insertData);
          return true;
        }
      }
      
      // If we reach here, all attempts failed
      toast.error('Could not update progress after multiple attempts');
      return false;
      
    } catch (error) {
      console.error('Error in updateUserMetrics:', error);
      toast.error('Failed to update your progress');
      return false;
    } finally {
      setUpdating(false);
    }
  }, [user]);
  
  // Add a simple test function to manually update metrics
  const testUpdateMetrics = useCallback(async () => {
    if (!user) {
      toast.error('You need to be logged in to track progress');
      return;
    }
    
    // Update each metric type
    const courseResult = await updateUserMetrics('course', 1);
    const exerciseResult = await updateUserMetrics('exercise', 1);
    const timeResult = await updateUserMetrics('time', 15);
    
    if (courseResult && exerciseResult && timeResult) {
      toast.success('Test metrics updated successfully!');
    } else {
      toast.error('Some metrics updates failed');
    }
  }, [user, updateUserMetrics]);
  
  // Determine if any tracking operation is in progress
  const isUpdating = summaryUpdating || quizUpdating || videoUpdating || updating;

  return {
    trackSummaryRead,
    trackQuizCompletion,
    trackVideoProgress,
    updateUserMetrics,
    testUpdateMetrics, // Add test function for debugging
    updating: isUpdating
  };
};
