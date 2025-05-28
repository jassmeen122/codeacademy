
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from './useAuthState';
import type { UserSkill, UserProgressDetailed, DailyChallenge, ChallengeSubmission, UserLeaderboard } from '@/types/gamification';

export const useGamification = () => {
  const { user } = useAuthState();
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [progressReports, setProgressReports] = useState<UserProgressDetailed[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<UserLeaderboard[]>([]);
  const [userStats, setUserStats] = useState<UserLeaderboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Récupérer les compétences
      const { data: skillsData, error: skillsError } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', user.id);
      
      if (skillsError) throw skillsError;
      setSkills(skillsData || []);
      
      // Récupérer les rapports de progression
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress_detailed')
        .select('*')
        .eq('user_id', user.id);
      
      if (progressError) throw progressError;
      // Transform the data to match our types
      const transformedProgress = progressData?.map(item => ({
        ...item,
        completed_steps: Array.isArray(item.completed_steps) ? item.completed_steps : [],
        in_progress_steps: Array.isArray(item.in_progress_steps) ? item.in_progress_steps : [],
        pending_steps: Array.isArray(item.pending_steps) ? item.pending_steps : [],
      })) || [];
      setProgressReports(transformedProgress);
      
      // Récupérer les défis quotidiens actifs
      const { data: challengesData, error: challengesError } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });
      
      if (challengesError) throw challengesError;
      // Transform the data to match our types
      const transformedChallenges = challengesData?.map(item => ({
        ...item,
        challenge_type: item.challenge_type as 'code_fix' | 'quiz' | 'speed_coding',
        difficulty: item.difficulty as 'beginner' | 'intermediate' | 'advanced',
      })) || [];
      setDailyChallenges(transformedChallenges);
      
      // Récupérer le leaderboard (top 10)
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('user_leaderboard')
        .select(`
          *,
          profiles!inner(full_name)
        `)
        .order('total_points', { ascending: false })
        .limit(10);
      
      if (leaderboardError) throw leaderboardError;
      
      // Transform leaderboard data to match our type
      const transformedLeaderboard = leaderboardData?.map(item => ({
        ...item,
        profiles: item.profiles ? { full_name: item.profiles.full_name } : { full_name: 'Utilisateur inconnu' }
      })) || [];
      setLeaderboard(transformedLeaderboard);
      
      // Récupérer les stats de l'utilisateur
      const { data: userStatsData, error: userStatsError } = await supabase
        .from('user_leaderboard')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (userStatsError && userStatsError.code !== 'PGRST116') throw userStatsError;
      setUserStats(userStatsData);
      
    } catch (error: any) {
      console.error('Error fetching gamification data:', error);
      toast.error('Erreur lors du chargement des données de progression');
    } finally {
      setLoading(false);
    }
  };

  const updateSkillProgress = async (skillName: string, progress: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_skills')
        .upsert({
          user_id: user.id,
          skill_name: skillName,
          progress: Math.min(100, Math.max(0, progress)),
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'user_id,skill_name'
        });
      
      if (error) throw error;
      
      // Recharger les compétences
      fetchUserData();
      toast.success(`Progression ${skillName} mise à jour !`);
    } catch (error: any) {
      console.error('Error updating skill:', error);
      toast.error('Erreur lors de la mise à jour de la compétence');
    }
  };

  const submitChallenge = async (
    challengeId: string,
    submissionCode?: string,
    submittedAnswer?: string,
    timeTaken: number = 0
  ) => {
    if (!user) return;
    
    try {
      // Récupérer le défi pour vérifier la réponse
      const { data: challenge, error: challengeError } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('id', challengeId)
        .single();
      
      if (challengeError) throw challengeError;
      
      // Déterminer si la réponse est correcte
      let isCorrect = false;
      if (challenge.challenge_type === 'quiz') {
        isCorrect = submittedAnswer?.toLowerCase().includes(challenge.correct_answer?.toLowerCase() || '');
      } else if (challenge.challenge_type === 'code_fix' || challenge.challenge_type === 'speed_coding') {
        // Vérification basique du code (peut être améliorée)
        isCorrect = submissionCode?.includes(challenge.correct_answer || '') || false;
      }
      
      const pointsEarned = isCorrect ? challenge.points_reward : 0;
      
      // Soumettre la réponse
      const { error: submissionError } = await supabase
        .from('challenge_submissions')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          submission_code: submissionCode,
          submitted_answer: submittedAnswer,
          time_taken: timeTaken,
          is_correct: isCorrect,
          points_earned: pointsEarned
        });
      
      if (submissionError) throw submissionError;
      
      // Recharger les données
      fetchUserData();
      
      if (isCorrect) {
        toast.success(`Défi réussi ! +${pointsEarned} points`);
      } else {
        toast.error('Défi échoué. Réessayez demain !');
      }
      
      return { isCorrect, pointsEarned };
    } catch (error: any) {
      console.error('Error submitting challenge:', error);
      toast.error('Erreur lors de la soumission du défi');
      return { isCorrect: false, pointsEarned: 0 };
    }
  };

  return {
    skills,
    progressReports,
    dailyChallenges,
    leaderboard,
    userStats,
    loading,
    updateSkillProgress,
    submitChallenge,
    refreshData: fetchUserData
  };
};
