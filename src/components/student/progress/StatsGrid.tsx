
import React from "react";
import { StatCard } from "./StatCard";
import { Clock, BookOpen, Code, Trophy, Flame, Calendar } from "lucide-react";

interface LearningStats {
  totalHours: string;
  coursesCompleted: string;
  exercisesCompleted: string;
  achievementPoints: string;
  streak: string;
  lastLogin: string;
}

interface StatsGridProps {
  stats: LearningStats;
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      <StatCard
        title="Heures d'apprentissage"
        value={stats.totalHours}
        icon={Clock}
        description="Temps total d'apprentissage"
      />
      <StatCard
        title="Cours terminés"
        value={stats.coursesCompleted}
        icon={BookOpen}
        description="Cours complétés"
      />
      <StatCard
        title="Exercices"
        value={stats.exercisesCompleted}
        icon={Code}
        description="Exercices terminés"
      />
      <StatCard
        title="Points"
        value={stats.achievementPoints}
        icon={Trophy}
        description="Points gagnés"
      />
      <StatCard
        title="Série actuelle"
        value={stats.streak}
        icon={Flame}
        description="Jours consécutifs"
      />
      <StatCard
        title="Dernière connexion"
        value={stats.lastLogin}
        icon={Calendar}
        description="Dernière activité"
      />
    </div>
  );
};
