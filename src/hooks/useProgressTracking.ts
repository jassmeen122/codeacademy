
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthState } from './useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { useStudentActivity } from './useStudentActivity';

export const useProgressTracking = () => {
  const [updating, setUpdating] = useState(false);
  const { user } = useAuthState();
  const { 
    trackLessonViewed,
    trackExerciseCompleted,
    trackCourseCompleted 
  } = useStudentActivity();

  // Track summary read progress
  const trackSummaryRead = async (languageId: string, languageName: string) => {
    if (!user) {
      toast.error('Please log in to track your progress');
      return false;
    }

    try {
      setUpdating(true);

      // Update language progress
      const { error } = await supabase
        .from('user_language_progress')
        .upsert({
          user_id: user.id,
          language_id: languageId,
          summary_read: true,
          last_updated: new Date().toISOString()
        }, { 
          onConflict: 'user_id,language_id' 
        });

      if (error) throw error;

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

  // Track quiz completion progress
  const trackQuizCompletion = async (
    languageId: string, 
    languageName: string, 
    isPassed: boolean, 
    score: number
  ) => {
    if (!user) {
      toast.error('Please log in to track your progress');
      return false;
    }

    try {
      setUpdating(true);

      // Update language progress
      const { error } = await supabase
        .from('user_language_progress')
        .upsert({
          user_id: user.id,
          language_id: languageId,
          quiz_completed: isPassed,
          last_updated: new Date().toISOString()
        }, { 
          onConflict: 'user_id,language_id' 
        });

      if (error) throw error;

      // Check if the user passed and deserves a badge
      if (isPassed) {
        await checkAndAwardBadge(user.id, languageId);
      }

      // Record activity with score
      await trackExerciseCompleted(
        `quiz-${languageId}`, 
        languageName,
        score
      );

      toast.success(isPassed ? 'Quiz passed! Progress updated!' : 'Quiz completed! Keep practicing!');
      return true;
    } catch (error) {
      console.error('Error tracking quiz completion:', error);
      toast.error('Failed to update progress');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  // Track video viewing progress
  const trackVideoProgress = async (
    videoId: string,
    languageOrCourseName: string,
    progressPercent: number,
    isLanguageVideo: boolean = true
  ) => {
    if (!user) {
      toast.error('Please log in to track your progress');
      return false;
    }

    try {
      setUpdating(true);

      // Only count as "watched" if they've viewed at least 90% of the video
      const isCompleted = progressPercent >= 90;
      
      if (isCompleted) {
        if (isLanguageVideo) {
          // It's a language tutorial video
          await trackLessonViewed(
            videoId,
            languageOrCourseName,
            'video'
          );
          
          toast.success('Video progress saved!');
        } else {
          // It's a course video
          await trackCourseCompleted(
            videoId,
            languageOrCourseName,
            'video-course'
          );
          
          toast.success('Course video completed!');
        }
      }

      return isCompleted;
    } catch (error) {
      console.error('Error tracking video progress:', error);
      toast.error('Failed to update progress');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  // Check if badge should be awarded
  const checkAndAwardBadge = async (userId: string, languageId: string) => {
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

  return {
    trackSummaryRead,
    trackQuizCompletion,
    trackVideoProgress,
    updating
  };
};
