
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "./useAuthState";
import { updateUserSkillsForActivity } from "@/utils/skillProgressUpdater";

export const useStudentActivity = () => {
  const { user } = useAuthState();

  const trackLessonViewed = async (lessonId: string, language?: string, topic?: string) => {
    if (!user) return;
    
    try {
      // Record the activity in the database
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
      // Record the activity
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
      
      // Update user metrics
      await supabase.rpc('increment_user_metric', {
        user_id_param: user.id,
        metric_name: 'exercises_completed',
        increment_value: 1
      });
      
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
      // Record the activity
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
      
      // Update user metrics
      await supabase.rpc('increment_user_metric', {
        user_id_param: user.id,
        metric_name: 'course_completions',
        increment_value: 1
      });
      
      // Add points to the user's profile
      await supabase
        .from('profiles')
        .update({ points: (user.points || 0) + 100 })
        .eq('id', user.id);
      
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
