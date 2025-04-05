
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const GamificationStats = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gamification Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Gamification features are currently under development.</p>
      </CardContent>
    </Card>
  );
};
