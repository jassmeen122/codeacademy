
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { Badge } from '@/types/userProgress';
import { Trophy, Award, Target } from 'lucide-react';

interface BadgesSectionProps {
  earnedBadges: Badge[];
  availableBadges: Badge[];
}

export const BadgesSection: React.FC<BadgesSectionProps> = ({
  earnedBadges,
  availableBadges
}) => {
  return (
    <Card className="professional-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-display">
          <Trophy className="h-6 w-6 text-education-secondary" />
          <span className="text-foreground">Réalisations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Badges obtenus */}
          <div>
            <h3 className="font-semibold text-education-primary mb-3 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Compétences débloquées
            </h3>
            <div className="space-y-3">
              {earnedBadges.length > 0 ? (
                earnedBadges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-education-primary/10 to-robot-primary/10 rounded-lg border border-education-primary/20 subtle-pulse">
                    <div className="text-2xl">{badge.icon}</div>
                    <div>
                      <div className="font-semibold text-education-primary flex items-center gap-2">
                        {badge.name}
                        <Trophy className="h-4 w-4" />
                      </div>
                      <div className="text-sm text-muted-foreground">{badge.description}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground p-4 border border-dashed border-border rounded-lg text-center">
                  Aucune réalisation débloquée pour le moment. Continuez à apprendre !
                </div>
              )}
            </div>
          </div>

          {/* Badges à obtenir */}
          <div>
            <h3 className="font-semibold text-robot-primary mb-3 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objectifs à atteindre
            </h3>
            <div className="space-y-3">
              {availableBadges
                .filter(badge => !earnedBadges.find(earned => earned.id === badge.id))
                .slice(0, 3)
                .map(badge => (
                  <div key={badge.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="text-2xl opacity-50 grayscale">{badge.icon}</div>
                    <div>
                      <div className="font-semibold text-muted-foreground">
                        {badge.name}
                      </div>
                      <div className="text-sm text-muted-foreground/70">{badge.description}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Statistiques */}
          <div className="p-4 bg-gradient-to-r from-tech-blue/5 to-robot-primary/5 rounded-lg border border-tech-blue/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progression générale</span>
              <span className="font-semibold text-primary">
                {earnedBadges.length}/{availableBadges.length} réalisations
              </span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(earnedBadges.length / availableBadges.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
