
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PointsDisplayProps {
  points: number;
  loading?: boolean;
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({ 
  points, 
  loading = false 
}) => {
  // Fonction pour obtenir l'émoji selon le nombre de points
  const getMoodEmoji = () => {
    if (points >= 100) return { emoji: '😊', text: 'Super !', color: 'text-green-500' };
    if (points >= 50) return { emoji: '😐', text: 'Pas mal !', color: 'text-amber-500' };
    return { emoji: '😢', text: 'Continue !', color: 'text-blue-500' };
  };

  // Obtenir l'émoji et le texte correspondant
  const mood = getMoodEmoji();
  
  // Calculer le prochain niveau
  const nextLevel = points < 50 ? 50 : points < 100 ? 100 : 150;
  const pointsToNext = nextLevel - points;

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="text-lg">Tes Étoiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center">
            <p className="text-muted-foreground animate-pulse">Chargement...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-yellow-500">⭐</span> Tes Points
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {/* Grand émoji de l'humeur */}
          <div className="text-7xl">{mood.emoji}</div>
          
          {/* Nombre de points */}
          <div>
            <div className="text-4xl font-bold text-center">{points}</div>
            <div className={`text-center ${mood.color} font-medium`}>{mood.text}</div>
          </div>
          
          {/* Prochain niveau */}
          <div className="text-sm text-center text-gray-600 dark:text-gray-400">
            {pointsToNext > 0 ? (
              <p>Encore {pointsToNext} points pour le niveau suivant !</p>
            ) : (
              <p>Tu as atteint le plus haut niveau ! 🏆</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
