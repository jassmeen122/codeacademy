
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';

interface WeeklyStats {
  exercises_completed: number;
  time_spent_minutes: number;
  languages_practiced: string[];
  streak_days: number;
  points_earned: number;
  week_start: string;
}

interface MonthlyStats {
  exercises_completed: number;
  time_spent_hours: number;
  courses_completed: number;
  badges_earned: number;
  max_streak: number;
  points_earned: number;
  month_start: string;
}

interface StreakData {
  current_streak: number;
  longest_streak: number;
  is_active: boolean;
}

export const useProgressStats = () => {
  const { user } = useAuthState();
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [streakData, setStreakData] = useState<StreakData>({ current_streak: 0, longest_streak: 0, is_active: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgressStats();
    }
  }, [user]);

  const fetchProgressStats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Récupérer les stats hebdomadaires des 8 dernières semaines
      const { data: weeklyData, error: weeklyError } = await supabase
        .from('user_weekly_stats')
        .select('*')
        .eq('user_id', user.id)
        .gte('week_start', new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('week_start', { ascending: true });
      
      if (weeklyError) throw weeklyError;
      setWeeklyStats(weeklyData || []);
      
      // Récupérer les stats mensuelles des 6 derniers mois
      const { data: monthlyData, error: monthlyError } = await supabase
        .from('user_monthly_stats')
        .select('*')
        .eq('user_id', user.id)
        .gte('month_start', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('month_start', { ascending: true });
      
      if (monthlyError) throw monthlyError;
      setMonthlyStats(monthlyData || []);
      
      // Calculer le streak actuel
      await updateCurrentStreak();
      
    } catch (error) {
      console.error('Error fetching progress stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentStreak = async () => {
    if (!user) return;
    
    try {
      // Appeler la fonction PostgreSQL pour calculer le streak
      const { data, error } = await supabase
        .rpc('update_user_streak', { user_uuid: user.id });
      
      if (error) throw error;
      
      // Récupérer les données de streak depuis le leaderboard
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('user_leaderboard')
        .select('current_streak, longest_streak')
        .eq('user_id', user.id)
        .single();
      
      if (leaderboardError && leaderboardError.code !== 'PGRST116') throw leaderboardError;
      
      if (leaderboardData) {
        setStreakData({
          current_streak: leaderboardData.current_streak,
          longest_streak: leaderboardData.longest_streak,
          is_active: leaderboardData.current_streak > 0
        });
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const recordActivity = async (activityType: string, metadata: any = {}) => {
    if (!user) return;
    
    try {
      // Enregistrer l'activité
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          activity_data: metadata
        });
      
      // Mettre à jour les stats de la semaine courante
      await updateWeeklyStats(activityType, metadata);
      
      // Recalculer le streak
      await updateCurrentStreak();
      
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  };

  const updateWeeklyStats = async (activityType: string, metadata: any) => {
    if (!user) return;
    
    const weekStart = getWeekStart(new Date());
    
    try {
      const updates: any = {};
      
      if (activityType === 'exercise_completed') {
        updates.exercises_completed = 1;
        updates.points_earned = metadata.points || 5;
        if (metadata.language) {
          // Ajouter le langage aux langages pratiqués
          const { data: existing } = await supabase
            .from('user_weekly_stats')
            .select('languages_practiced')
            .eq('user_id', user.id)
            .eq('week_start', weekStart)
            .single();
          
          const currentLanguages = existing?.languages_practiced || [];
          if (!currentLanguages.includes(metadata.language)) {
            updates.languages_practiced = [...currentLanguages, metadata.language];
          }
        }
      }
      
      if (activityType === 'study_session') {
        updates.time_spent_minutes = metadata.duration || 30;
      }
      
      // Upsert les stats hebdomadaires
      await supabase
        .from('user_weekly_stats')
        .upsert({
          user_id: user.id,
          week_start: weekStart,
          ...updates
        }, {
          onConflict: 'user_id,week_start'
        });
      
    } catch (error) {
      console.error('Error updating weekly stats:', error);
    }
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lundi comme premier jour
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
  };

  return {
    weeklyStats,
    monthlyStats,
    streakData,
    loading,
    recordActivity,
    refreshStats: fetchProgressStats
  };
};
