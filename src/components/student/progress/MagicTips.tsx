
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MagicTipsProps {
  points: number;
  recentSuccess: boolean;
}

export const MagicTips: React.FC<MagicTipsProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Learning tips feature is currently under development.</p>
      </CardContent>
    </Card>
  );
};
