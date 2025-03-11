
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
    
    return data || [];
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
    const dbStatus: DatabaseExerciseStatus = status === "archived" ? "draft" : status as DatabaseExerciseStatus;
    
    const { error } = await supabase
      .from('exercises')
      .update({ 
        status: dbStatus,
        // Add a metadata field to mark it as archived if needed
        archived: status === "archived"
      })
      .eq('id', exerciseId);
    
    if (error) throw error;
    
    toast.success(`Exercise ${status === 'published' ? 'published' : status === 'archived' ? 'archived' : 'saved as draft'} successfully`);
    return true;
  } catch (error: any) {
    toast.error(`Failed to update exercise: ${error.message}`);
    console.error("Error updating exercise:", error);
    return false;
  }
};
