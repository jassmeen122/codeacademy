
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "./useAuthState";
import { updateUserSkillsForActivity } from "@/utils/skillProgressUpdater";
import { toast } from "sonner";

export const useStudentActivity = () => {
  const { user } = useAuthState();

  const trackLessonViewed = async (lessonId: string, language?: string, topic?: string, updateMetrics: boolean = false) => {
    if (!user) return false;
    
    try {
      console.log(`Tracking lesson viewed: ${lessonId}, language: ${language}, topic: ${topic}`);
      
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
        
      if (error) {
        console.error("Error inserting activity:", error);
        throw error;
      }
      
      console.log("Activity recorded successfully");
      
      // Update related skills
      await updateUserSkillsForActivity(
        user.id, 
        'lesson_viewed',
        { language, topic }
      );
      
      // Update user metrics if needed
      if (updateMetrics) {
        await updateUserMetrics(user.id, 'time', 15);
        console.log("User metrics updated");
      }
      
      return true;
    } catch (error) {
      console.error("Error tracking lesson view:", error);
      return false;
    }
  };
  
  const trackExerciseCompleted = async (exerciseId: string, language?: string, score?: number) => {
    if (!user) return false;
    
    try {
      console.log(`Tracking exercise completed: ${exerciseId}, language: ${language}, score: ${score}`);
      
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
        
      if (error) {
        console.error("Error inserting activity:", error);
        throw error;
      }
      
      console.log("Exercise completion recorded successfully");
      
      // Update metrics
      await updateUserMetrics(user.id, 'exercise', 1);
      
      // Update skills based on the exercise completed
      await updateUserSkillsForActivity(
        user.id,
        'exercise_completed',
        { 
          language,
          progressIncrement: score ? Math.round(score / 10) : undefined // Higher score = more skill progress
        }
      );
      
      return true;
    } catch (error) {
      console.error("Error tracking exercise completion:", error);
      return false;
    }
  };
  
  const trackCourseCompleted = async (courseId: string, language?: string, category?: string) => {
    if (!user) return false;
    
    try {
      console.log(`Tracking course completed: ${courseId}, language: ${language}, category: ${category}`);
      
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
        
      if (error) {
        console.error("Error inserting activity:", error);
        throw error;
      }
      
      console.log("Course completion recorded successfully");
      
      // Update metrics
      await updateUserMetrics(user.id, 'course', 1);
      
      // Add points to the user's profile
      if (user.id) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('points')
            .eq('id', user.id)
            .single();
            
          if (profileError) throw profileError;
          
          const currentPoints = profile?.points || 0;
          const newPoints = currentPoints + 100;
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ points: newPoints })
            .eq('id', user.id);
            
          if (updateError) throw updateError;
          
          console.log(`Updated user points to ${newPoints}`);
        } catch (pointsError) {
          console.error("Error updating points:", pointsError);
        }
      }
      
      // Update skills based on the course completed
      await updateUserSkillsForActivity(
        user.id,
        'course_completed',
        { language, topic: category }
      );
      
      return true;
    } catch (error) {
      console.error("Error tracking course completion:", error);
      return false;
    }
  };
  
  // Helper function to update user metrics
  const updateUserMetrics = async (userId: string, type: 'course' | 'exercise' | 'time' = 'time', value: number = 15) => {
    try {
      console.log(`Updating user metrics: userId=${userId}, type=${type}, value=${value}`);
      
      // First check if metrics exist for user
      const { data, error: fetchError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user metrics:', fetchError);
        return false;
      }
      
      if (data) {
        console.log("Existing metrics found, updating...", data);
        
        // Update existing metrics
        const updateData: any = { 
          updated_at: new Date().toISOString() 
        };
        
        if (type === 'course') {
          updateData.course_completions = (data.course_completions || 0) + value;
        } else if (type === 'exercise') {
          updateData.exercises_completed = (data.exercises_completed || 0) + value;
        } else if (type === 'time') {
          updateData.total_time_spent = (data.total_time_spent || 0) + value;
        }
        
        console.log("Updating with:", updateData);
        
        const { error: updateError } = await supabase
          .from('user_metrics')
          .update(updateData)
          .eq('id', data.id);
          
        if (updateError) {
          console.error('Error updating metrics:', updateError);
          return false;
        }
        
        console.log("Metrics updated successfully");
      } else {
        console.log("No existing metrics found, creating new entry...");
        
        // Create new metrics entry
        const newMetrics: any = {
          user_id: userId,
          course_completions: type === 'course' ? value : 0,
          exercises_completed: type === 'exercise' ? value : 0,
          total_time_spent: type === 'time' ? value : 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        console.log("Creating new metrics:", newMetrics);
        
        const { error: insertError } = await supabase
          .from('user_metrics')
          .insert([newMetrics]);
          
        if (insertError) {
          console.error('Error inserting metrics:', insertError);
          return false;
        }
        
        console.log("New metrics created successfully");
      }
      
      return true;
    } catch (err) {
      console.error('Error updating user metrics:', err);
      return false;
    }
  };

  // Initialize metrics if they don't exist
  useEffect(() => {
    if (user) {
      const initializeMetrics = async () => {
        try {
          const { data, error } = await supabase
            .from('user_metrics')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (error && error.code !== 'PGRST116') {
            console.error('Error checking user metrics:', error);
            return;
          }
          
          if (!data) {
            console.log("Initializing user metrics...");
            await updateUserMetrics(user.id);
          }
        } catch (err) {
          console.error('Error initializing metrics:', err);
        }
      };
      
      initializeMetrics();
    }
  }, [user]);
  
  return {
    trackLessonViewed,
    trackExerciseCompleted,
    trackCourseCompleted,
    updateUserMetrics
  };
};
