
import React from 'react';
import { UserRecommendation } from '@/types/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, ChevronRight, BookOpen, Code, Clock, Zap } from "lucide-react";

interface RecommendationsListProps {
  recommendations: UserRecommendation[];
  loading: boolean;
  onRecommendationClick: (id: string, type: string, itemId: string) => void;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations, loading, onRecommendationClick }) => {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (recommendations.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-10 text-muted-foreground">
            <Lightbulb className="h-10 w-10 text-amber-300 mx-auto mb-2" />
            <p>No recommendations yet!</p>
            <p className="text-sm">Complete more courses and exercises to get personalized suggestions.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Helper to get appropriate icon based on recommendation type
  const getIconForType = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'exercise':
        return <Code className="h-4 w-4 text-green-500" />;
      case 'skill':
        return <Zap className="h-4 w-4 text-purple-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.slice(0, 5).map((rec) => (
            <div
              key={rec.id}
              className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${rec.is_viewed ? 'opacity-60' : ''}`}
              onClick={() => onRecommendationClick(rec.id, rec.recommendation_type, rec.item_id)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  {getIconForType(rec.recommendation_type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium line-clamp-1">
                      {rec.item_title || 'Recommended Content'}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {rec.recommendation_type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {rec.reason || 'Based on your learning patterns'}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
