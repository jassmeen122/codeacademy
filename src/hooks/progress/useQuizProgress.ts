
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

      if (error) throw error;

      // Check if the user passed and deserves a badge
      if (isPassed && user.id) {
        await checkAndAwardBadge(user.id, languageId);
      }

      // Record activity with score
      await trackExerciseCompleted(
        `quiz-${languageId}`, 
        languageName,
        score
      );

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
