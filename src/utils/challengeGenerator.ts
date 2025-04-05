
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
      toast.success("New challenges available!", {
        description: "Check the achievements page to see your challenges"
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
          if (challenge.description.toLowerCase().includes('lesson')) {
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
          if (challenge.description.toLowerCase().includes('login')) {
            shouldUpdate = true;
            increment = 1;
            console.log('Updating login challenge');
          }
          break;
        case 'exercise_completed':
          if (challenge.description.toLowerCase().includes('exercise')) {
            shouldUpdate = true;
            increment = 1;
            console.log('Updating exercise challenge');
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
            
            toast.success("Challenge completed!", {
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

// Add a list of developer-oriented challenge templates that can be used for generating challenges
export const challengeTemplates = {
  daily: [
    {
      description: "Complete 3 coding exercises",
      target: 3,
      reward_xp: 50,
      type: "exercise_completed"
    },
    {
      description: "Read documentation for 15 minutes",
      target: 1,
      reward_xp: 25,
      type: "documentation_read"
    },
    {
      description: "Write 5 unit tests",
      target: 5,
      reward_xp: 60,
      type: "test_written"
    },
    {
      description: "Refactor a code block for better performance",
      target: 1,
      reward_xp: 40,
      type: "code_refactored"
    },
    {
      description: "Debug and fix 2 errors in your code",
      target: 2,
      reward_xp: 35,
      type: "bug_fixed"
    },
    {
      description: "Comment your code properly",
      target: 1,
      reward_xp: 20,
      type: "code_documented"
    }
  ],
  weekly: [
    {
      description: "Complete a small project using a new library",
      target: 1,
      reward_xp: 150,
      type: "project_completed"
    },
    {
      description: "Contribute to an open source repository",
      target: 1,
      reward_xp: 200,
      type: "contribution_made"
    },
    {
      description: "Learn and implement a design pattern",
      target: 1,
      reward_xp: 125,
      type: "pattern_learned"
    },
    {
      description: "Optimize your database queries",
      target: 3,
      reward_xp: 175,
      type: "query_optimized"
    },
    {
      description: "Set up a CI/CD pipeline for your project",
      target: 1,
      reward_xp: 200,
      type: "pipeline_setup"
    },
    {
      description: "Complete 10 coding exercises",
      target: 10,
      reward_xp: 150,
      type: "exercise_completed"
    }
  ]
};
