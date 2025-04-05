
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the different activity types and their point values
export const POINT_VALUES = {
  SUMMARY_READ: 5,
  QUIZ_COMPLETED: 10,
  EXERCISE_COMPLETED: 10,
  PROJECT_UPLOADED: 15,
  NOTES_CREATED: 5
};

// Define activity types
export type ActivityType = 
  | 'summary_read'
  | 'quiz_completed'
  | 'exercise_completed'
  | 'project_uploaded'
  | 'notes_created';

/**
 * Awards points to a user for completing an activity
 */
export const awardPoints = async (
  userId: string, 
  activityType: ActivityType, 
  associatedItemId?: string, // ID of the summary, quiz, exercise, etc.
  showToast: boolean = true
): Promise<{ success: boolean, points: number, error?: any }> => {
  try {
    // Determine points based on activity type
    const pointsToAward = getPointsForActivity(activityType);
    
    // Record the activity in the user activities table
    const { error: activityError } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_type: activityType,
        activity_data: { 
          item_id: associatedItemId,
          points_awarded: pointsToAward,
          timestamp: new Date().toISOString()
        }
      });
    
    if (activityError) throw activityError;
    
    // Update user metrics table (points total)
    await updateUserPoints(userId, pointsToAward);
    
    // Show a toast notification if requested
    if (showToast) {
      toast.success(`+${pointsToAward} points pour ${getActivityLabel(activityType)} !`);
    }
    
    return { success: true, points: pointsToAward };
  } catch (error) {
    console.error('Error awarding points:', error);
    return { success: false, points: 0, error };
  }
};

/**
 * Get points value for a specific activity type
 */
export const getPointsForActivity = (activityType: ActivityType): number => {
  switch(activityType) {
    case 'summary_read':
      return POINT_VALUES.SUMMARY_READ;
    case 'quiz_completed':
      return POINT_VALUES.QUIZ_COMPLETED;
    case 'exercise_completed':
      return POINT_VALUES.EXERCISE_COMPLETED;
    case 'project_uploaded':
      return POINT_VALUES.PROJECT_UPLOADED;
    case 'notes_created':
      return POINT_VALUES.NOTES_CREATED;
    default:
      return 0;
  }
};

/**
 * Get a user-friendly label for an activity type
 */
export const getActivityLabel = (activityType: ActivityType): string => {
  switch(activityType) {
    case 'summary_read':
      return 'lecture du résumé';
    case 'quiz_completed':
      return 'quiz complété';
    case 'exercise_completed':
      return 'exercice terminé';
    case 'project_uploaded':
      return 'projet soumis';
    case 'notes_created':
      return 'notes créées';
    default:
      return 'activité';
  }
};

/**
 * Update the user's point total in the user_metrics table
 */
const updateUserPoints = async (userId: string, pointsToAdd: number): Promise<void> => {
  try {
    // Check if user has metrics entry
    const { data: existingMetrics, error: checkError } = await supabase
      .from('user_metrics')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingMetrics) {
      console.log("Existing metrics found, updating...");
      
      // Prepare update data
      let updateData: any = { 
        updated_at: new Date().toISOString() 
      };
      
      if (pointsToAdd) {
        updateData.total_time_spent = (existingMetrics.total_time_spent || 0) + pointsToAdd;
      }
      
      // Directly update the record
      const { error: updateError } = await supabase
        .from('user_metrics')
        .update(updateData)
        .eq('id', existingMetrics.id);
          
      if (updateError) {
        console.error('Error updating metrics:', updateError);
        throw updateError;
      }
    } else {
      console.log("No existing metrics found, creating new entry...");
      
      // Create new metrics entry
      const newMetrics: any = {
        user_id: userId,
        course_completions: 0,
        exercises_completed: 0,
        total_time_spent: pointsToAdd,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { error: insertError } = await supabase
        .from('user_metrics')
        .insert([newMetrics]);
          
      if (insertError) {
        console.error('Error inserting metrics:', insertError);
        throw insertError;
      }
    }
    
    // Update profile points (used for leaderboard)
    try {
      // Fix: Instead of using rpc, use a direct query with the SQL function
      // Retrieve the points total first using a direct select
      const { data: userMetrics, error: metricsError } = await supabase
        .from('user_metrics')
        .select('total_time_spent')
        .eq('user_id', userId)
        .single();
      
      if (metricsError) throw metricsError;
      
      const pointsTotal = userMetrics?.total_time_spent || 0;
      
      // Now update the profile with the points total
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ points: pointsTotal })
        .eq('id', userId);
      
      if (updateProfileError) throw updateProfileError;
    } catch (error) {
      console.error('Error updating profile points:', error);
    }
  } catch (err) {
    console.error('Error updating user points:', err);
    throw err;
  }
};

/**
 * Get user's total points
 */
export const getUserPoints = async (userId: string): Promise<number> => {
  try {
    // Fix: Use a direct query instead of rpc
    const { data, error } = await supabase
      .from('user_metrics')
      .select('total_time_spent')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) throw error;
    
    // Ensure we return a number
    return data?.total_time_spent || 0;
  } catch (error) {
    console.error('Error getting user points:', error);
    return 0;
  }
};

/**
 * Get user's activity history
 */
export const getUserActivityHistory = async (userId: string, limit: number = 10): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error getting user activity history:', error);
    return [];
  }
};
