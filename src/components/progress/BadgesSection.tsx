
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { Badge } from '@/types/userProgress';

interface BadgesSectionProps {
  earnedBadges: Badge[];
  availableBadges: Badge[];
}

export const BadgesSection: React.FC<BadgesSectionProps> = ({
  earnedBadges,
  availableBadges
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🏅</span>
          Mes Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Badges obtenus */}
          <div>
            <h3 className="font-medium text-green-600 mb-2">✅ Badges obtenus</h3>
            <div className="space-y-2">
              {earnedBadges.length > 0 ? (
                earnedBadges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                    <span className="text-xl">{badge.icon}</span>
                    <div>
                      <div className="font-medium text-green-700">{badge.name}</div>
                      <div className="text-xs text-green-600">{badge.description}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Aucun badge obtenu pour le moment</p>
              )}
            </div>
          </div>

          {/* Badges à obtenir */}
          <div>
            <h3 className="font-medium text-gray-600 mb-2">🎯 Prochains badges</h3>
            <div className="space-y-2">
              {availableBadges
                .filter(badge => !earnedBadges.find(earned => earned.id === badge.id))
                .slice(0, 3)
                .map(badge => (
                  <div key={badge.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <span className="text-xl grayscale">{badge.icon}</span>
                    <div>
                      <div className="font-medium text-gray-700">{badge.name}</div>
                      <div className="text-xs text-gray-500">{badge.description}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
