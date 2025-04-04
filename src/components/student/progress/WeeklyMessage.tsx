
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface WeeklyMessageProps {
  weeklyStars: number;
}

export const WeeklyMessage: React.FC<WeeklyMessageProps> = ({ weeklyStars }) => {
  const getWeeklyMessage = () => {
    if (weeklyStars === 0) return "Cette semaine, commence à résoudre des exercices pour gagner des étoiles! 💫";
    if (weeklyStars === 1) return "Tu as gagné 1 étoile cette semaine! Bon début! ✨";
    if (weeklyStars < 3) return `Tu as gagné ${weeklyStars} étoiles cette semaine! Continue sur ta lancée! 🌟`;
    if (weeklyStars < 5) return `Impressionnant! ${weeklyStars} étoiles cette semaine! Tu avances bien! 🚀`;
    return `Extraordinaire! ${weeklyStars} étoiles cette semaine! Tu maîtrises le sujet! 🏆`;
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-500" /> Récapitulatif Hebdomadaire
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="py-3 text-center">
          <p className="text-lg font-medium">
            {getWeeklyMessage()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Nouvelle semaine, nouveaux défis à relever! 💻
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
