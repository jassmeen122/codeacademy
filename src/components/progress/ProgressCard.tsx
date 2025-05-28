
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  icon: string;
  percentage?: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  current,
  total,
  icon,
  percentage
}) => {
  const progressValue = percentage !== undefined ? percentage : 
    total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {current} sur {total}
            </span>
            <span className="text-sm font-medium">
              {progressValue}%
            </span>
          </div>
          <Progress value={progressValue} className="h-3" />
        </div>
      </CardContent>
    </Card>
  );
};
