
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface QuickTipProps {
  stars: number;
  recentSuccess: boolean;
}

export const QuickTip: React.FC<QuickTipProps> = ({ stars, recentSuccess }) => {
  // Get a personalized tip based on stars and recent success
  const getTip = () => {
    // If user has had recent success
    if (recentSuccess) {
      if (stars === 0) return "Essaie de résoudre un premier exercice pour gagner ta première étoile! 🌟";
      if (stars < 3) return "Tu progresses bien ! Essaie un exercice plus difficile pour gagner plus d'étoiles ! 🚀";
      if (stars < 5) return "Tu es sur une belle lancée ! N'oublie pas de réviser les concepts fondamentaux ! 📚";
      return "Excellent travail ! Tu pourrais aider d'autres étudiants maintenant ! 🧠";
    } 
    // If user hasn't had recent success
    else {
      if (stars === 0) return "Commence par un exercice facile pour gagner ta première étoile ! 🌱";
      if (stars < 3) return "Reprends les bases et essaie des exercices plus simples ! 🔍";
      if (stars < 5) return "Une pause peut parfois aider ! Reviens avec un esprit frais ! 🌿";
      return "Tu as prouvé que tu pouvais le faire ! Retourne à tes exercices ! 💪";
    }
  };

  // Get randomly colored backgrounds for the tip
  const getBgColor = () => {
    const colors = [
      'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20',
      'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
      'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
    ];
    return colors[stars % colors.length];
  };

  return (
    <Card className={getBgColor()}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" /> Astuce Rapide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="py-3 text-center">
          <p className="text-lg font-medium">
            {getTip()}
          </p>
          
          {/* Extra encouragement for users with 0 stars */}
          {stars === 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Chaque parcours commence par un premier pas ! 🐾
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
