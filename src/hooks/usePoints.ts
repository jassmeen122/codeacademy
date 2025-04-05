
import { useState } from 'react';
import { useAuthState } from './useAuthState';
import { awardPoints, getUserPoints, getUserActivityHistory, ActivityType } from '@/utils/pointsSystem';

export const usePoints = () => {
  const [loading, setLoading] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [activityHistory, setActivityHistory] = useState<any[]>([]);
  const { user } = useAuthState();
  
  /**
   * Award points to the current user
   */
  const addPoints = async (
    activityType: ActivityType, 
    itemId?: string,
    showToast: boolean = true
  ) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    setLoading(true);
    try {
      const result = await awardPoints(user.id, activityType, itemId, showToast);
      
      if (result.success) {
        // Update the local points state
        setTotalPoints(prev => prev + result.points);
      }
      
      return result;
    } catch (error) {
      console.error('Error in addPoints hook:', error);
      return { success: false, points: 0, error };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Fetch user points total
   */
  const fetchPoints = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const points = await getUserPoints(user.id);
      setTotalPoints(points);
      return points;
    } catch (error) {
      console.error('Error in fetchPoints hook:', error);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Fetch user activity history
   */
  const fetchActivityHistory = async (limit: number = 10) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const history = await getUserActivityHistory(user.id, limit);
      setActivityHistory(history);
      return history;
    } catch (error) {
      console.error('Error in fetchActivityHistory hook:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    totalPoints,
    activityHistory,
    addPoints,
    fetchPoints,
    fetchActivityHistory
  };
};
