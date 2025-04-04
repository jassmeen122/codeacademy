
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface WeeklyMessageProps {
  starsEarned: number;
}

export const WeeklyMessage: React.FC<WeeklyMessageProps> = ({ starsEarned }) => {
  // Get the current day of the week
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('fr-FR', { weekday: 'long' });
  const isMonday = dayOfWeek.toLowerCase() === 'lundi';
  
  // Customize message based on day and stars
  const getMessage = () => {
    if (isMonday) {
      if (starsEarned === 0) return "Nouvelle semaine ! Prêt à gagner des étoiles ? 🚀";
      if (starsEarned < 3) return `Tu as gagné ${starsEarned} étoile${starsEarned > 1 ? 's' : ''} cette semaine ! C'est un bon début ! ✨`;
      if (starsEarned < 5) return `Tu as gagné ${starsEarned} étoiles cette semaine ! Bien joué ! 🌟`;
      return `Tu as gagné ${starsEarned} étoiles cette semaine ! Incroyable ! 🏆`;
    } else {
      if (starsEarned === 0) return "Commence à faire des exercices pour gagner des étoiles ! 🌱";
      if (starsEarned < 3) return `${starsEarned} étoile${starsEarned > 1 ? 's' : ''} cette semaine ! Continue comme ça ! 💪`;
      if (starsEarned < 5) return `${starsEarned} étoiles ! Tu fais de bons progrès ! 🌟`;
      return `${starsEarned} étoiles ! Tu es en feu cette semaine ! 🔥`;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-500" /> Message Hebdo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="py-3 text-center">
          <p className="text-lg font-medium">
            {getMessage()}
          </p>
          
          {!isMonday && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Nouveau résumé complet lundi prochain !
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
