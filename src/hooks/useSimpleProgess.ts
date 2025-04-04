
import { useState, useEffect } from 'react';
import { useUserMetrics } from './useUserMetrics';
import { useUserActivityLogs } from './useUserActivityLogs';

export const useSimpleProgress = () => {
  const { metrics, loading: metricsLoading } = useUserMetrics();
  const { activityLogs, loading: logsLoading } = useUserActivityLogs(30);
  const [totalPoints, setTotalPoints] = useState(0);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [recentSuccess, setRecentSuccess] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(metricsLoading || logsLoading);
    
    // Calculer les points totaux dès que les métriques sont disponibles
    if (metrics) {
      const points = (metrics.exercises_completed * 10) + (metrics.course_completions * 50);
      setTotalPoints(points);
    }
    
    // Calculer les points hebdomadaires
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
      
      // Calculer les points (10 par activité)
      const points = thisWeekLogs.reduce((total, log) => total + (log.count * 10), 0);
      setWeeklyPoints(points);
      
      // Déterminer si l'utilisateur a eu du succès récemment (simplement basé sur le nombre d'activités)
      setRecentSuccess(thisWeekLogs.length >= 3);
    }
  }, [metrics, activityLogs, metricsLoading, logsLoading]);

  return {
    totalPoints,
    weeklyPoints,
    recentSuccess,
    loading
  };
};
