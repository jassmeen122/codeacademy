
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';

interface ExerciseProgress {
  completedExercises: number;
  totalExercises: number;
  isAllCompleted: boolean;
}

export const useExerciseProgress = () => {
  const { user } = useAuthState();
  const [progress, setProgress] = useState<ExerciseProgress>({
    completedExercises: 0,
    totalExercises: 0,
    isAllCompleted: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchExerciseProgress();
    }
  }, [user]);

  const fetchExerciseProgress = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Pour cette démo, on simule des données d'exercices
      // Dans un vrai projet, ces données viendraient de la base de données
      const mockData = {
        completedExercises: 3,
        totalExercises: 5,
        isAllCompleted: false
      };
      
      // Simulation d'un utilisateur qui a tout terminé
      if (user.email === 'yassmine.dalil@example.com') {
        mockData.completedExercises = 5;
        mockData.isAllCompleted = true;
      }
      
      setProgress(mockData);
    } catch (error) {
      console.error('Error fetching exercise progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateExerciseProgress = async (exerciseId: string, completed: boolean) => {
    // Cette fonction serait utilisée pour mettre à jour la progression
    // quand un utilisateur termine un exercice
    if (completed) {
      setProgress(prev => ({
        ...prev,
        completedExercises: Math.min(prev.completedExercises + 1, prev.totalExercises),
        isAllCompleted: prev.completedExercises + 1 >= prev.totalExercises
      }));
    }
  };

  return {
    progress,
    loading,
    updateExerciseProgress,
    refreshProgress: fetchExerciseProgress
  };
};
