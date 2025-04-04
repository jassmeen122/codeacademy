
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthState } from '../useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { useStudentActivity } from '../useStudentActivity';
import { checkAndAwardBadge } from '@/utils/badgeUtils';

export const useQuizProgress = () => {
  const [updating, setUpdating] = useState(false);
  const { user } = useAuthState();
  const { trackExerciseCompleted, updateUserMetrics } = useStudentActivity();

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

      // Record activity with score and update metrics
      console.log("Recording exercise completion");
      await trackExerciseCompleted(
        `quiz-${languageId}`, 
        languageName,
        score
      );

      // Always update exercise completion counter
      console.log("Updating exercise metrics");
      await updateUserMetrics(user.id, 'exercise', 1);
      
      // Always update time spent metrics when completing a quiz
      console.log("Updating time spent metrics");
      await updateUserMetrics(user.id, 'time', 30); // Assuming quiz takes about 30 min

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
