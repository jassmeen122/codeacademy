
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Checks if a badge should be earned and updates user's badges accordingly
 */
export async function checkAndUpdateBadge(languageId: string, userId: string) {
  try {
    // Check if both summary is read and quiz is completed
    const { data, error } = await supabase
      .from('user_language_progress')
      .select('*')
      .eq('language_id', languageId)
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    
    // If both are completed and badge not earned yet, award badge
    if (data.summary_read && data.quiz_completed && !data.badge_earned) {
      // Get the language name to determine which badge to award
      const { data: languageData, error: langError } = await supabase
        .from('programming_languages')
        .select('name')
        .eq('id', languageId)
        .single();
        
      if (langError) throw langError;
      
      const badgeName = `${languageData.name} Mastery`;
      
      // Get the badge ID
      const { data: badgeData, error: badgeError } = await supabase
        .from('badges')
        .select('id')
        .eq('name', badgeName)
        .maybeSingle();
        
      if (badgeError && badgeError.code !== 'PGRST116') throw badgeError;
      
      // If badge doesn't exist yet, create it
      let badgeId;
      if (!badgeData) {
        const { data: newBadge, error: createError } = await supabase
          .from('badges')
          .insert({
            name: badgeName,
            description: `Completed ${languageData.name} summary and quiz`,
            icon: 'award',
            points: 100
          })
          .select()
          .single();
          
        if (createError) throw createError;
        badgeId = newBadge.id;
      } else {
        badgeId = badgeData.id;
      }
      
      // Add user badge
      const { error: userBadgeError } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_id: badgeId,
          earned_at: new Date().toISOString()
        });
        
      if (userBadgeError) throw userBadgeError;
      
      // Update progress
      const { error: updateError } = await supabase
        .from('user_language_progress')
        .update({
          badge_earned: true
        })
        .eq('id', data.id);
        
      if (updateError) throw updateError;
      
      // Update user points - first fetch current points from the profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', userId)
        .single();
        
      if (profileError) throw profileError;
      
      // Then update with additional points
      const newPoints = (profileData.points || 0) + 100;
      
      const { error: pointsError } = await supabase
        .from('profiles')
        .update({
          points: newPoints
        })
        .eq('id', userId);
        
      if (pointsError) throw pointsError;
      
      toast.success(`Félicitations ! Vous avez gagné le badge ${languageData.name} Mastery !`);
      
      // Update user gamification
      updateUserGamification(userId, badgeName);
    }
  } catch (err) {
    console.error('Error checking and updating badge:', err);
  }
}

/**
 * Updates user gamification data after earning a badge
 */
export async function updateUserGamification(userId: string, badgeName: string) {
  try {
    // Check if user already has gamification entry
    const { data, error } = await supabase
      .from('user_gamification')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') throw error;
    
    if (data) {
      // Update existing entry
      const badges = data.badges || [];
      if (!badges.includes(badgeName)) {
        badges.push(badgeName);
        
        const { error: updateError } = await supabase
          .from('user_gamification')
          .update({
            points: data.points + 100,
            badges,
            last_played_at: new Date().toISOString()
          })
          .eq('id', data.id);
          
        if (updateError) throw updateError;
      }
    } else {
      // Create new entry
      const { error: insertError } = await supabase
        .from('user_gamification')
        .insert({
          user_id: userId,
          points: 100,
          badges: [badgeName],
          last_played_at: new Date().toISOString()
        });
        
      if (insertError) throw insertError;
    }
  } catch (err) {
    console.error('Error updating user gamification:', err);
  }
}
