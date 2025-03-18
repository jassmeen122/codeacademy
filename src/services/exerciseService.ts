
import { supabase } from "@/integrations/supabase/client";
import { Exercise } from "@/types/exercise";
import { ExerciseStatus, DatabaseExerciseStatus } from "@/types/course";
import { toast } from "sonner";

export const fetchExercises = async (teacherId: string): Promise<Exercise[]> => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform the data to match our Exercise type with the correct status
    const exercises = (data || []).map(exercise => {
      // Create a base exercise object with the properties from the database
      const baseExercise: Exercise = {
        id: exercise.id,
        title: exercise.title,
        description: exercise.description,
        difficulty: exercise.difficulty,
        type: exercise.type,
        status: exercise.status as ExerciseStatus,
        time_limit: exercise.time_limit,
        created_at: exercise.created_at,
        teacher_id: exercise.teacher_id,
      };
      
      // Add the archived property if the status is draft
      if (exercise.status === 'draft' && exercise.archived === true) {
        return {
          ...baseExercise,
          status: 'archived' as ExerciseStatus, // Override the status
          archived: true
        };
      }
      
      return baseExercise;
    });
    
    return exercises;
  } catch (error: any) {
    toast.error("Failed to fetch exercises");
    console.error("Error fetching exercises:", error);
    return [];
  }
};

export const deleteExercise = async (exerciseId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', exerciseId);
    
    if (error) throw error;
    
    toast.success("Exercise deleted successfully");
    return true;
  } catch (error: any) {
    toast.error(`Failed to delete exercise: ${error.message}`);
    console.error("Error deleting exercise:", error);
    return false;
  }
};

export const changeExerciseStatus = async (
  exerciseId: string, 
  status: ExerciseStatus
): Promise<boolean> => {
  try {
    // For "archived" status, we'll handle it as "draft" in the database
    // but display it as "archived" in the UI
    let dbStatus: DatabaseExerciseStatus = "draft";
    let isArchived = false;
    
    if (status === "archived") {
      dbStatus = "draft";
      isArchived = true;
    } else if (status === "pending" || status === "approved" || status === "rejected" || status === "published") {
      dbStatus = status;
    }
    
    const { error } = await supabase
      .from('exercises')
      .update({ 
        status: dbStatus,
        // Add a metadata field to mark it as archived if needed
        archived: isArchived
      })
      .eq('id', exerciseId);
    
    if (error) throw error;
    
    let statusMessage = "";
    if (status === "published") statusMessage = "published";
    else if (status === "archived") statusMessage = "archived";
    else statusMessage = "saved as draft";
    
    toast.success(`Exercise ${statusMessage} successfully`);
    return true;
  } catch (error: any) {
    toast.error(`Failed to update exercise: ${error.message}`);
    console.error("Error updating exercise:", error);
    return false;
  }
};
