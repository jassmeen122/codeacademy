
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { getLanguageId } from '../utils/languageUtils';
import { markSummaryAsRead } from './useLanguageProgress';

interface LanguageSummary {
  id: string;
  language_id: string;
  title: string;
  content: string;
  created_at: string;
}

interface UserLanguageProgress {
  id: string;
  user_id: string;
  language_id: string;
  summary_read: boolean;
  quiz_completed: boolean;
  badge_earned: boolean;
  last_updated: string;
}

export function useLanguageSummary(languageIdOrName: string | null) {
  const [summary, setSummary] = useState<LanguageSummary | null>(null);
  const [userProgress, setUserProgress] = useState<UserLanguageProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthState();

  useEffect(() => {
    if (!languageIdOrName) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        
        // Get the language ID (from name or UUID)
        const languageId = await getLanguageId(languageIdOrName);
        
        // Fetch language summary using the language ID
        const { data: summaryData, error: summaryError } = await supabase
          .from('language_summaries')
          .select('*')
          .eq('language_id', languageId)
          .single();
          
        if (summaryError) {
          console.error('Error fetching summary:', summaryError);
          
          // Check if the language exists but has no summary
          const { data: langData, error: langError } = await supabase
            .from('programming_languages')
            .select('*')
            .eq('id', languageId)
            .single();
            
          if (langError) {
            throw new Error(`Language not found: ${langError.message}`);
          }
          
          // Language exists but no summary found
          throw new Error(`No summary available for ${langData.name}`);
        }
        
        setSummary(summaryData as LanguageSummary);
        
        // If user is logged in, fetch their progress
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_language_progress')
            .select('*')
            .eq('language_id', languageId)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (progressError && progressError.code !== 'PGRST116') throw progressError;
          setUserProgress(progressData as UserLanguageProgress);
        }
      } catch (err: any) {
        console.error('Error fetching language summary:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [languageIdOrName, user]);

  const handleMarkAsRead = async () => {
    const success = await markSummaryAsRead(user, languageIdOrName as string);
    
    if (success) {
      // Update local state
      setUserProgress(prev => ({
        ...(prev || {
          id: '',
          user_id: user?.id as string,
          language_id: '',  // Will be set correctly below
          quiz_completed: false,
          badge_earned: false,
          last_updated: new Date().toISOString()
        }),
        language_id: prev?.language_id || '', // This will be correct after the API call
        summary_read: true
      } as UserLanguageProgress));
    }
    
    return success;
  };

  return { 
    summary, 
    userProgress, 
    loading, 
    error, 
    markAsRead: handleMarkAsRead 
  };
}
