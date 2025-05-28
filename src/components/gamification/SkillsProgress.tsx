
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Code, Database, Server, Smartphone, Cloud } from 'lucide-react';
import type { UserSkill } from '@/types/gamification';

interface SkillsProgressProps {
  skills: UserSkill[];
  loading?: boolean;
}

const skillIcons: Record<string, React.ComponentType<any>> = {
  'JavaScript': Code,
  'React': Code,
  'TypeScript': Code,
  'Node.js': Server,
  'Python': Code,
  'SQL': Database,
  'HTML/CSS': Code,
  'Mobile': Smartphone,
  'DevOps': Cloud,
};

const getSkillBadge = (progress: number) => {
  if (progress >= 90) return { label: 'Expert', color: 'bg-purple-500' };
  if (progress >= 70) return { label: 'Avancé', color: 'bg-blue-500' };
  if (progress >= 40) return { label: 'Intermédiaire', color: 'bg-green-500' };
  if (progress >= 10) return { label: 'Débutant', color: 'bg-yellow-500' };
  return { label: 'Novice', color: 'bg-gray-500' };
};

export const SkillsProgress: React.FC<SkillsProgressProps> = ({ skills, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Vos Compétences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Vos Compétences
        </CardTitle>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Commencez à apprendre pour débloquer vos compétences !</p>
          </div>
        ) : (
          <div className="space-y-4">
            {skills.map((skill) => {
              const IconComponent = skillIcons[skill.skill_name] || Code;
              const badge = getSkillBadge(skill.progress);
              
              return (
                <div key={skill.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{skill.skill_name}</span>
                      <Badge variant="secondary" className={`${badge.color} text-white text-xs`}>
                        {badge.label}
                      </Badge>
                    </div>
                    <span className="text-sm font-semibold">{skill.progress}%</span>
                  </div>
                  <Progress value={skill.progress} className="h-2" />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
