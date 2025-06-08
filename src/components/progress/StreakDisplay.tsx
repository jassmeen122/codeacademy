
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Calendar, Target, Trophy } from 'lucide-react';

interface StreakData {
  current_streak: number;
  longest_streak: number;
  is_active: boolean;
}

interface StreakDisplayProps {
  streakData: StreakData;
  loading?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streakData, loading }) => {
  if (loading) {
    return (
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            Série d'Apprentissage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStreakMessage = () => {
    if (streakData.current_streak === 0) {
      return "Commencez votre série en étudiant aujourd'hui !";
    }
    if (streakData.current_streak < 7) {
      return "Continuez votre excellente progression !";
    }
    if (streakData.current_streak < 30) {
      return "Incroyable régularité ! Vous êtes sur une belle lancée !";
    }
    return "Vous êtes une machine d'apprentissage ! Félicitations !";
  };

  const getNextMilestone = () => {
    const current = streakData.current_streak;
    if (current < 7) return { target: 7, label: "Une semaine" };
    if (current < 14) return { target: 14, label: "Deux semaines" };
    if (current < 30) return { target: 30, label: "Un mois" };
    if (current < 60) return { target: 60, label: "Deux mois" };
    if (current < 100) return { target: 100, label: "100 jours" };
    return { target: current + 30, label: "Prochain objectif" };
  };

  const milestone = getNextMilestone();
  const progressToMilestone = (streakData.current_streak / milestone.target) * 100;

  const getStreakIcon = () => {
    if (streakData.current_streak === 0) return "😴";
    if (streakData.current_streak < 3) return "🔥";
    if (streakData.current_streak < 7) return "🚀";
    if (streakData.current_streak < 30) return "⭐";
    return "👑";
  };

  const getStreakLevel = () => {
    if (streakData.current_streak === 0) return { level: "Débutant", color: "gray" };
    if (streakData.current_streak < 7) return { level: "Motivé", color: "blue" };
    if (streakData.current_streak < 30) return { level: "Régulier", color: "green" };
    if (streakData.current_streak < 60) return { level: "Assidu", color: "orange" };
    return { level: "Maître", color: "purple" };
  };

  const streakLevel = getStreakLevel();

  return (
    <Card className={`professional-card transition-all duration-300 ${
      streakData.is_active 
        ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Flame className={`h-6 w-6 ${streakData.is_active ? 'text-orange-500' : 'text-gray-400'}`} />
            Série d'Apprentissage
          </CardTitle>
          <Badge 
            className={`${
              streakLevel.color === 'gray' ? 'bg-gray-500' :
              streakLevel.color === 'blue' ? 'bg-blue-500' :
              streakLevel.color === 'green' ? 'bg-green-500' :
              streakLevel.color === 'orange' ? 'bg-orange-500' :
              'bg-purple-500'
            } text-white`}
          >
            {streakLevel.level}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Compteur principal */}
          <div className="text-center p-6 rounded-lg bg-white shadow-sm border">
            <div className="text-6xl mb-2">{getStreakIcon()}</div>
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {streakData.current_streak}
            </div>
            <div className="text-lg text-gray-600">
              {streakData.current_streak === 0 ? 'Aucune série active' :
               streakData.current_streak === 1 ? 'jour consécutif' :
               'jours consécutifs'}
            </div>
            {streakData.is_active && (
              <Badge className="bg-green-500 text-white mt-2">
                <Flame className="h-3 w-3 mr-1" />
                Série Active
              </Badge>
            )}
          </div>

          {/* Message motivationnel */}
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-medium">{getStreakMessage()}</p>
          </div>

          {/* Progression vers le prochain objectif */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="font-medium">Prochain objectif: {milestone.label}</span>
              </div>
              <span className="text-sm text-gray-600">
                {streakData.current_streak}/{milestone.target}
              </span>
            </div>
            <Progress value={Math.min(progressToMilestone, 100)} className="h-3" />
          </div>

          {/* Record personnel */}
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-yellow-600" />
              <div>
                <div className="font-semibold text-yellow-800">Record Personnel</div>
                <div className="text-sm text-yellow-600">Votre plus longue série</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-yellow-800">
              {streakData.longest_streak}
              <span className="text-sm font-normal ml-1">jours</span>
            </div>
          </div>

          {/* Conseils pour maintenir la série */}
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Conseils pour maintenir votre série
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Étudiez au moins 15 minutes par jour</li>
              <li>• Définissez une heure fixe d'apprentissage</li>
              <li>• Même un petit exercice compte !</li>
              <li>• Utilisez les rappels pour ne pas oublier</li>
            </ul>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white rounded-lg border">
              <div className="text-lg font-bold text-blue-600">{streakData.current_streak}</div>
              <div className="text-xs text-gray-500">Série Actuelle</div>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <div className="text-lg font-bold text-green-600">{streakData.longest_streak}</div>
              <div className="text-xs text-gray-500">Record</div>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <div className="text-lg font-bold text-orange-600">
                {milestone.target - streakData.current_streak}
              </div>
              <div className="text-xs text-gray-500">Jours restants</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
