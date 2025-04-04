
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface WeeklySummaryProps {
  weeklyPoints: number;
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({ weeklyPoints }) => {
  // Obtenir le jour de la semaine actuel
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('fr-FR', { weekday: 'long' });
  const isMonday = dayOfWeek.toLowerCase() === 'lundi';
  
  // Personnaliser le message selon le jour et les points
  const getMessage = () => {
    if (isMonday) {
      if (weeklyPoints === 0) return "Nouvelle semaine ! Prêt à gagner des points ? 🚀";
      if (weeklyPoints < 30) return `Tu as gagné ${weeklyPoints} points cette semaine ! C'est un bon début ! ✨`;
      if (weeklyPoints < 70) return `Tu as gagné ${weeklyPoints} points cette semaine ! Bien joué ! 🌟`;
      return `Tu as gagné ${weeklyPoints} points cette semaine ! Incroyable ! 🏆`;
    } else {
      if (weeklyPoints === 0) return "Commence à faire des exercices pour gagner des points ! 🌱";
      if (weeklyPoints < 30) return `${weeklyPoints} points cette semaine ! Continue comme ça ! 💪`;
      if (weeklyPoints < 70) return `${weeklyPoints} points ! Tu fais de bons progrès ! 🌟`;
      return `${weeklyPoints} points ! Tu es en feu cette semaine ! 🔥`;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-500" /> Résumé de la Semaine
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
