
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from '@/hooks/useAuthState';

interface LanguageSummary {
  id: string;
  language_id: string;
  title: string;
  content: string;
  created_at: string;
}

interface UserProgress {
  id?: string;
  user_id: string;
  language_id: string;
  summary_read: boolean;
  quiz_completed: boolean;
  badge_earned: boolean;
  last_updated?: string;
}

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

    const fetchSummaryAndProgress = async () => {
      try {
        setLoading(true);
        
        // Récupérer le résumé du langage
        const { data: summaryData, error: summaryError } = await supabase
          .from('language_summaries')
          .select('*')
          .eq('language_id', languageId)
          .single();
          
        if (summaryError && summaryError.code !== 'PGRST116') {
          // PGRST116 is "No rows returned" which means the summary doesn't exist yet
          throw summaryError;
        }
        
        if (summaryData) {
          setSummary(summaryData as LanguageSummary);
        }
        
        // Récupérer la progression de l'utilisateur si connecté
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_language_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('language_id', languageId)
            .maybeSingle();
            
          if (progressError) {
            console.error('Erreur lors de la récupération de la progression:', progressError);
          } else if (progressData) {
            setProgress(progressData as UserProgress);
          } else {
            // Créer une nouvelle entrée de progression par défaut
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
        console.error('Erreur lors de la récupération des données:', err);
        setError(err);
        toast.error('Erreur lors du chargement du résumé');
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryAndProgress();
  }, [languageId, user]);

  const markAsRead = async () => {
    if (!user || !languageId) return;
    
    try {
      let progData = progress;
      
      if (!progData) {
        // Créer une nouvelle entrée de progression
        progData = {
          user_id: user.id,
          language_id: languageId,
          summary_read: true,
          quiz_completed: false,
          badge_earned: false
        };
      } else {
        progData.summary_read = true;
      }
      
      const { data, error } = await supabase
        .from('user_language_progress')
        .upsert([progData], { onConflict: 'user_id,language_id' })
        .select()
        .single();
        
      if (error) throw error;
      
      setProgress(data as UserProgress);
      toast.success('Résumé marqué comme lu !');
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de la progression:', err);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return { summary, progress, loading, error, markAsRead };
};
