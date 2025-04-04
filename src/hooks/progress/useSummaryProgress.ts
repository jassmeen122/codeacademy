
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthState } from '../useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { useStudentActivity } from '../useStudentActivity';

export const useSummaryProgress = () => {
  const [updating, setUpdating] = useState(false);
  const { user } = useAuthState();
  const { trackLessonViewed } = useStudentActivity();

  // Track summary read progress
  const trackSummaryRead = async (languageId: string, languageName: string) => {
    if (!user) {
      toast.error('Please log in to track your progress');
      return false;
    }

    try {
      setUpdating(true);

      // Update language progress
      const { data, error } = await supabase
        .from('user_language_progress')
        .upsert({
          user_id: user.id,
          language_id: languageId,
          summary_read: true,
          last_updated: new Date().toISOString()
        }, { 
          onConflict: 'user_id,language_id' 
        }).select();

      if (error) throw error;

      console.log("Progress update result:", data);

      // Record activity
      await trackLessonViewed(languageId, languageName, 'summary');

      toast.success('Progress updated!');
      return true;
    } catch (error) {
      console.error('Error tracking summary read:', error);
      toast.error('Failed to update progress');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    trackSummaryRead,
    updating
  };
};
