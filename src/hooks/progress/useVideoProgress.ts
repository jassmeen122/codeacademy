
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthState } from '../useAuthState';
import { useStudentActivity } from '../useStudentActivity';

export const useVideoProgress = () => {
  const [updating, setUpdating] = useState(false);
  const { user } = useAuthState();
  const { trackLessonViewed, trackCourseCompleted } = useStudentActivity();

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

  return {
    trackVideoProgress,
    updating
  };
};
