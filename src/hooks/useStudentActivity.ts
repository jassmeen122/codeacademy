
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "./useAuthState";
import { updateUserSkillsForActivity } from "@/utils/skillProgressUpdater";

export const useStudentActivity = () => {
  const { user } = useAuthState();

  const trackLessonViewed = async (lessonId: string, language?: string, topic?: string) => {
    if (!user) return;
    
    try {
      // Record the activity in the database with proper typing
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'lesson_viewed',
          activity_data: {
            lesson_id: lessonId,
            language,
            topic
          }
        });
        
      if (error) throw error;
      
      // Update related skills
      await updateUserSkillsForActivity(
        user.id, 
        'lesson_viewed',
        { language, topic }
      );
      
    } catch (error) {
      console.error("Error tracking lesson view:", error);
    }
  };
  
  const trackExerciseCompleted = async (exerciseId: string, language?: string, score?: number) => {
    if (!user) return;
    
    try {
      // Record the activity with proper typing
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'exercise_completed',
          activity_data: {
            exercise_id: exerciseId,
            language,
            score
          }
        });
        
      if (error) throw error;
      
      // Get current metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (!metricsError && metrics) {
        // If metrics exist, update them
        await supabase
          .from('user_metrics')
          .update({ 
            exercises_completed: (metrics.exercises_completed || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else if (metricsError.code === 'PGRST116') {
        // If no metrics record exists, create one
        await supabase
          .from('user_metrics')
          .insert({
            user_id: user.id,
            exercises_completed: 1,
            course_completions: 0,
            total_time_spent: 0,
            last_login: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
      
      // Update skills based on the exercise completed
      await updateUserSkillsForActivity(
        user.id,
        'exercise_completed',
        { 
          language,
          progressIncrement: score ? Math.round(score / 10) : undefined // Higher score = more skill progress
        }
      );
      
    } catch (error) {
      console.error("Error tracking exercise completion:", error);
    }
  };
  
  const trackCourseCompleted = async (courseId: string, language?: string, category?: string) => {
    if (!user) return;
    
    try {
      // Record the activity with proper typing
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'course_completed',
          activity_data: {
            course_id: courseId,
            language,
            category
          }
        });
        
      if (error) throw error;
      
      // Get current metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (!metricsError && metrics) {
        // If metrics exist, update them
        await supabase
          .from('user_metrics')
          .update({ 
            course_completions: (metrics.course_completions || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else if (metricsError?.code === 'PGRST116') {
        // If no metrics record exists, create one
        await supabase
          .from('user_metrics')
          .insert({
            user_id: user.id,
            course_completions: 1,
            exercises_completed: 0,
            total_time_spent: 0,
            last_login: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
      
      // Add points to the user's profile
      if (user.id) {
        await supabase
          .from('profiles')
          .update({ points: (user.points || 0) + 100 })
          .eq('id', user.id);
      }
      
      // Update skills based on the course completed
      await updateUserSkillsForActivity(
        user.id,
        'course_completed',
        { language, topic: category }
      );
      
    } catch (error) {
      console.error("Error tracking course completion:", error);
    }
  };
  
  return {
    trackLessonViewed,
    trackExerciseCompleted,
    trackCourseCompleted
  };
};
