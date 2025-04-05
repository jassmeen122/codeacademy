
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const checkForNewBadges = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase.rpc('check_and_award_badges', {
      user_uuid: userId
    });

    if (error) throw error;

    // If new badges were earned, show a notification
    if (data && data.length > 0) {
      toast.success(`Félicitations ! Vous avez obtenu ${data.length} nouveau(x) badge(s) !`, {
        description: "Consultez votre page d'achievements pour les voir."
      });
      return data;
    }

    return [];
  } catch (error) {
    console.error('Error checking for badges:', error);
    return [];
  }
};

export const trackActivityAndCheckBadges = async (
  userId: string, 
  activityType: string, 
  activityData: any
): Promise<void> => {
  try {
    // First, record the activity
    const { error } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_type: activityType,
        activity_data: activityData
      });

    if (error) throw error;

    // Then, check for new badges
    await checkForNewBadges(userId);
  } catch (error) {
    console.error('Error tracking activity:', error);
  }
};
