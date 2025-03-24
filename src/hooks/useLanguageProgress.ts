
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getLanguageId } from '../utils/languageUtils';
import { checkAndUpdateBadge } from './useBadgeOperations';
import { UserProfile } from './useAuthState';

/**
 * Hook for managing user's language learning progress
 */
export async function markSummaryAsRead(user: UserProfile | null, languageIdOrName: string) {
  if (!user || !languageIdOrName) {
    toast.error('Vous devez être connecté pour marquer comme lu');
    return false;
  }
  
  try {
    // Get the language ID (from name or UUID)
    const languageId = await getLanguageId(languageIdOrName);
    
    // Check if progress record exists
    const { data: existingProgress, error: progressError } = await supabase
      .from('user_language_progress')
      .select('*')
      .eq('language_id', languageId)
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (progressError && progressError.code !== 'PGRST116') throw progressError;
    
    // Update or create progress record
    if (existingProgress) {
      const { error } = await supabase
        .from('user_language_progress')
        .update({
          summary_read: true,
          last_updated: new Date().toISOString()
        })
        .eq('id', existingProgress.id);
        
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('user_language_progress')
        .insert({
          user_id: user.id,
          language_id: languageId,
          summary_read: true
        });
        
      if (error) throw error;
    }
    
    toast.success('Résumé marqué comme lu !');
    
    // Check if badge should be earned
    await checkAndUpdateBadge(languageId, user.id);
    
    return true;
  } catch (err: any) {
    console.error('Error marking summary as read:', err);
    toast.error('Erreur lors de la mise à jour de votre progression');
    return false;
  }
}
