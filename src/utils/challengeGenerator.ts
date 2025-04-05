
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Update challenge progress for a specific category
 * @param userId User ID
 * @param challengeType Type of challenge to update
 * @returns Success indicator
 */
export const updateChallengeProgress = async (
  userId: string,
  challengeType: string
): Promise<boolean> => {
  try {
    // Find user challenges matching the type
    const { data: challenges, error: fetchError } = await supabase
      .from('user_daily_challenges')
      .select('*')
      .eq('user_id', userId)
      .eq('challenge_type', 'daily') // Daily challenges
      .eq('completed', false) // Not yet completed
      .gte('expires_at', new Date().toISOString()); // Not expired
      
    if (fetchError) throw fetchError;
    
    // No active challenges found
    if (!challenges || challenges.length === 0) return false;
    
    // For each applicable challenge
    let updated = false;
    for (const challenge of challenges) {
      // Increment progress if challenge matches criteria
      const { error: updateError } = await supabase
        .from('user_daily_challenges')
        .update({
          current_progress: challenge.current_progress + 1,
          completed: challenge.current_progress + 1 >= challenge.target,
          completed_at: challenge.current_progress + 1 >= challenge.target ? new Date().toISOString() : null
        })
        .eq('id', challenge.id);
      
      if (updateError) throw updateError;
      updated = true;
      
      // If challenge is completed, show toast notification
      if (challenge.current_progress + 1 >= challenge.target) {
        toast.success(`Challenge terminé ! +${challenge.reward_xp} points !`, {
          description: challenge.description
        });
      }
    }
    
    return updated;
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    return false;
  }
};

/**
 * Generate a new challenge for the user
 * @param userId User ID
 * @returns Success indicator
 */
export const generateUserChallenge = async (userId: string): Promise<boolean> => {
  try {
    // Use RPC function to generate challenge
    const { data, error } = await supabase
      .rpc('generate_daily_challenge', {
        user_uuid: userId
      });
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error generating user challenge:', error);
    return false;
  }
};

/**
 * Generate multiple challenges for the user (daily and weekly)
 * @param userId User ID
 * @returns Success indicator
 */
export const generateUserChallenges = async (userId: string): Promise<boolean> => {
  try {
    // Generate a daily challenge
    await generateUserChallenge(userId);
    
    // Generate a weekly challenge
    const { data, error } = await supabase
      .rpc('generate_weekly_challenge', {
        user_uuid: userId
      });
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error generating user challenges:', error);
    return false;
  }
};
