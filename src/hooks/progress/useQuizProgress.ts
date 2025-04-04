
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthState } from '../useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { useStudentActivity } from '../useStudentActivity';
import { checkAndAwardBadge } from '@/utils/badgeUtils';

export const useQuizProgress = () => {
  const [updating, setUpdating] = useState(false);
  const { user } = useAuthState();
  const { trackExerciseCompleted } = useStudentActivity();

  // Track quiz completion progress
  const trackQuizCompletion = async (
    languageId: string, 
    languageName: string, 
    isPassed: boolean, 
    score: number
  ) => {
    if (!user) {
      toast.error('Please log in to track your progress');
      return false;
    }

    try {
      setUpdating(true);
      console.log(`Tracking quiz completion: language=${languageId}, name=${languageName}, passed=${isPassed}, score=${score}`);

      // Update language progress
      const { error } = await supabase
        .from('user_language_progress')
        .upsert({
          user_id: user.id,
          language_id: languageId,
          quiz_completed: isPassed,
          last_updated: new Date().toISOString()
        }, { 
          onConflict: 'user_id,language_id' 
        });

      if (error) {
        console.error("Error updating language progress:", error);
        throw error;
      }
      
      console.log("Quiz completion recorded in language progress");

      // Check if the user passed and deserves a badge
      if (isPassed && user.id) {
        console.log("Quiz passed, checking for badge award");
        await checkAndAwardBadge(user.id, languageId);
      }

      // Record activity with score
      console.log("Recording exercise completion");
      await trackExerciseCompleted(
        `quiz-${languageId}`, 
        languageName,
        score
      );

      // DIRECT METRICS UPDATE: Regardless of other function behavior
      console.log("Directly updating user metrics for quiz completion");
      
      // Directly update user metrics for exercises and time
      const { data: existingMetrics, error: fetchError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching metrics for direct quiz update:', fetchError);
      }
      
      // Check if metrics exist and update or create them
      if (existingMetrics) {
        // Update exercise metrics
        const updatedExercises = (existingMetrics.exercises_completed || 0) + 1;
        const updatedTime = (existingMetrics.total_time_spent || 0) + 30;
        
        const { error: updateError } = await supabase
          .from('user_metrics')
          .update({ 
            exercises_completed: updatedExercises,
            total_time_spent: updatedTime,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingMetrics.id);
        
        console.log(`Direct quiz metrics update: exercises=${updatedExercises}, time=${updatedTime}`);
        
        if (updateError) {
          console.error('Error updating quiz metrics:', updateError);
        }
      } else {
        // Create new metrics entry if none exists
        const { error: insertError } = await supabase
          .from('user_metrics')
          .insert({
            user_id: user.id,
            exercises_completed: 1,
            total_time_spent: 30,
            course_completions: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (insertError) {
          console.error('Error creating quiz metrics:', insertError);
        } else {
          console.log("Created new metrics entry for quiz completion");
        }
      }

      toast.success(isPassed ? 'Quiz passed! Progress updated!' : 'Quiz completed! Keep practicing!');
      return true;
    } catch (error) {
      console.error('Error tracking quiz completion:', error);
      toast.error('Failed to update progress');
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
