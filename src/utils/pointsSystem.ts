
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
      // Update existing metrics
      await supabase
        .from('user_metrics')
        .update({
          total_time_spent: (existingMetrics.total_time_spent || 0) + pointsToAdd,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    } else {
      // Create new metrics entry
      await supabase
        .from('user_metrics')
        .insert({
          user_id: userId,
          total_time_spent: pointsToAdd,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }
    
    // Update profile points (used for leaderboard)
    await supabase
      .from('profiles')
      .update({ points: supabase.rpc('get_points_total', { user_uuid: userId }) })
      .eq('id', userId);
  } catch (error) {
    console.error('Error updating user points:', error);
    throw error;
  }
};

/**
 * Get user's total points
 */
export const getUserPoints = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('user_metrics')
      .select('total_time_spent')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) throw error;
    
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
