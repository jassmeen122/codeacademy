
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
    
    // Calculate total stars (1 star per exercise)
    if (metrics) {
      const stars = metrics.exercises_completed || 0;
      setTotalStars(stars);
    }
    
    // Calculate weekly stars
    if (activityLogs && activityLogs.length > 0) {
      const today = new Date();
      const startOfWeek = new Date(today);
      const dayOfWeek = today.getDay();
      const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to start on Monday
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);
      
      // Filter this week's logs
      const thisWeekLogs = activityLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= startOfWeek;
      });
      
      // Count activities (1 star per activity)
      const stars = thisWeekLogs.reduce((total, log) => total + (log.count || 0), 0);
      setWeeklyStars(stars);
      
      // Determine if the user has had recent success
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
