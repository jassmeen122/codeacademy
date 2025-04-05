
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import { toast } from 'sonner';

export const useSummaryProgress = () => {
  const [updating, setUpdating] = useState(false);
  const { user } = useAuthState();
  
  const trackSummaryRead = async (
    languageId: string,
    title: string
  ) => {
    if (!user) return false;
    
    try {
      setUpdating(true);
      
      // Record the activity
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'summary_read',
          activity_data: {
            language_id: languageId,
            title,
            timestamp: new Date().toISOString()
          }
        });
        
      if (error) throw error;
      
      // Update user language progress record
      const { data: existingProgress, error: fetchError } = await supabase
        .from('user_language_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('language_id', languageId)
        .maybeSingle();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching language progress:', fetchError);
      } else if (existingProgress) {
        // Update existing record
        await supabase
          .from('user_language_progress')
          .update({
            summary_read: true,
            last_updated: new Date().toISOString()
          })
          .eq('id', existingProgress.id);
      } else {
        // Create new record
        await supabase
          .from('user_language_progress')
          .insert({
            user_id: user.id,
            language_id: languageId,
            summary_read: true,
            quiz_completed: false,
            badge_earned: false,
            last_updated: new Date().toISOString()
          });
      }
      
      // Check if user has both read the summary and completed the quiz
      const { data: progress } = await supabase
        .from('user_language_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('language_id', languageId)
        .single();
        
      if (progress && progress.summary_read && progress.quiz_completed && !progress.badge_earned) {
        // Award badge for completing both summary and quiz
        await awardLanguageBadge(user.id, languageId);
      }
      
      return true;
    } catch (error) {
      console.error('Error tracking summary read:', error);
      toast.error('Failed to save your progress');
      return false;
    } finally {
      setUpdating(false);
    }
  };
  
  const awardLanguageBadge = async (userId: string, languageId: string) => {
    try {
      // Get language info
      const { data: language } = await supabase
        .from('programming_languages')
        .select('name')
        .eq('id', languageId)
        .single();
        
      if (!language) return;
      
      // Create a badge if it doesn't exist
      const { data: badge, error: badgeError } = await supabase
        .from('badges')
        .select('id')
        .eq('name', `${language.name} Mastery`)
        .maybeSingle();
        
      let badgeId;
      
      if (badgeError && badgeError.code !== 'PGRST116') {
        console.error('Error checking for badge:', badgeError);
        return;
      }
      
      if (badge) {
        badgeId = badge.id;
      } else {
        // Create new badge
        const { data: newBadge, error: createError } = await supabase
          .from('badges')
          .insert({
            name: `${language.name} Mastery`,
            description: `Completed both the summary and quiz for ${language.name}`,
            points: 100,
            icon: '🏆'
          })
          .select('id')
          .single();
          
        if (createError) {
          console.error('Error creating badge:', createError);
          return;
        }
        
        badgeId = newBadge.id;
      }
      
      // Award badge to user
      await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_id: badgeId
        });
        
      // Update language progress
      await supabase
        .from('user_language_progress')
        .update({
          badge_earned: true,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('language_id', languageId);
        
      toast.success(`🏆 Badge awarded: ${language.name} Mastery!`);
      
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  };
  
  return {
    trackSummaryRead,
    updating
  };
};
