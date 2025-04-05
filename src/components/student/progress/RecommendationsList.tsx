
import React from 'react';
import { UserRecommendation } from '@/types/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RecommendationsListProps {
  recommendations: UserRecommendation[];
  loading: boolean;
  onRecommendationClick: (id: string, type: string, itemId: string) => void;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations, loading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Recommendations feature is currently under development.</p>
      </CardContent>
    </Card>
  );
};
