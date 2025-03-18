
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
    const exercises = (data || []).map(exercise => ({
      ...exercise,
      status: exercise.status as ExerciseStatus,
      archived: exercise.status === 'draft' && exercise.archived === true
    }));
    
    return exercises as Exercise[];
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
    let dbStatus: DatabaseExerciseStatus;
    let isArchived = false;
    
    if (status === "archived") {
      dbStatus = "draft";
      isArchived = true;
    } else {
      dbStatus = status as DatabaseExerciseStatus;
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
