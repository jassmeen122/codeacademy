
import { useState, useCallback } from 'react';
import { useVideoProgress } from './progress/useVideoProgress';
import { useQuizProgress } from './progress/useQuizProgress';
import { useSummaryProgress } from './progress/useSummaryProgress';
import { useAuthState } from './useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProgressTracking = () => {
  const [updating, setUpdating] = useState(false);
  const { user } = useAuthState();
  const videoProgress = useVideoProgress();
  const quizProgress = useQuizProgress();
  const summaryProgress = useSummaryProgress();

  const trackVideoProgress = async (
    courseId: string, 
    language: string, 
    progress: number, 
    completed: boolean
  ) => {
    console.log('Track video progress called', { courseId, language, progress, completed });
    setUpdating(true);
    
    try {
      // Use the video progress hook implementation
      const result = await videoProgress.trackVideoProgress(courseId, language, progress, completed);
      
      // Update the overall metrics if completed
      if (completed && progress > 0.8) {
        await updateUserMetrics('time', Math.round(progress * 30)); // Estimate time spent in minutes
      }
      
      setUpdating(false);
      return result;
    } catch (error) {
      console.error('Error tracking video progress:', error);
      setUpdating(false);
      return false;
    }
  };

  const trackQuizCompletion = async (
    languageId: string,
    language: string, 
    passed: boolean, 
    score: number
  ) => {
    console.log('Track quiz completion called', { languageId, language, passed, score });
    setUpdating(true);
    
    try {
      // Use the quiz progress hook implementation
      const result = await quizProgress.trackQuizCompletion(languageId, language, passed, score);
      
      // Update the overall metrics if passed
      if (passed) {
        await updateUserMetrics('exercise', 1);
      }
      
      setUpdating(false);
      return result;
    } catch (error) {
      console.error('Error tracking quiz completion:', error);
      setUpdating(false);
      return false;
    }
  };

  const trackSummaryRead = async (
    languageId: string,
    title: string
  ) => {
    console.log('Track summary read called', { languageId, title });
    setUpdating(true);
    
    try {
      // Use the summary progress hook implementation
      const result = await summaryProgress.trackSummaryRead(languageId, title);
      
      // Update time spent metrics
      await updateUserMetrics('time', 10); // Assume reading takes about 10 minutes
      
      setUpdating(false);
      return result;
    } catch (error) {
      console.error('Error tracking summary read:', error);
      setUpdating(false);
      return false;
    }
  };

  const trackExerciseCompletion = async (
    exerciseId: string,
    language: string,
    score: number,
    timeSpent: number
  ) => {
    console.log('Track exercise completion called', { exerciseId, language, score, timeSpent });
    setUpdating(true);
    
    try {
      if (!user) {
        console.error('User not authenticated');
        setUpdating(false);
        return false;
      }
      
      // Record the exercise completion
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'exercise_completed',
          activity_data: {
            exercise_id: exerciseId,
            language,
            score,
            time_spent: timeSpent,
            timestamp: new Date().toISOString()
          }
        });
        
      if (error) {
        throw error;
      }
      
      // Update the metrics
      await updateUserMetrics('exercise', 1);
      
      // Update time metrics if provided
      if (timeSpent) {
        await updateUserMetrics('time', timeSpent);
      }
      
      setUpdating(false);
      return true;
    } catch (error) {
      console.error('Error tracking exercise completion:', error);
      setUpdating(false);
      return false;
    }
  };

  const trackCourseCompletion = async (courseId: string, language: string) => {
    console.log('Track course completion called', { courseId, language });
    setUpdating(true);
    
    try {
      if (!user) {
        console.error('User not authenticated');
        setUpdating(false);
        return false;
      }
      
      // Record the course completion
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'course_completed',
          activity_data: {
            course_id: courseId,
            language,
            timestamp: new Date().toISOString()
          }
        });
        
      if (error) {
        throw error;
      }
      
      // Update the course completion metrics
      await updateUserMetrics('course', 1);
      
      setUpdating(false);
      return true;
    } catch (error) {
      console.error('Error tracking course completion:', error);
      setUpdating(false);
      return false;
    }
  };

  const updateUserMetrics = useCallback(async (type: string, value: number) => {
    if (!user) return false;
    
    try {
      console.log(`Updating user metrics: userId=${user.id}, type=${type}, value=${value}`);
      setUpdating(true);
      
      // First check if metrics exist for user
      const { data: existingMetrics, error: fetchError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user metrics:', fetchError);
        setUpdating(false);
        return false;
      }
      
      if (existingMetrics) {
        console.log("Existing metrics found, updating...");
        
        // Prepare update data
        let updateData: any = { 
          updated_at: new Date().toISOString() 
        };
        
        if (type === 'course') {
          updateData.course_completions = (existingMetrics.course_completions || 0) + value;
        } else if (type === 'exercise') {
          updateData.exercises_completed = (existingMetrics.exercises_completed || 0) + value;
        } else if (type === 'time') {
          updateData.total_time_spent = (existingMetrics.total_time_spent || 0) + value;
        }
        
        // Directly update the record
        const { error: updateError } = await supabase
          .from('user_metrics')
          .update(updateData)
          .eq('id', existingMetrics.id);
          
        if (updateError) {
          console.error('Error updating metrics:', updateError);
          setUpdating(false);
          return false;
        }
      } else {
        console.log("No existing metrics found, creating new entry...");
        
        // Create new metrics entry
        const newMetrics: any = {
          user_id: user.id,
          course_completions: type === 'course' ? value : 0,
          exercises_completed: type === 'exercise' ? value : 0,
          total_time_spent: type === 'time' ? value : 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error: insertError } = await supabase
          .from('user_metrics')
          .insert([newMetrics]);
          
        if (insertError) {
          console.error('Error inserting metrics:', insertError);
          setUpdating(false);
          return false;
        }
      }
      
      setUpdating(false);
      return true;
    } catch (err) {
      console.error('Error updating user metrics:', err);
      setUpdating(false);
      return false;
    }
  }, [user]);

  // Method used for testing/debugging progress updates
  const testUpdateMetrics = async (type: string, value: number) => {
    if (!user) {
      toast.error("You need to be logged in to update metrics");
      return false;
    }
    
    setUpdating(true);
    console.log(`Test update metrics called for ${type}: ${value}`);
    
    try {
      const result = await updateUserMetrics(type, value);
      if (result) {
        toast.success(`Successfully updated ${type} metrics (+${value})`);
      }
      return result;
    } catch (error) {
      console.error('Error in test metrics update:', error);
      toast.error("Failed to update metrics");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    trackVideoProgress,
    trackQuizCompletion,
    trackSummaryRead,
    trackExerciseCompletion,
    trackCourseCompletion,
    updateUserMetrics,
    testUpdateMetrics,
    updating
  };
};
