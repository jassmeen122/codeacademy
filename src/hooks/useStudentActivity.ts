
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
        // First check if metrics exist for user
        const { data: existingMetrics, error: fetchError } = await supabase
          .from('user_metrics')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching user metrics:', fetchError);
          return false;
        }
        
        const timeSpentValue = 15; // 15 minutes for lesson viewed
        
        if (existingMetrics) {
          console.log("Updating existing metrics for lesson:", existingMetrics);
          const updatedTimeSpent = (existingMetrics.total_time_spent || 0) + timeSpentValue;
          
          // Direct update with consistent values
          const { error: updateError } = await supabase
            .from('user_metrics')
            .update({ 
              total_time_spent: updatedTimeSpent,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingMetrics.id);
            
          if (updateError) {
            console.error('Error updating metrics:', updateError);
            return false;
          }
          
          console.log(`User metrics updated: time_spent=${updatedTimeSpent}`);
        } else {
          console.log("Creating new metrics for lesson view");
          
          // Create new metrics entry
          const { error: insertError } = await supabase
            .from('user_metrics')
            .insert({
              user_id: user.id,
              total_time_spent: timeSpentValue,
              course_completions: 0,
              exercises_completed: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (insertError) {
            console.error('Error creating metrics:', insertError);
            return false;
          }
          
          console.log(`New user metrics created: time_spent=${timeSpentValue}`);
        }
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
      
      // Direct update to user_metrics
      const { data: existingMetrics, error: fetchError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user metrics:', fetchError);
      }
      
      if (existingMetrics) {
        console.log("Updating existing metrics for exercise:", existingMetrics);
        const exercisesCompleted = (existingMetrics.exercises_completed || 0) + 1;
        
        // Direct update with consistent values
        const { error: updateError } = await supabase
          .from('user_metrics')
          .update({ 
            exercises_completed: exercisesCompleted,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingMetrics.id);
          
        if (updateError) {
          console.error('Error updating exercise metrics:', updateError);
        } else {
          console.log(`User metrics updated: exercises_completed=${exercisesCompleted}`);
        }
      } else {
        console.log("Creating new metrics for exercise completion");
        
        // Create new metrics entry
        const { error: insertError } = await supabase
          .from('user_metrics')
          .insert({
            user_id: user.id,
            exercises_completed: 1,
            course_completions: 0,
            total_time_spent: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (insertError) {
          console.error('Error creating exercise metrics:', insertError);
        } else {
          console.log("New user metrics created for exercise completion");
        }
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
      
      // Direct update to user_metrics
      const { data: existingMetrics, error: fetchError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user metrics:', fetchError);
      }
      
      if (existingMetrics) {
        console.log("Updating existing metrics for course completion:", existingMetrics);
        const courseCompletions = (existingMetrics.course_completions || 0) + 1;
        
        // Direct update with consistent values
        const { error: updateError } = await supabase
          .from('user_metrics')
          .update({ 
            course_completions: courseCompletions,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingMetrics.id);
          
        if (updateError) {
          console.error('Error updating course metrics:', updateError);
        } else {
          console.log(`User metrics updated: course_completions=${courseCompletions}`);
        }
      } else {
        console.log("Creating new metrics for course completion");
        
        // Create new metrics entry
        const { error: insertError } = await supabase
          .from('user_metrics')
          .insert({
            user_id: user.id,
            course_completions: 1,
            exercises_completed: 0,
            total_time_spent: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (insertError) {
          console.error('Error creating course metrics:', insertError);
        } else {
          console.log("New user metrics created for course completion");
        }
      }
      
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
  
  // Helper function to update user metrics with more direct approach to fix the bug
  const updateUserMetrics = async (userId: string, type: 'course' | 'exercise' | 'time' = 'time', value: number = 15) => {
    try {
      console.log(`Updating user metrics: userId=${userId}, type=${type}, value=${value}`);
      
      // First check if metrics exist for user
      const { data: existingMetrics, error: fetchError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user metrics:', fetchError);
        return false;
      }
      
      if (existingMetrics) {
        console.log("Existing metrics found, updating...", existingMetrics);
        
        // Prepare update data
        let updateData: any = { 
          updated_at: new Date().toISOString() 
        };
        
        if (type === 'course') {
          updateData.course_completions = (existingMetrics.course_completions || 0) + value;
        } else if (type === 'exercise') {
          updateData.exercises_completed = (existingMetrics.exercises_completed || 0) + value;
        } else if (type === 'time') {
          updateData.total_time_spent = (existingMetrics.total_time_spent || 0) + value;
        }
        
        console.log("Updating metrics with:", updateData);
        
        // Directly update the record
        const { error: updateError } = await supabase
          .from('user_metrics')
          .update(updateData)
          .eq('id', existingMetrics.id);
          
        if (updateError) {
          console.error('Error updating metrics:', updateError);
          return false;
        }
        
        console.log("Metrics updated successfully:", updateData);
      } else {
        console.log("No existing metrics found, creating new entry...");
        
        // Create new metrics entry with specific initial values
        const newMetrics: any = {
          user_id: userId,
          course_completions: type === 'course' ? value : 0,
          exercises_completed: type === 'exercise' ? value : 0,
          total_time_spent: type === 'time' ? value : 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        console.log("Creating new metrics:", newMetrics);
        
        const { data, error: insertError } = await supabase
          .from('user_metrics')
          .insert([newMetrics])
          .select();
          
        if (insertError) {
          console.error('Error inserting metrics:', insertError);
          return false;
        }
        
        console.log("New metrics created successfully:", data);
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
          console.log("Checking if user metrics need to be initialized...");
          
          // Check if metrics exist and create if not
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
            
            const { error: insertError } = await supabase
              .from('user_metrics')
              .insert({
                user_id: user.id,
                course_completions: 0,
                exercises_completed: 0,
                total_time_spent: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
              
            if (insertError) {
              console.error('Error initializing metrics:', insertError);
            } else {
              console.log("User metrics initialized successfully");
            }
          } else {
            console.log("User metrics already exist:", data);
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
