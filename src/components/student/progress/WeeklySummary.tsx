
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeeklySummaryProps {
  weeklyPoints: number;
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Weekly summary feature is currently under development.</p>
      </CardContent>
    </Card>
  );
};
