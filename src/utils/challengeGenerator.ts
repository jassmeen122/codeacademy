
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
  challengeType: 'lesson_completed' | 'xp_earned' | 'login' | 'exercise_completed' | 'notes_created'
): Promise<void> => {
  try {
    console.log(`Updating challenge progress for ${userId}, type: ${challengeType}`);
    
    // Get relevant challenges
    const { data: challenges, error } = await supabase
      .from('user_daily_challenges')
      .select('*')
      .eq('user_id', userId)
      .gte('expires_at', new Date().toISOString())
      .eq('completed', false);
      
    if (error) {
      console.error('Error fetching challenges:', error);
      return;
    }
    
    if (!challenges || challenges.length === 0) {
      console.log('No active challenges found');
      return;
    }
    
    console.log(`Found ${challenges.length} active challenges`);
    
    // Update matching challenges
    for (const challenge of challenges) {
      let shouldUpdate = false;
      let increment = 0;
      
      switch (challengeType) {
        case 'lesson_completed':
          if (challenge.description.toLowerCase().includes('leçon') || 
              challenge.description.toLowerCase().includes('lesson')) {
            shouldUpdate = true;
            increment = 1;
            console.log('Updating lesson challenge');
          }
          break;
        case 'xp_earned':
          if (challenge.description.toLowerCase().includes('xp')) {
            shouldUpdate = true;
            increment = 10; // Assume 10 XP per action
            console.log('Updating XP challenge');
          }
          break;
        case 'login':
          if (challenge.description.toLowerCase().includes('connecte')) {
            shouldUpdate = true;
            increment = 1;
            console.log('Updating login challenge');
          }
          break;
        case 'exercise_completed':
          if (challenge.description.toLowerCase().includes('exercice') || 
              challenge.description.toLowerCase().includes('exercise')) {
            shouldUpdate = true;
            increment = 1;
            console.log('Updating exercise challenge');
          }
          break;
        case 'notes_created':
          if (challenge.description.toLowerCase().includes('note')) {
            shouldUpdate = true;
            increment = 1;
            console.log('Updating notes challenge');
          }
          break;
      }
      
      if (shouldUpdate && increment > 0) {
        const newProgress = Math.min(challenge.current_progress + increment, challenge.target);
        const completed = newProgress >= challenge.target;
        
        console.log(`Updating challenge ${challenge.id}: ${challenge.current_progress} -> ${newProgress}, completed: ${completed}`);
        
        // Update the challenge
        const { error: updateError } = await supabase
          .from('user_daily_challenges')
          .update({ 
            current_progress: newProgress,
            completed,
            completed_at: completed ? new Date().toISOString() : null
          })
          .eq('id', challenge.id);
          
        if (updateError) {
          console.error('Error updating challenge:', updateError);
          continue;
        }
        
        // If completed, award points
        if (completed) {
          console.log(`Challenge ${challenge.id} completed! Awarding ${challenge.reward_xp} XP`);
          
          // Award XP for completing the challenge
          try {
            const { data, error: pointsError } = await supabase.functions.invoke('gamification', {
              body: { 
                points: challenge.reward_xp 
              },
              method: 'POST',
              headers: {
                'endpoint': 'add-points'
              }
            });
            
            if (pointsError) {
              console.error('Error awarding points:', pointsError);
            } else {
              console.log('Points awarded successfully:', data);
            }
            
            toast.success("Défi terminé !", {
              description: `+${challenge.reward_xp} XP`
            });
          } catch (e) {
            console.error('Error calling gamification function:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error updating challenge progress:', error);
  }
};
