
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Code,
  Trophy,
  ArrowRight,
  Lightbulb,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRecommendation } from '@/types/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface RecommendationsListProps {
  recommendations: UserRecommendation[];
  loading: boolean;
  onRecommendationClick: (id: string, type: string, itemId: string) => void;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
  loading,
  onRecommendationClick
}) => {
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-10 w-10 text-blue-500" />;
      case 'exercise':
        return <Code className="h-10 w-10 text-green-500" />;
      case 'skill':
        return <Trophy className="h-10 w-10 text-amber-500" />;
      default:
        return <Lightbulb className="h-10 w-10 text-purple-500" />;
    }
  };

  const getNavigationPath = (type: string, itemId: string) => {
    switch (type) {
      case 'course':
        return `/student/courses/${itemId}/details`;
      case 'exercise':
        return `/student/exercises?id=${itemId}`;
      case 'skill':
        return `/student/progress`;
      default:
        return '/student';
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recommendations For You</CardTitle>
        </CardHeader>
        <CardContent>
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-start space-x-4 mb-4 p-3">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="mr-2 h-5 w-5 text-yellow-500" />
          Recommendations For You
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map(rec => (
              <div 
                key={rec.id} 
                className="flex items-start space-x-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  {getIcon(rec.recommendation_type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-lg">{rec.item_title || rec.item_id}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {rec.item_description || rec.reason || 'Recommended for your learning journey'}
                  </p>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      onRecommendationClick(rec.id, rec.recommendation_type, rec.item_id);
                      navigate(getNavigationPath(rec.recommendation_type, rec.item_id));
                    }}
                    className="flex items-center"
                  >
                    Check it out
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Lightbulb className="mx-auto h-12 w-12 mb-2 text-gray-400" />
            <p>No recommendations available yet.</p>
            <p className="text-sm">Complete more activities to get personalized suggestions!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
