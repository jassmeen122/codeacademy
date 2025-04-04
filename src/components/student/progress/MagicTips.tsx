
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Trophy, Lightbulb, Rocket } from 'lucide-react';

interface MagicTipsProps {
  points: number;
  recentSuccess?: boolean;
}

export const MagicTips: React.FC<MagicTipsProps> = ({ 
  points, 
  recentSuccess = true 
}) => {
  // Fonction pour obtenir le bon conseil selon le niveau et le succès récent
  const getTip = () => {
    // Si l'utilisateur a réussi récemment
    if (recentSuccess) {
      if (points < 30) return {
        icon: <Rocket className="h-5 w-5 text-blue-500" />,
        text: "Bravo ! Prochain défi : une boucle for ! 🚀",
        message: "Tu débutes bien, continue comme ça !"
      };
      
      if (points < 70) return {
        icon: <Trophy className="h-5 w-5 text-purple-500" />,
        text: "Super ! Essaie maintenant les fonctions ! 🧩",
        message: "Tu progresses vite, continue !"
      };
      
      return {
        icon: <Sparkles className="h-5 w-5 text-amber-500" />,
        text: "Incroyable ! Tente un mini-projet complet ! 🏗️",
        message: "Tu es presque un expert !"
      };
    } 
    // Si l'utilisateur a des difficultés récemment
    else {
      if (points < 30) return {
        icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
        text: "Astuce : Utilise des guillemets en Python ! 🐍",
        message: "Pas grave, on apprend en faisant des erreurs !"
      };
      
      if (points < 70) return {
        icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
        text: "N'oublie pas les deux-points après if ! 🔍",
        message: "Continue, tu y es presque !"
      };
      
      return {
        icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
        text: "Vérifie l'indentation de ton code ! ➡️",
        message: "Un petit détail et ça marchera !"
      };
    }
  };
  
  const tip = getTip();

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-purple-500">🧙‍♂️</span> Conseil Magique
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-lg border border-amber-100 dark:border-amber-700/30 bg-white dark:bg-black/20">
            {tip.icon}
            <p className="font-medium">{tip.text}</p>
          </div>
          
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            {tip.message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
