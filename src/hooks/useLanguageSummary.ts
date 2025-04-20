
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthState } from '@/hooks/useAuthState';
import { 
  LanguageSummary, 
  UserProgress, 
  fetchLanguageSummary, 
  fetchUserProgress, 
  createDefaultSummary, 
  saveUserProgress,
  getDefaultSummaryContent
} from '@/services/languageSummaryService';

export const useLanguageSummary = (languageId: string | undefined) => {
  const [summary, setSummary] = useState<LanguageSummary | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthState();

  useEffect(() => {
    if (!languageId) {
      setLoading(false);
      return;
    }

    const loadSummaryAndProgress = async () => {
      try {
        setLoading(true);
        
        // Fetch language summary from database
        const summaryData = await fetchLanguageSummary(languageId);
        
        if (summaryData) {
          setSummary(summaryData);
        } else {
          // Try to create a default summary if none exists
          const defaultSummary = await createDefaultSummary(languageId);
          
          if (defaultSummary) {
            setSummary(defaultSummary);
          } else {
            // If creation failed, use in-memory default
            const fallbackSummary = getDefaultSummaryContent(languageId);
            setSummary(fallbackSummary);
          }
        }
        
        // Fetch user progress if logged in
        if (user) {
          const progressData = await fetchUserProgress(user.id, languageId);
          
          if (progressData) {
            setProgress(progressData);
          } else {
            // Set default progress
            setProgress({
              user_id: user.id,
              language_id: languageId,
              summary_read: false,
              quiz_completed: false,
              badge_earned: false
            });
          }
        }
      } catch (err: any) {
        console.error('Error loading summary and progress:', err);
        setError(err);
        toast.error('Erreur lors du chargement du résumé');
      } finally {
        setLoading(false);
      }
    };

    loadSummaryAndProgress();
  }, [languageId, user]);

  const markAsRead = async () => {
    if (!user || !languageId) return;
    
    try {
      let progressData = progress;
      
      if (!progressData) {
        // Create new progress entry
        progressData = {
          user_id: user.id,
          language_id: languageId,
          summary_read: true,
          quiz_completed: false,
          badge_earned: false
        };
      } else {
        progressData.summary_read = true;
      }
      
      const updatedProgress = await saveUserProgress(progressData);
      
      if (updatedProgress) {
        setProgress(updatedProgress);
        toast.success('Résumé marqué comme lu !');
      }
    } catch (err: any) {
      console.error('Error marking summary as read:', err);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return { summary, progress, loading, error, markAsRead };
};
