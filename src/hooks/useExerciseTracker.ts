
import { useState } from 'react';
import { useStudentActivity } from './useStudentActivity';
import { useProgressTracking } from './useProgressTracking';
import { toast } from 'sonner';
import { ExerciseUI } from '@/types/exerciseUI';
import { ProgrammingLanguage } from '@/components/CodeEditor/types';

export const useExerciseTracker = () => {
  const [submitting, setSubmitting] = useState(false);
  const { trackExerciseCompleted } = useStudentActivity();
  const { updateUserMetrics } = useProgressTracking();

  const completeExercise = async (
    exercise: ExerciseUI, 
    language?: ProgrammingLanguage,
    score?: number
  ) => {
    if (submitting) return { success: false };
    
    setSubmitting(true);
    let success = false;
    
    try {
      console.log(`Completing exercise: ${exercise.id}, language: ${language}`);
      
      // First, track the exercise activity
      const activityTracked = await trackExerciseCompleted(
        exercise.id, 
        language || exercise.language, 
        score
      );
      
      // Then update metrics directly for immediate UI feedback
      const metricsUpdated = await updateUserMetrics('exercise', 1);
      
      success = activityTracked && metricsUpdated;
      
      if (success) {
        console.log('✅ Exercise completed and metrics updated');
        // Show different motivational messages randomly
        const messages = [
          'Bravo! Exercice complété avec succès! 🎉',
          'Excellente logique! Vous progressez bien! 💪',
          'Quelle réussite! Continuez comme ça! 🌟',
          'Parfait! Votre compétence s\'améliore! 📈',
          'Code correct! Un pas de plus vers la maîtrise! 🚀'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        toast.success(randomMessage);
      } else {
        console.error('❌ Error completing exercise');
        toast.error('Un problème est survenu lors de la sauvegarde de votre progrès');
      }
    } catch (error) {
      console.error('Error completing exercise:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
    
    return { success, submitting };
  };

  return {
    completeExercise,
    submitting
  };
};
