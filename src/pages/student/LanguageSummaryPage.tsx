import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SummaryContent } from '@/components/courses/SummaryContent';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { useLanguageSummary } from '@/hooks/useLanguageSummary';
import { useProgressTracking } from '@/hooks/useProgressTracking';

const LanguageSummaryPage = () => {
  const { languageId } = useParams<{ languageId: string }>();
  const navigate = useNavigate();
  const { summary, progress, loading, error, markAsRead: markSummaryAsRead } = useLanguageSummary(languageId);
  const { trackSummaryRead, updating } = useProgressTracking();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMarkAsRead = async () => {
    if (languageId && summary) {
      setIsUpdating(true);
      try {
        await trackSummaryRead(languageId, summary.title);
        await markSummaryAsRead();
        window.location.reload();
      } catch (error) {
        console.error("Erreur lors du marquage comme lu:", error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleStartQuiz = () => {
    if (languageId) {
      navigate(`/student/language-quiz/${languageId}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/student/languages`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Languages
          </Button>
          
          <div className="flex gap-3">
            {progress?.summary_read && (
              <Button 
                onClick={handleStartQuiz}
                className="flex items-center"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                {progress?.quiz_completed ? 'Retake Quiz' : 'Start Quiz'}
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-[600px]" />
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-medium text-gray-800 mb-2">Error Loading Summary</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              There was an issue loading the language summary. Please try again later.
            </p>
          </div>
        ) : summary ? (
          <SummaryContent 
            title={summary.title} 
            content={summary.content}
            isRead={progress?.summary_read}
            onMarkAsRead={!progress?.summary_read ? handleMarkAsRead : undefined}
          />
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-medium text-gray-800 mb-2">No Summary Found</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find a summary for this language. Try exploring other language options.
            </p>
          </div>
        )}
        
        {progress?.summary_read && !progress?.quiz_completed && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-md">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Ready to test your knowledge?</h3>
            <p className="text-blue-700 mb-4">Now that you've read the summary, take the quiz to reinforce your learning!</p>
            <Button 
              onClick={handleStartQuiz}
              disabled={updating || isUpdating}
              className="flex items-center"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Quiz
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LanguageSummaryPage;
