
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PointsDisplayProps {
  points: number;
  loading: boolean;
}

export const PointsDisplay: React.FC<PointsDisplayProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Points</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Points tracking feature is currently under development.</p>
      </CardContent>
    </Card>
  );
};
