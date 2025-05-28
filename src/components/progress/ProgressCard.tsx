
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
    <Card className="w-full cyber-card hover-glow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg font-mono">
          <span className="text-3xl animate-hologram">{icon}</span>
          <span className="text-cyber-gradient">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center font-mono">
            <span className="text-sm text-neon-green terminal-text">
              [{current}/{total}]
            </span>
            <span className="text-sm font-bold text-neon-blue">
              {progressValue}%
            </span>
          </div>
          <div className="relative">
            <Progress 
              value={progressValue} 
              className="h-4 bg-black/60 border border-neon-blue/30 cyber-progress" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded animate-data-flow opacity-50"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
