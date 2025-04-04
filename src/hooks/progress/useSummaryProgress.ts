
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthState } from '../useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { useStudentActivity } from '../useStudentActivity';

export const useSummaryProgress = () => {
  const [updating, setUpdating] = useState(false);
  const { user } = useAuthState();
  const { trackLessonViewed } = useStudentActivity();

  // Track summary read progress with direct metrics update
  const trackSummaryRead = async (languageId: string, languageName: string) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour suivre votre progression');
      return false;
    }

    try {
      setUpdating(true);
      console.log(`Tracking summary read: language=${languageId}, name=${languageName}`);

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
          await trackLessonViewed(languageId, languageName, 'summary', true);
          toast.success('Progression enregistrée pour l\'activité uniquement');
          return true;
        }
      }

      // Update language progress with valid UUID
      const { error } = await supabase
        .from('user_language_progress')
        .upsert({
          user_id: user.id,
          language_id: validLanguageId,
          summary_read: true,
          last_updated: new Date().toISOString()
        }, { 
          onConflict: 'user_id,language_id' 
        });

      if (error) {
        console.error("Error updating language progress:", error);
        throw error;
      }
      
      console.log("Language progress updated successfully");

      // Record activity
      await trackLessonViewed(languageId, languageName, 'summary', true);
      
      // DIRECT METRICS UPDATE: Update courses completed
      console.log("Directly updating user metrics for summary read");
      
      const { data: existingMetrics, error: fetchError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching metrics for direct update:', fetchError);
      }
      
      // Check if metrics exist and update or create them
      if (existingMetrics) {
        const updatedCourses = (existingMetrics.course_completions || 0) + 1;
        
        const { error: updateError } = await supabase
          .from('user_metrics')
          .update({ 
            course_completions: updatedCourses,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingMetrics.id);
        
        console.log(`Direct metrics update: courses=${updatedCourses}`);
        
        if (updateError) {
          console.error('Error updating metrics:', updateError);
        }
      } else {
        // Create new metrics entry if none exists
        const { error: insertError } = await supabase
          .from('user_metrics')
          .insert({
            user_id: user.id,
            course_completions: 1,
            exercises_completed: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (insertError) {
          console.error('Error creating metrics:', insertError);
        } else {
          console.log("Created new metrics entry for summary read");
        }
      }

      // Affichage motivant avec un conseil personnalisé
      toast.success('🎉 Résumé terminé! +1 point pour votre parcours d\'apprentissage!');
      setTimeout(() => {
        const tips = [
          "Essayez de répondre au quiz maintenant pour renforcer vos connaissances! 🧠",
          "Pratiquer des exercices sur ce sujet vous aidera à consolider vos acquis! 💪",
          "Créer un petit projet avec ces connaissances est une excellente façon d'apprendre! 🛠️",
          "Expliquez ce concept à quelqu'un d'autre pour vraiment le maîtriser! 🗣️"
        ];
        toast.info(`Conseil: ${tips[Math.floor(Math.random() * tips.length)]}`);
      }, 1500);
      
      return true;
    } catch (error) {
      console.error('Error tracking summary read:', error);
      toast.error('Impossible de mettre à jour votre progression');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    trackSummaryRead,
    updating
  };
};
