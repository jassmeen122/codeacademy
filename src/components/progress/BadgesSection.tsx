
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
    <Card className="w-full cyber-card hover-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-mono">
          <span className="text-3xl animate-hologram">🏅</span>
          <span className="text-cyber-gradient">ACHIEVEMENT_LOG</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Badges obtenus */}
          <div>
            <h3 className="font-mono font-bold text-neon-green mb-3 terminal-text">
              [UNLOCKED_BADGES]
            </h3>
            <div className="space-y-3">
              {earnedBadges.length > 0 ? (
                earnedBadges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-4 p-3 bg-gradient-to-r from-neon-green/10 to-transparent rounded-lg border border-neon-green/30 cyber-badge">
                    <span className="text-2xl animate-cyber-glow">{badge.icon}</span>
                    <div className="font-mono">
                      <div className="font-bold text-neon-green">{badge.name}</div>
                      <div className="text-xs text-green-300/80">{badge.description}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground font-mono terminal-text">
                  > No achievements unlocked yet...
                </div>
              )}
            </div>
          </div>

          {/* Badges à obtenir */}
          <div>
            <h3 className="font-mono font-bold text-neon-purple mb-3">
              [NEXT_TARGETS]
            </h3>
            <div className="space-y-3">
              {availableBadges
                .filter(badge => !earnedBadges.find(earned => earned.id === badge.id))
                .slice(0, 3)
                .map(badge => (
                  <div key={badge.id} className="flex items-center gap-4 p-3 bg-gradient-to-r from-gray-500/10 to-transparent rounded-lg border border-gray-500/30">
                    <span className="text-2xl grayscale opacity-50">{badge.icon}</span>
                    <div className="font-mono">
                      <div className="font-bold text-gray-400">{badge.name}</div>
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
