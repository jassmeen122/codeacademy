
import { useState, useEffect } from 'react';
import { useUserMetrics } from './useUserMetrics';
import { useUserActivityLogs } from './useUserActivityLogs';

export const useSimpleStarProgress = () => {
  const { metrics, loading: metricsLoading } = useUserMetrics();
  const { activityLogs, loading: logsLoading } = useUserActivityLogs(30);
  const [totalStars, setTotalStars] = useState(0);
  const [weeklyStars, setWeeklyStars] = useState(0);
  const [recentSuccess, setRecentSuccess] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(metricsLoading || logsLoading);
    
    // Calculer les étoiles totales (1 étoile par exercice)
    if (metrics) {
      const stars = metrics.exercises_completed || 0;
      setTotalStars(stars);
    }
    
    // Calculer les étoiles de la semaine actuelle
    if (activityLogs && activityLogs.length > 0) {
      const today = new Date();
      const startOfWeek = new Date(today);
      const dayOfWeek = today.getDay();
      const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Ajuste pour commencer le lundi
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);
      
      // Filtrer les logs de la semaine
      const thisWeekLogs = activityLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= startOfWeek;
      });
      
      // Compter les activités (1 étoile par activité)
      const stars = thisWeekLogs.reduce((total, log) => total + log.count, 0);
      setWeeklyStars(stars);
      
      // Déterminer si l'utilisateur a eu du succès récemment
      setRecentSuccess(thisWeekLogs.length >= 2);
    }
  }, [metrics, activityLogs, metricsLoading, logsLoading]);

  return {
    totalStars,
    weeklyStars,
    recentSuccess,
    loading
  };
};
