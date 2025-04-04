
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
  
  // More robust function to update user metrics with better error handling and consistency checks
  const updateUserMetrics = useCallback(async (type: 'course' | 'exercise' | 'time', value: number = 1) => {
    if (!user) {
      toast.error('You need to be logged in to track progress');
      return false;
    }
    
    setUpdating(true);
    
    try {
      console.log(`Updating metrics: type=${type}, value=${value}, userId=${user.id}`);
      
      // First check if metrics exist at all for the user
      const { data: metricsExists, error: checkError } = await supabase
        .from('user_metrics')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (checkError) {
        console.error('Error checking metrics existence:', checkError);
        throw checkError;
      }
      
      // If metrics don't exist, create a new record
      if (!metricsExists || metricsExists.length === 0) {
        console.log('No metrics found, creating new record');
        
        const newMetricsData = {
          user_id: user.id,
          course_completions: type === 'course' ? value : 0,
          exercises_completed: type === 'exercise' ? value : 0,
          total_time_spent: type === 'time' ? value : 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { data: insertResult, error: insertError } = await supabase
          .from('user_metrics')
          .insert([newMetricsData])
          .select('*');
          
        if (insertError) {
          console.error('Error creating new metrics:', insertError);
          throw insertError;
        }
        
        console.log('Created new metrics record:', insertResult);
        toast.success('Progress recorded!');
        return true;
      }
      
      // If metrics exist, get the full record by ID to update
      const metricsId = metricsExists[0].id;
      console.log(`Found existing metrics with ID: ${metricsId}`);
      
      const { data: currentMetrics, error: fetchError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('id', metricsId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching current metrics:', fetchError);
        throw fetchError;
      }
      
      // Prepare update data based on the metric type
      const updateData: any = { updated_at: new Date().toISOString() };
      
      if (type === 'course') {
        updateData.course_completions = (currentMetrics.course_completions || 0) + value;
      } else if (type === 'exercise') {
        updateData.exercises_completed = (currentMetrics.exercises_completed || 0) + value;
      } else if (type === 'time') {
        updateData.total_time_spent = (currentMetrics.total_time_spent || 0) + value;
      }
      
      console.log('Updating metrics with:', updateData);
      
      // Update the metrics by ID for precision
      const { error: updateError } = await supabase
        .from('user_metrics')
        .update(updateData)
        .eq('id', metricsId);
      
      if (updateError) {
        console.error('Error updating metrics:', updateError);
        throw updateError;
      }
      
      console.log('Successfully updated metrics');
      toast.success('Progress updated!');
      return true;
      
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
    testUpdateMetrics,
    updating: isUpdating
  };
};
