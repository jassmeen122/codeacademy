
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StarDisplayProps {
  stars: number;
  loading?: boolean;
  maxStars?: number;
}

export const StarDisplay: React.FC<StarDisplayProps> = ({ 
  stars = 0, 
  loading = false,
  maxStars = 5
}) => {
  // Function to get emoji based on star count
  const getMoodEmoji = () => {
    const percentage = stars / maxStars;
    if (percentage >= 0.75) return { emoji: '😊', text: 'Super !', color: 'text-green-500' };
    if (percentage >= 0.4) return { emoji: '😐', text: 'Pas mal !', color: 'text-amber-500' };
    return { emoji: '😢', text: 'Continue !', color: 'text-blue-500' };
  };

  // Get emoji and text
  const mood = getMoodEmoji();
  
  // Generate filled and empty stars
  const renderStars = () => {
    const filledStars = '★'.repeat(Math.min(stars, maxStars));
    const emptyStars = '☆'.repeat(Math.max(0, maxStars - stars));
    return `${filledStars}${emptyStars}`;
  };

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
          <span className="text-yellow-500">⭐</span> Tes Étoiles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {/* Large mood emoji */}
          <div className="text-7xl">{mood.emoji}</div>
          
          {/* Stars */}
          <div>
            <div className="text-3xl font-bold text-center text-yellow-500">
              {renderStars()}
            </div>
            <div className={`text-center ${mood.color} font-medium`}>{mood.text}</div>
          </div>
          
          {/* Next level */}
          <div className="text-sm text-center text-gray-600 dark:text-gray-400">
            {stars < maxStars ? (
              <p>Encore {maxStars - stars} étoiles pour compléter le niveau!</p>
            ) : (
              <p>Tu as atteint le niveau maximum! 🏆</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
