
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, BookOpen, Bookmark } from "lucide-react";

interface PointsSummaryCardProps {
  exercisesCompleted: number;
  coursesCompleted: number;
  loading?: boolean;
}

export const PointsSummaryCard: React.FC<PointsSummaryCardProps> = ({
  exercisesCompleted = 0,
  coursesCompleted = 0,
  loading = false
}) => {
  // Calcul du total des points (1 exercice = 1 point, 1 cours = 5 points)
  const totalPoints = exercisesCompleted + (coursesCompleted * 5);
  
  // Récupérer le mois actuel en français
  const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long' });
  
  // Déterminer le niveau de l'utilisateur basé sur les points
  const getUserLevel = () => {
    if (totalPoints >= 100) return "Expert";
    if (totalPoints >= 50) return "Avancé";
    if (totalPoints >= 20) return "Intermédiaire";
    return "Débutant";
  };
  
  // Afficher différentes icônes selon le niveau
  const getLevelIcon = () => {
    const level = getUserLevel();
    if (level === "Expert") return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (level === "Avancé") return <Star className="h-5 w-5 text-purple-500" />;
    if (level === "Intermédiaire") return <BookOpen className="h-5 w-5 text-blue-500" />;
    return <Bookmark className="h-5 w-5 text-green-500" />;
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Résumé de vos points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <p className="text-muted-foreground animate-pulse">Chargement des données...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Résumé de vos points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Total des points */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl">
            <span className="text-sm text-blue-600 dark:text-blue-400 mb-2">Total des points</span>
            <div className="text-4xl font-bold text-blue-700 dark:text-blue-300">
              {totalPoints}
            </div>
            <span className="mt-1 text-xs text-blue-500">
              {currentMonth} {new Date().getFullYear()}
            </span>
          </div>
          
          {/* Détails */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{exercisesCompleted}</div>
              <span className="text-xs text-green-500">Exercices complétés</span>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{coursesCompleted}</div>
              <span className="text-xs text-purple-500">Cours terminés</span>
            </div>
          </div>
          
          {/* Niveau actuel */}
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg">
            {getLevelIcon()}
            <div>
              <h4 className="font-medium text-sm">Votre niveau actuel</h4>
              <div className="font-bold text-amber-700 dark:text-amber-400">{getUserLevel()}</div>
            </div>
            <div className="ml-auto text-right">
              <span className="text-xs text-gray-500">
                {getUserLevel() === "Expert" 
                  ? "Bravo! Niveau maximum atteint!" 
                  : `${50 - (totalPoints % 50)} points pour le niveau suivant`}
              </span>
            </div>
          </div>
          
          {/* Message motivant basé sur le niveau */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            {totalPoints === 0 ? (
              <p>Commencez à compléter des exercices pour gagner des points! 🚀</p>
            ) : getUserLevel() === "Débutant" ? (
              <p>Vous avez fait un excellent début! Continuez comme ça! 💪</p>
            ) : getUserLevel() === "Intermédiaire" ? (
              <p>Vos compétences progressent bien! Relevez de nouveaux défis! 🌟</p>
            ) : getUserLevel() === "Avancé" ? (
              <p>Impressionnant! Vous êtes sur la voie de la maîtrise! 🏆</p>
            ) : (
              <p>Félicitations! Vous êtes un expert! Partagez votre savoir! 👑</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
