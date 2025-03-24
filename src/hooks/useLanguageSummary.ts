
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from './useAuthState';

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
        
        // Check if the input is a UUID or a language name
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(languageIdOrName);
        
        let languageId: string;
        
        // If it's not a UUID, fetch the language ID by name
        if (!isUuid) {
          const { data: langData, error: langError } = await supabase
            .from('programming_languages')
            .select('id')
            .ilike('name', languageIdOrName)
            .single();
          
          if (langError) {
            throw new Error(`Language not found: ${languageIdOrName}`);
          }
          
          languageId = langData.id;
        } else {
          languageId = languageIdOrName;
        }
        
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

  async function markAsRead() {
    if (!user || !languageIdOrName) {
      toast.error('Vous devez être connecté pour marquer comme lu');
      return false;
    }
    
    try {
      // Ensure we have the language ID (not name)
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(languageIdOrName);
      let languageId: string;
      
      if (!isUuid) {
        const { data: langData, error: langError } = await supabase
          .from('programming_languages')
          .select('id')
          .ilike('name', languageIdOrName)
          .single();
        
        if (langError) throw new Error(`Language not found: ${languageIdOrName}`);
        languageId = langData.id;
      } else {
        languageId = languageIdOrName;
      }
      
      // If progress record exists, update it, otherwise create a new one
      if (userProgress) {
        const { error } = await supabase
          .from('user_language_progress')
          .update({
            summary_read: true,
            last_updated: new Date().toISOString()
          })
          .eq('id', userProgress.id);
          
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
      
      // Update local state
      setUserProgress(prev => ({
        ...(prev || {
          id: '',
          user_id: user.id,
          language_id: languageId,
          quiz_completed: false,
          badge_earned: false,
          last_updated: new Date().toISOString()
        }),
        summary_read: true
      } as UserLanguageProgress));
      
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

  async function checkAndUpdateBadge(languageId: string, userId: string) {
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
        
        // Update user points
        const { error: pointsError } = await supabase
          .from('profiles')
          .update({
            points: user?.points ? user.points + 100 : 100
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

  async function updateUserGamification(userId: string, badgeName: string) {
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

  return { 
    summary, 
    userProgress, 
    loading, 
    error, 
    markAsRead 
  };
}
