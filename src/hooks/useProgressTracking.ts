
import { useQuizProgress } from './progress/useQuizProgress';
import { useSummaryProgress } from './progress/useSummaryProgress';
import { useVideoProgress } from './progress/useVideoProgress';

export const useProgressTracking = () => {
  const { trackSummaryRead, updating: summaryUpdating } = useSummaryProgress();
  const { trackQuizCompletion, updating: quizUpdating } = useQuizProgress();
  const { trackVideoProgress, updating: videoUpdating } = useVideoProgress();
  
  // Determine if any tracking operation is in progress
  const updating = summaryUpdating || quizUpdating || videoUpdating;

  return {
    trackSummaryRead,
    trackQuizCompletion,
    trackVideoProgress,
    updating
  };
};
