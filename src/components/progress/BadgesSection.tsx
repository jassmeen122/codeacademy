
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
    <Card className="w-full cyber-card hover-glow knowledge-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-mono">
          <span className="text-3xl animate-knowledge-hologram">🎓</span>
          <span className="text-cyber-gradient">ACHIEVEMENT_VAULT</span>
          <span className="text-xl animate-bulb-flash">💡</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Badges obtenus */}
          <div className="learning-indicator">
            <h3 className="font-mono font-bold text-education-gold mb-3 terminal-text">
              [KNOWLEDGE_UNLOCKED] 📚
            </h3>
            <div className="space-y-3">
              {earnedBadges.length > 0 ? (
                earnedBadges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-4 p-3 bg-gradient-to-r from-education-gold/10 to-knowledge-blue/10 rounded-lg border border-education-gold/30 cyber-badge study-focus">
                    <span className="text-2xl animate-diploma-shine">{badge.icon}</span>
                    <div className="font-mono">
                      <div className="font-bold text-education-gold flex items-center gap-2">
                        {badge.name}
                        <span className="text-sm">🏆</span>
                      </div>
                      <div className="text-xs text-learning-teal/80">{badge.description}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground font-mono terminal-text">
                  {`> No knowledge badges earned yet... Start learning! 📖`}
                </div>
              )}
            </div>
          </div>

          {/* Badges à obtenir */}
          <div>
            <h3 className="font-mono font-bold text-knowledge-blue mb-3 flex items-center gap-2">
              [LEARNING_OBJECTIVES] 🎯
              <span className="text-sm animate-book-study">📚</span>
            </h3>
            <div className="space-y-3">
              {availableBadges
                .filter(badge => !earnedBadges.find(earned => earned.id === badge.id))
                .slice(0, 3)
                .map(badge => (
                  <div key={badge.id} className="flex items-center gap-4 p-3 bg-gradient-to-r from-gray-500/10 to-transparent rounded-lg border border-gray-500/30 educational-pattern">
                    <span className="text-2xl grayscale opacity-50">{badge.icon}</span>
                    <div className="font-mono">
                      <div className="font-bold text-gray-400 flex items-center gap-2">
                        {badge.name}
                        <span className="text-xs">📝</span>
                      </div>
                      <div className="text-xs text-gray-500">{badge.description}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Indicateur de progression éducative */}
          <div className="mt-6 p-3 bg-gradient-to-r from-knowledge-blue/5 to-education-gold/5 rounded-lg border border-learning-teal/20">
            <div className="flex items-center gap-2 text-sm font-mono text-learning-teal">
              <span className="animate-bulb-flash">💡</span>
              <span>Knowledge Progress: {earnedBadges.length}/{availableBadges.length} achievements</span>
              <span className="animate-book-study">📊</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
