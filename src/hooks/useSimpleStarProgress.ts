
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
    
    if (metrics) {
      console.log("Calculating stars from metrics:", metrics);
      // Calculate total stars (1 star per exercise completed)
      const stars = metrics.exercises_completed || 0;
      console.log("Setting total stars to:", stars);
      setTotalStars(stars);
    }
    
    if (activityLogs && activityLogs.length > 0) {
      console.log("Calculating weekly stars from logs:", activityLogs);
      const today = new Date();
      const startOfWeek = new Date(today);
      const dayOfWeek = today.getDay();
      const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to start on Monday
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);
      
      // Filter logs for current week
      const thisWeekLogs = activityLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= startOfWeek;
      });
      
      // Count activities (1 star per activity)
      const stars = thisWeekLogs.reduce((total, log) => total + log.count, 0);
      console.log("Weekly stars calculated:", stars);
      setWeeklyStars(stars);
      
      // Determine if user has had recent success
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
