
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Lock, Star, Flame, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  earned: boolean;
  progress?: number;
  category: 'coding' | 'consistency' | 'achievement' | 'social';
}

interface InteractiveBadgesProps {
  badges: BadgeData[];
  onBadgeClick?: (badge: BadgeData) => void;
}

export const InteractiveBadges: React.FC<InteractiveBadgesProps> = ({ badges, onBadgeClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);

  const categories = [
    { key: 'all', label: 'Tous', icon: '🏆' },
    { key: 'coding', label: 'Programmation', icon: '💻' },
    { key: 'consistency', label: 'Régularité', icon: '🔥' },
    { key: 'achievement', label: 'Accomplissement', icon: '⭐' },
    { key: 'social', label: 'Social', icon: '🤝' }
  ];

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const earnedCount = badges.filter(b => b.earned).length;
  const totalCount = badges.length;

  const getBadgeStyle = (badge: BadgeData) => {
    if (badge.earned) {
      return 'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 shadow-lg';
    }
    if (badge.progress && badge.progress > 0) {
      return 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200';
    }
    return 'bg-gray-50 border border-gray-200 opacity-75';
  };

  const getBadgeIcon = (badge: BadgeData) => {
    if (badge.earned) {
      return <Trophy className="h-6 w-6 text-yellow-600" />;
    }
    if (badge.progress && badge.progress > 0) {
      return <Star className="h-6 w-6 text-blue-600" />;
    }
    return <Lock className="h-6 w-6 text-gray-400" />;
  };

  return (
    <Card className="professional-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            Badges Interactifs
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {earnedCount}/{totalCount}
          </Badge>
        </div>
        
        {/* Barre de progression globale */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression des badges</span>
            <span>{Math.round((earnedCount / totalCount) * 100)}%</span>
          </div>
          <Progress value={(earnedCount / totalCount) * 100} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.key)}
              className="flex items-center gap-2"
            >
              <span>{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>

        {/* Grille des badges */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBadges.map(badge => (
            <Dialog key={badge.id}>
              <DialogTrigger asChild>
                <div
                  className={`p-4 rounded-lg cursor-pointer transition-all hover:scale-105 ${getBadgeStyle(badge)}`}
                  onClick={() => {
                    setSelectedBadge(badge);
                    onBadgeClick?.(badge);
                  }}
                >
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center">
                      {badge.earned ? (
                        <div className="text-4xl animate-pulse">{badge.icon}</div>
                      ) : (
                        <div className="relative">
                          <div className="text-2xl opacity-50">{badge.icon}</div>
                          {getBadgeIcon(badge)}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className={`font-semibold text-sm ${badge.earned ? 'text-yellow-800' : 'text-gray-600'}`}>
                        {badge.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {badge.points} points
                      </p>
                    </div>

                    {/* Barre de progression pour les badges en cours */}
                    {badge.progress !== undefined && badge.progress > 0 && !badge.earned && (
                      <div className="space-y-1">
                        <Progress value={badge.progress} className="h-1" />
                        <p className="text-xs text-blue-600">{badge.progress}%</p>
                      </div>
                    )}

                    {/* Indicateur de statut */}
                    <div className="flex justify-center">
                      {badge.earned ? (
                        <Badge className="bg-yellow-500 text-white text-xs">
                          <Trophy className="h-3 w-3 mr-1" />
                          Obtenu
                        </Badge>
                      ) : badge.progress && badge.progress > 0 ? (
                        <Badge variant="outline" className="border-blue-300 text-blue-600 text-xs">
                          <Flame className="h-3 w-3 mr-1" />
                          En cours
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-gray-300 text-gray-500 text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Verrouillé
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </DialogTrigger>

              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <span className="text-3xl">{badge.icon}</span>
                    {badge.name}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <p className="text-gray-700">{badge.description}</p>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Récompense</span>
                    <Badge className="bg-primary text-white">
                      +{badge.points} points
                    </Badge>
                  </div>

                  {badge.progress !== undefined && !badge.earned && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{badge.progress}%</span>
                      </div>
                      <Progress value={badge.progress} className="h-2" />
                    </div>
                  )}

                  {badge.earned && (
                    <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                      <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-yellow-800 font-medium">Badge obtenu !</p>
                      <p className="text-yellow-600 text-sm">Félicitations pour cette réussite</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {filteredBadges.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun badge dans cette catégorie</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
