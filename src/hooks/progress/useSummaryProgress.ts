
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
      toast.error('Please log in to track your progress');
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
          toast.success('Progress tracked for activity only');
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
      
      // DIRECT METRICS UPDATE: Guaranteed to work regardless of other functions
      console.log("Directly updating user metrics for summary read");
      
      // Update time metrics directly (15 minutes per summary)
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
        const updatedTime = (existingMetrics.total_time_spent || 0) + 15;
        const updatedCourses = (existingMetrics.course_completions || 0) + 1;
        
        const { error: updateError } = await supabase
          .from('user_metrics')
          .update({ 
            total_time_spent: updatedTime,
            course_completions: updatedCourses,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingMetrics.id);
        
        console.log(`Direct metrics update: time=${updatedTime}, courses=${updatedCourses}`);
        
        if (updateError) {
          console.error('Error updating metrics:', updateError);
        }
      } else {
        // Create new metrics entry if none exists
        const { error: insertError } = await supabase
          .from('user_metrics')
          .insert({
            user_id: user.id,
            total_time_spent: 15,
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

      toast.success('Progress updated!');
      return true;
    } catch (error) {
      console.error('Error tracking summary read:', error);
      toast.error('Failed to update progress');
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
