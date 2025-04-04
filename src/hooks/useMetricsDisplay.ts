
import { useState, useEffect } from 'react';
import { useUserMetrics } from './useUserMetrics';
import { toast } from 'sonner';

export const useMetricsDisplay = () => {
  const { metrics, loading, fetchMetrics } = useUserMetrics();
  const [displayMetrics, setDisplayMetrics] = useState({
    course_completions: 0,
    exercises_completed: 0
  });
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Mettre à jour les métriques d'affichage à partir des données brutes
  useEffect(() => {
    console.log("Current metrics state:", { metrics, displayMetrics, loading });
    
    if (metrics) {
      setDisplayMetrics({
        course_completions: metrics.course_completions || 0,
        exercises_completed: metrics.exercises_completed || 0
      });
      setLastRefresh(new Date());
    }
  }, [metrics]);

  // Rafraîchir les métriques
  const refreshMetrics = async () => {
    try {
      await fetchMetrics();
      toast.success('Statistiques mises à jour! 🔄');
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des métriques:", error);
      toast.error('Impossible de rafraîchir vos statistiques');
    }
  };

  // Formater la date/heure du dernier rafraîchissement
  const getLastRefreshTime = () => {
    if (!lastRefresh) return 'Jamais';
    return lastRefresh.toLocaleTimeString();
  };

  return {
    metrics: displayMetrics,
    loading,
    refreshMetrics,
    lastRefresh: getLastRefreshTime()
  };
};
