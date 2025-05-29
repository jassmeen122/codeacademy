
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Code, Terminal, Database, Cpu } from 'lucide-react';

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

  const getSkillLevel = (progress: number) => {
    if (progress < 30) return { level: 'Débutant', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' };
    if (progress < 70) return { level: 'Intermédiaire', color: 'text-blue-500', bgColor: 'bg-blue-500/10' };
    return { level: 'Avancé', color: 'text-green-500', bgColor: 'bg-green-500/10' };
  };

  const skillInfo = getSkillLevel(progressValue);

  const getIconComponent = () => {
    switch (icon) {
      case '💻': return <Code className="h-8 w-8 text-tech-blue" />;
      case '🧠': return <Cpu className="h-8 w-8 text-robot-primary" />;
      case '📚': return <Terminal className="h-8 w-8 text-education-primary" />;
      default: return <Database className="h-8 w-8 text-tech-blue" />;
    }
  };

  return (
    <Card className="professional-card tech-glow hover:border-primary/50 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          {getIconComponent()}
          <span className="font-display font-semibold text-foreground">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${skillInfo.bgColor} ${skillInfo.color} border border-current/20`}>
              {skillInfo.level}
            </div>
            <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
              <span>Progression</span>
            </div>
          </div>

          <div className="flex justify-between items-center font-mono">
            <span className="text-sm text-muted-foreground">
              [{current}/{total}]
            </span>
            <span className="text-sm font-bold text-primary">
              {progressValue}%
            </span>
          </div>
          
          <div className="relative">
            <Progress 
              value={progressValue} 
              className="h-3 bg-secondary border border-border tech-progress" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded opacity-50 animate-data-flow"></div>
          </div>

          <div className="text-xs text-muted-foreground text-center font-mono">
            {progressValue === 100 ? '✅ Compétence maîtrisée' : 
             progressValue > 75 ? '🚀 Excellent progrès' : 
             progressValue > 50 ? '📈 En bonne voie' : 
             progressValue > 25 ? '🌱 Début prometteur' : 
             '🎯 Commencer l\'apprentissage'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
