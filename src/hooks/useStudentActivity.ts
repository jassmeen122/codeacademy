
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "./useAuthState";
import { updateUserSkillsForActivity } from "@/utils/skillProgressUpdater";

export const useStudentActivity = () => {
  const { user } = useAuthState();

  const trackLessonViewed = async (lessonId: string, language?: string, topic?: string, updateMetrics: boolean = false) => {
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
            topic,
            timestamp: new Date().toISOString()
          }
        });
        
      if (error) throw error;
      
      // Update related skills
      await updateUserSkillsForActivity(
        user.id, 
        'lesson_viewed',
        { language, topic }
      );
      
      // Update user metrics
      if (updateMetrics) {
        await updateUserMetrics(user.id);
      }
    } catch (error) {
      console.error("Error tracking lesson view:", error);
    }
  };
  
  const trackExerciseCompleted = async (exerciseId: string, language?: string, score?: number) => {
    if (!user) return;
    
    try {
      // Record the activity with timestamp
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'exercise_completed',
          activity_data: {
            exercise_id: exerciseId,
            language,
            score,
            timestamp: new Date().toISOString()
          }
        });
        
      if (error) throw error;
      
      // Update metrics
      await updateUserMetrics(user.id, 'exercise');
      
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
      // Record the activity with timestamp
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'course_completed',
          activity_data: {
            course_id: courseId,
            language,
            category,
            timestamp: new Date().toISOString()
          }
        });
        
      if (error) throw error;
      
      // Update metrics
      await updateUserMetrics(user.id, 'course');
      
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
  
  // Helper function to update user metrics
  const updateUserMetrics = async (userId: string, type: 'course' | 'exercise' | 'time' = 'time', value: number = 15) => {
    try {
      // First check if metrics exist for user
      const { data, error: fetchError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user metrics:', fetchError);
        return;
      }
      
      if (data) {
        // Update existing metrics
        const updateData: any = { updated_at: new Date().toISOString() };
        
        if (type === 'course') {
          updateData.course_completions = (data.course_completions || 0) + 1;
        } else if (type === 'exercise') {
          updateData.exercises_completed = (data.exercises_completed || 0) + 1;
        } else if (type === 'time') {
          updateData.total_time_spent = (data.total_time_spent || 0) + value;
        }
        
        await supabase
          .from('user_metrics')
          .update(updateData)
          .eq('id', data.id);
      } else {
        // Create new metrics entry
        const newMetrics: any = {
          user_id: userId,
          course_completions: type === 'course' ? 1 : 0,
          exercises_completed: type === 'exercise' ? 1 : 0,
          total_time_spent: type === 'time' ? value : 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        await supabase
          .from('user_metrics')
          .insert([newMetrics]);
      }
    } catch (err) {
      console.error('Error updating user metrics:', err);
    }
  };
  
  return {
    trackLessonViewed,
    trackExerciseCompleted,
    trackCourseCompleted,
    updateUserMetrics
  };
};
