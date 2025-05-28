
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

  // Déterminer le niveau éducatif basé sur le pourcentage
  const getLevelBadge = (progress: number) => {
    if (progress < 30) return { level: 'BEGINNER', emoji: '🌱', class: 'level-beginner' };
    if (progress < 70) return { level: 'INTERMEDIATE', emoji: '📚', class: 'level-intermediate' };
    return { level: 'ADVANCED', emoji: '🎓', class: 'level-advanced' };
  };

  const levelInfo = getLevelBadge(progressValue);

  return (
    <Card className="w-full cyber-card hover-glow knowledge-glow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg font-mono">
          <span className="text-3xl animate-knowledge-hologram">{icon}</span>
          <span className="text-cyber-gradient">{title}</span>
          <span className="text-xl animate-bulb-flash">💡</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Niveau éducatif */}
          <div className="flex justify-between items-center">
            <div className={`level-badge ${levelInfo.class}`}>
              <span>{levelInfo.emoji}</span>
              <span className="text-xs">{levelInfo.level}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-mono text-education-gold">
              <span>📖</span>
              <span>Study Progress</span>
            </div>
          </div>

          <div className="flex justify-between items-center font-mono">
            <span className="text-sm text-learning-teal terminal-text flex items-center gap-1">
              <span>📊</span>
              [{current}/{total}]
            </span>
            <span className="text-sm font-bold text-education-gold flex items-center gap-1">
              <span>🎯</span>
              {progressValue}%
            </span>
          </div>
          
          <div className="relative progress-book">
            <Progress 
              value={progressValue} 
              className="h-4 bg-black/60 border border-knowledge-blue/30 cyber-progress study-focus" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-knowledge-blue/20 to-education-gold/20 rounded animate-educational-data-flow opacity-50"></div>
            
            {/* Indicateurs de progression éducative */}
            <div className="absolute -top-2 -right-2 text-xs animate-diploma-shine">
              {progressValue === 100 ? '🏆' : progressValue > 75 ? '🥇' : progressValue > 50 ? '🥈' : progressValue > 25 ? '🥉' : '📝'}
            </div>
          </div>

          {/* Message d'encouragement éducatif */}
          <div className="text-xs text-learning-teal/70 font-mono text-center">
            {progressValue === 100 ? '🎓 Mastery achieved! ' : 
             progressValue > 75 ? '📚 Excellent progress! ' : 
             progressValue > 50 ? '💡 Keep learning! ' : 
             progressValue > 25 ? '🌱 Good start! ' : 
             '📖 Begin your journey!'}
            <span className="animate-book-study">📚</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
