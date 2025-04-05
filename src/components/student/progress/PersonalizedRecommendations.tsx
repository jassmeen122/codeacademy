
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Code, Clock, ChevronRight, Lightbulb, Zap, BarChart2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { UserRecommendation } from '@/types/progress';
import { useRouter } from 'react-router-dom';

interface PersonalizedRecommendationsProps {
  recommendations: UserRecommendation[];
  loading: boolean;
  onRecommendationClick: (id: string, type: string, itemId: string) => void;
}

export const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  recommendations,
  loading,
  onRecommendationClick
}) => {
  const router = useRouter();
  
  // Helper to get appropriate icon based on recommendation type
  const getIconForType = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      case 'exercise':
        return <Code className="h-5 w-5 text-green-500" />;
      case 'skill':
        return <BarChart2 className="h-5 w-5 text-purple-500" />;
      case 'module':
        return <Lightbulb className="h-5 w-5 text-amber-500" />;
      default:
        return <Zap className="h-5 w-5 text-indigo-500" />;
    }
  };
  
  // Helper to get appropriate action text based on recommendation type
  const getActionTextForType = (type: string) => {
    switch (type) {
      case 'course':
        return 'Start Course';
      case 'exercise':
        return 'Practice Now';
      case 'skill':
        return 'Improve Skill';
      case 'module':
        return 'Continue Learning';
      default:
        return 'Explore';
    }
  };
  
  // Helper to navigate based on recommendation type
  const handleNavigate = (recommendation: UserRecommendation) => {
    // Mark as viewed first
    onRecommendationClick(
      recommendation.id, 
      recommendation.recommendation_type, 
      recommendation.item_id
    );
    
    // Then navigate to appropriate page
    switch (recommendation.recommendation_type) {
      case 'course':
        router.navigate(`/student/courses/${recommendation.item_id}`);
        break;
      case 'exercise':
        router.navigate(`/student/exercises?id=${recommendation.item_id}`);
        break;
      case 'module':
        router.navigate(`/student/courses/modules/${recommendation.item_id}`);
        break;
      case 'skill':
        router.navigate(`/student/progress?skill=${recommendation.item_id}`);
        break;
      default:
        router.navigate(`/student/dashboard`);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
          <CardDescription>Content tailored for your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Personalized Recommendations
        </CardTitle>
        <CardDescription>Content tailored for your learning journey</CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((recommendation) => (
              <div 
                key={recommendation.id}
                className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleNavigate(recommendation)}
              >
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    {getIconForType(recommendation.recommendation_type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{recommendation.item_title || 'Recommended Item'}</h4>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {recommendation.item_description || recommendation.reason || 'Based on your learning patterns'}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {recommendation.recommendation_type.charAt(0).toUpperCase() + recommendation.recommendation_type.slice(1)}
                      </span>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-blue-600">
                        {getActionTextForType(recommendation.recommendation_type)}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p>No recommendations yet!</p>
            <p className="text-sm">Complete more courses and exercises to get personalized suggestions.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <Button 
          variant="outline"
          onClick={() => router.navigate('/student/progress')}
        >
          View All Recommendations
        </Button>
      </CardFooter>
    </Card>
  );
};
