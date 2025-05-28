
import { supabase } from '@/integrations/supabase/client';
import { defaultLanguageSummaries } from '@/data/languageSummaryData';
import { toast } from 'sonner';

export interface LanguageSummary {
  id: string;
  language_id: string;
  title: string;
  content: string;
  created_at: string;
}

export interface UserProgress {
  id?: string;
  user_id: string;
  language_id: string;
  summary_read: boolean;
  quiz_completed: boolean;
  badge_earned: boolean;
  last_updated?: string;
}

/**
 * Fetches a language summary from the database
 * @param languageId The ID of the language to fetch
 * @returns The language summary or null if not found
 */
export const fetchLanguageSummary = async (languageId: string): Promise<LanguageSummary | null> => {
  try {
    const { data, error } = await supabase
      .from('language_summaries')
      .select('*')
      .eq('language_id', languageId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching language summary:', error);
      return null;
    }
    
    return data as LanguageSummary;
  } catch (err) {
    console.error('Exception fetching language summary:', err);
    return null;
  }
};

/**
 * Creates a default summary for a language in the database
 * @param languageId The ID of the language
 * @returns The created language summary or null if creation failed
 */
export const createDefaultSummary = async (languageId: string): Promise<LanguageSummary | null> => {
  try {
    // Check if we have a default summary for this language
    const defaultSummary = defaultLanguageSummaries[languageId as keyof typeof defaultLanguageSummaries];
    
    if (!defaultSummary) {
      console.error(`No default summary available for language: ${languageId}`);
      return null;
    }
    
    // Create a summary object with the default content
    const summaryData = {
      language_id: languageId,
      title: defaultSummary.title,
      content: defaultSummary.content
    };
    
    // Insert into the database
    const { data, error } = await supabase
      .from('language_summaries')
      .insert([summaryData])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating default summary:', error);
      return null;
    }
    
    console.log('Default summary created successfully');
    return data as LanguageSummary;
  } catch (err) {
    console.error('Exception creating default summary:', err);
    return null;
  }
};

/**
 * Fetches the user's progress for a language (using local storage)
 * @param userId The user's ID
 * @param languageId The language ID
 * @returns The user's progress or null if not found
 */
export const fetchUserProgress = async (userId: string, languageId: string): Promise<UserProgress | null> => {
  try {
    // Use local storage since the table doesn't exist in the database
    const localProgressKey = `language_progress_${userId}_${languageId}`;
    const localProgress = localStorage.getItem(localProgressKey);
    
    if (localProgress) {
      return JSON.parse(localProgress) as UserProgress;
    }
    
    return null;
  } catch (err) {
    console.error('Exception fetching user progress:', err);
    return null;
  }
};

/**
 * Creates or updates a user's progress for a language (using local storage)
 * @param progress The progress data to save
 * @returns The updated progress or null if the operation failed
 */
export const saveUserProgress = async (progress: UserProgress): Promise<UserProgress | null> => {
  try {
    // Use local storage since the table doesn't exist in the database
    const localProgressKey = `language_progress_${progress.user_id}_${progress.language_id}`;
    localStorage.setItem(localProgressKey, JSON.stringify(progress));
    
    return progress;
  } catch (err) {
    console.error('Exception saving user progress:', err);
    toast.error('Erreur lors de la mise à jour');
    return null;
  }
};

/**
 * Gets a default summary for a language without saving to the database
 * @param languageId The language ID
 * @returns A constructed language summary object
 */
export const getDefaultSummaryContent = (languageId: string): LanguageSummary | null => {
  const defaultSummary = defaultLanguageSummaries[languageId as keyof typeof defaultLanguageSummaries];
  
  if (!defaultSummary) {
    return null;
  }
  
  return {
    id: 'temp-id',
    language_id: languageId,
    title: defaultSummary.title,
    content: defaultSummary.content,
    created_at: new Date().toISOString()
  };
};
