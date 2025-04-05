
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Generates daily and weekly challenges for the user
 */
export const generateUserChallenges = async (userId: string): Promise<boolean> => {
  try {
    // Generate daily challenge
    const { data: dailyChallenge, error: dailyError } = await supabase.rpc('generate_daily_challenge', {
      user_uuid: userId
    });
    
    // Generate weekly challenge
    const { data: weeklyChallenge, error: weeklyError } = await supabase.rpc('generate_weekly_challenge', {
      user_uuid: userId
    });
    
    if (dailyError) console.error('Error generating daily challenge:', dailyError);
    if (weeklyError) console.error('Error generating weekly challenge:', weeklyError);
    
    // If we got new challenges, notify the user
    if (dailyChallenge || weeklyChallenge) {
      toast.success("Nouveaux défis disponibles !", {
        description: "Consultez la page d'achievements pour voir vos défis"
      });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error generating challenges:', error);
    return false;
  }
};

/**
 * Updates a challenge progress based on user activity
 */
export const updateChallengeProgress = async (
  userId: string,
  challengeType: 'lesson_completed' | 'xp_earned' | 'login' | 'exercise_completed'
): Promise<void> => {
  try {
    // Get relevant challenges
    const { data: challenges, error } = await supabase
      .from('user_daily_challenges')
      .select('*')
      .eq('user_id', userId)
      .gte('expires_at', new Date().toISOString())
      .eq('completed', false);
      
    if (error) throw error;
    
    if (!challenges || challenges.length === 0) return;
    
    // Update matching challenges
    for (const challenge of challenges) {
      let shouldUpdate = false;
      let increment = 0;
      
      switch (challengeType) {
        case 'lesson_completed':
          if (challenge.description.toLowerCase().includes('leçon')) {
            shouldUpdate = true;
            increment = 1;
          }
          break;
        case 'xp_earned':
          if (challenge.description.toLowerCase().includes('xp')) {
            shouldUpdate = true;
            increment = 10; // Assume 10 XP per action
          }
          break;
        case 'login':
          if (challenge.description.toLowerCase().includes('connecte')) {
            shouldUpdate = true;
            increment = 1;
          }
          break;
        case 'exercise_completed':
          if (challenge.description.toLowerCase().includes('exercice')) {
            shouldUpdate = true;
            increment = 1;
          }
          break;
      }
      
      if (shouldUpdate && increment > 0) {
        const newProgress = Math.min(challenge.current_progress + increment, challenge.target);
        const completed = newProgress >= challenge.target;
        
        // Update the challenge
        const { error: updateError } = await supabase
          .from('user_daily_challenges')
          .update({ 
            current_progress: newProgress,
            completed,
            completed_at: completed ? new Date().toISOString() : null
          })
          .eq('id', challenge.id);
          
        if (updateError) throw updateError;
        
        // If completed, award points
        if (completed) {
          // Award XP for completing the challenge
          await supabase.functions.invoke('gamification', {
            body: { 
              points: challenge.reward_xp 
            },
            method: 'POST',
            headers: {
              'endpoint': 'add-points'
            }
          });
          
          toast.success("Défi terminé !", {
            description: `+${challenge.reward_xp} XP`
          });
        }
      }
    }
  } catch (error) {
    console.error('Error updating challenge progress:', error);
  }
};
