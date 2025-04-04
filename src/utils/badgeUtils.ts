
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Check if badge should be awarded
export const checkAndAwardBadge = async (userId: string, languageId: string) => {
  try {
    // Get current language progress
    const { data: progress, error: progressError } = await supabase
      .from('user_language_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('language_id', languageId)
      .single();
    
    if (progressError) throw progressError;
    
    // If both summary is read and quiz is completed, award a badge
    if (progress && progress.summary_read && progress.quiz_completed && !progress.badge_earned) {
      // Update badge status
      await supabase
        .from('user_language_progress')
        .update({ badge_earned: true })
        .eq('id', progress.id);
      
      // Get language name for the badge
      const { data: language } = await supabase
        .from('programming_languages')
        .select('name')
        .eq('id', languageId)
        .single();
      
      if (language) {
        // Add to user's badges array in user_gamification
        const { data: gamification } = await supabase
          .from('user_gamification')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (gamification) {
          // Update existing gamification record
          const badgeName = `${language.name} Master`;
          const updatedBadges = [...(gamification.badges || []), badgeName];
          const updatedPoints = (gamification.points || 0) + 50;
          
          await supabase
            .from('user_gamification')
            .update({
              badges: updatedBadges,
              points: updatedPoints
            })
            .eq('user_id', userId);
        } else {
          // Create new gamification record
          await supabase
            .from('user_gamification')
            .insert({
              user_id: userId,
              badges: [`${language.name} Master`],
              points: 50
            });
        }
        
        toast.success(`🏆 New badge earned: ${language.name} Master!`);
      }
    }
  } catch (error) {
    console.error('Error checking/awarding badge:', error);
  }
};
