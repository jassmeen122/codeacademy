
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { updateChallengeProgress } from './challengeGenerator';

/**
 * Saves a note for a specific exercise
 */
export const saveExerciseNote = async (
  userId: string,
  exerciseId: string,
  content: string
): Promise<{ success: boolean, data?: any, error?: any }> => {
  try {
    // Check if note already exists
    const { data: existingNote, error: checkError } = await supabase
      .from('exercise_notes')
      .select('*')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking existing note:', checkError);
      throw checkError;
    }
    
    let result;
    
    if (existingNote) {
      // Update existing note
      result = await supabase
        .from('exercise_notes')
        .update({ 
          content, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', existingNote.id);
        
      console.log('Updated existing note');
    } else {
      // Create new note
      result = await supabase
        .from('exercise_notes')
        .insert({
          user_id: userId,
          exercise_id: exerciseId,
          content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      // Award points for creating first note for this exercise
      try {
        await supabase.functions.invoke('gamification', {
          body: { 
            points: 5 
          },
          method: 'POST',
          headers: {
            'endpoint': 'add-points'
          }
        });
        
        // Update note-taking challenge progress if exists
        await updateChallengeProgress(userId, 'notes_created');
        
        console.log('Created new note and awarded points');
      } catch (e) {
        console.error('Error awarding points for note creation:', e);
      }
    }
    
    if (result.error) throw result.error;
    
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error saving exercise note:', error);
    return { success: false, error };
  }
};

/**
 * Get notes for a specific exercise
 */
export const getExerciseNote = async (
  userId: string,
  exerciseId: string
): Promise<{ success: boolean, data?: any, error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('exercise_notes')
      .select('*')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .maybeSingle();
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error getting exercise note:', error);
    return { success: false, error };
  }
};

/**
 * Get all notes for a user
 */
export const getUserNotes = async (
  userId: string
): Promise<{ success: boolean, data?: any, error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('exercise_notes')
      .select(`
        *,
        exercises (
          title,
          description,
          difficulty
        )
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error getting user notes:', error);
    return { success: false, error };
  }
};

/**
 * Delete a note
 */
export const deleteExerciseNote = async (
  userId: string,
  noteId: string
): Promise<{ success: boolean, error?: any }> => {
  try {
    const { error } = await supabase
      .from('exercise_notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', userId); // Ensure user owns the note
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting exercise note:', error);
    return { success: false, error };
  }
};
