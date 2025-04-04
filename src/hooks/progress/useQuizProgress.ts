
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
      toast.error('Veuillez vous connecter pour suivre votre progression');
      return false;
    }

    try {
      setUpdating(true);
      console.log(`Tracking quiz completion: language=${languageId}, name=${languageName}, passed=${isPassed}, score=${score}`);

      // Check if languageId is a valid UUID or a shorthand code
      let validLanguageId = languageId;
      
      // If it's not a UUID format, try to find the corresponding language in the database
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(languageId)) {
        // Try to find the language by name or shortcode
        const { data: languageData, error: langError } = await supabase
          .from('programming_languages')
          .select('id')
          .or(`name.ilike.${languageName},name.ilike.${languageId}`)
          .maybeSingle();
        
        if (langError) {
          console.error("Error finding language:", langError);
          throw new Error(`Could not find a valid language ID for ${languageName}`);
        }
        
        if (languageData) {
          validLanguageId = languageData.id;
          console.log(`Found valid language ID: ${validLanguageId} for ${languageName}`);
        } else {
          console.warn(`No valid UUID found for language: ${languageId}, using as-is for activity tracking only`);
          // Skip database update that requires UUID but continue with activity tracking
          await trackExerciseCompleted(
            `quiz-${languageId}`, 
            languageName,
            score
          );
          toast.success('Quiz terminé! Progrès enregistré');
          return true;
        }
      }

      // Update language progress with valid UUID
      const { error } = await supabase
        .from('user_language_progress')
        .upsert({
          user_id: user.id,
          language_id: validLanguageId,
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
        await checkAndAwardBadge(user.id, validLanguageId);
      }

      // Record activity with score
      console.log("Recording exercise completion");
      await trackExerciseCompleted(
        `quiz-${languageId}`, 
        languageName,
        score
      );

      // DIRECT METRICS UPDATE: Update exercise count
      console.log("Directly updating user metrics for quiz completion");
      
      // Directly update user metrics for exercises
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
        
        const { error: updateError } = await supabase
          .from('user_metrics')
          .update({ 
            exercises_completed: updatedExercises,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingMetrics.id);
        
        console.log(`Direct quiz metrics update: exercises=${updatedExercises}`);
        
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

      // Afficher des messages motivants et des conseils
      toast.success(isPassed 
        ? '🎯 Quiz réussi! +1 point pour votre parcours d\'apprentissage!' 
        : '📝 Quiz terminé! Continuez à pratiquer pour vous améliorer!');
      
      // Afficher un conseil personnalisé après un délai
      setTimeout(() => {
        const tips = [
          "Essayez de refaire ce quiz dans quelques jours pour consolider vos connaissances! 🔄",
          "Pratiquez des exercices liés à ces concepts pour approfondir votre compréhension! 💪",
          "Expliquez ces concepts à quelqu'un d'autre pour mieux les retenir! 🗣️",
          "Créez un petit projet utilisant ces connaissances pour les appliquer concrètement! 🛠️"
        ];
        toast.info(`Conseil: ${tips[Math.floor(Math.random() * tips.length)]}`);
      }, 1500);
      
      return true;
    } catch (error) {
      console.error('Error tracking quiz completion:', error);
      toast.error('Impossible de mettre à jour votre progression');
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
