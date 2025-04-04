
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
  
  // Simplified function to update user metrics with better error handling
  const updateUserMetrics = useCallback(async (type: 'course' | 'exercise' | 'time', value: number = 1) => {
    if (!user) {
      toast.error('You need to be logged in to track progress');
      return false;
    }
    
    setUpdating(true);
    
    try {
      console.log(`🎯 Updating metrics: type=${type}, value=${value}`);
      
      // First, get current metrics or create if not exists
      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      // If no metrics exist yet, create a new record with the update
      if (!data) {
        console.log('📊 Creating new metrics record');
        
        const newMetricsData = {
          user_id: user.id,
          course_completions: type === 'course' ? value : 0,
          exercises_completed: type === 'exercise' ? value : 0,
          total_time_spent: type === 'time' ? value : 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error: insertError } = await supabase
          .from('user_metrics')
          .insert([newMetricsData]);
          
        if (insertError) {
          throw insertError;
        }
        
        console.log('✅ Created new metrics record');
        toast.success('Progress recorded! 🎉');
        return true;
      }
      
      // If metrics exist, update the appropriate field
      const updateData: any = { 
        updated_at: new Date().toISOString() 
      };
      
      if (type === 'course') {
        updateData.course_completions = (data.course_completions || 0) + value;
      } else if (type === 'exercise') {
        updateData.exercises_completed = (data.exercises_completed || 0) + value;
      } else if (type === 'time') {
        updateData.total_time_spent = (data.total_time_spent || 0) + value;
      }
      
      console.log('📝 Updating metrics with:', updateData);
      
      const { error: updateError } = await supabase
        .from('user_metrics')
        .update(updateData)
        .eq('user_id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      console.log('✅ Successfully updated metrics');
      toast.success('Progress updated! 🎉');
      return true;
      
    } catch (error) {
      console.error('❌ Error in updateUserMetrics:', error);
      toast.error('Failed to update your progress');
      return false;
    } finally {
      setUpdating(false);
    }
  }, [user]);
  
  // Simple test function
  const testUpdateMetrics = useCallback(async () => {
    if (!user) {
      toast.error('You need to be logged in');
      return;
    }
    
    // Update exercise count
    const result = await updateUserMetrics('exercise', 1);
    
    if (result) {
      toast.success('Test exercise completion recorded! 🎮');
    }
  }, [user, updateUserMetrics]);
  
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
