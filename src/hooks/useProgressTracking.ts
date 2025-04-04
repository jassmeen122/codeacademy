
import { useQuizProgress } from './progress/useQuizProgress';
import { useSummaryProgress } from './progress/useSummaryProgress';
import { useVideoProgress } from './progress/useVideoProgress';
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { toast } from 'sonner';

export const useProgressTracking = () => {
  const { trackSummaryRead, updating: summaryUpdating } = useSummaryProgress();
  const { trackQuizCompletion, updating: quizUpdating } = useQuizProgress();
  const { trackVideoProgress, updating: videoUpdating } = useVideoProgress();
  const [updating, setUpdating] = useState(false);
  const { user } = useAuthState();
  
  // Liste de conseils d'amélioration par catégorie
  const improvementTips = {
    beginner: [
      "Essayez de résoudre un exercice simple chaque jour! 🌱",
      "Lisez un article court sur les bases de la programmation! 📚",
      "Regardez une vidéo tutoriel de 5 minutes! 🎬"
    ],
    intermediate: [
      "Créez un petit projet personnel en utilisant ce que vous avez appris! 🛠️",
      "Participez à un forum de discussion pour poser vos questions! 💬",
      "Essayez d'expliquer un concept à quelqu'un d'autre! 🗣️"
    ],
    advanced: [
      "Contribuez à un projet open source! 🌐",
      "Refactorisez un ancien code que vous avez écrit! ♻️",
      "Résolvez un problème d'algorithme complexe! 🧠"
    ]
  };
  
  // Fonction pour obtenir un conseil aléatoire basé sur le niveau
  const getRandomTip = (exercisesCompleted: number) => {
    let level = 'beginner';
    if (exercisesCompleted > 50) level = 'advanced';
    else if (exercisesCompleted > 20) level = 'intermediate';
    
    const tips = improvementTips[level as keyof typeof improvementTips];
    return tips[Math.floor(Math.random() * tips.length)];
  };
  
  // Enhanced function to update user metrics with motivational feedback
  const updateUserMetrics = useCallback(async (type: 'course' | 'exercise', value: number = 1) => {
    if (!user) {
      toast.error('Vous devez être connecté pour suivre votre progression');
      console.log("updateUserMetrics: No user logged in");
      return false;
    }
    
    console.log(`updateUserMetrics: Starting update for ${type} with value ${value} for user ${user.id}`);
    setUpdating(true);
    
    try {
      console.log(`🎯 Mise à jour des métriques: type=${type}, valeur=${value}`);
      
      // First, get current metrics or create if not exists
      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      console.log("Current metrics query result:", { data, error });
      
      if (error) {
        console.error("Error fetching metrics:", error);
        throw error;
      }
      
      // If no metrics exist yet, create a new record with the update
      if (!data) {
        console.log('📊 Création d\'un nouveau profil de métriques');
        
        const newMetricsData = {
          user_id: user.id,
          course_completions: type === 'course' ? value : 0,
          exercises_completed: type === 'exercise' ? value : 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
          // Removed total_time_spent field
        };
        
        console.log("Inserting new metrics:", newMetricsData);
        
        const { error: insertError, data: insertData } = await supabase
          .from('user_metrics')
          .insert([newMetricsData])
          .select();
          
        console.log("Insert result:", { insertData, insertError });
          
        if (insertError) {
          console.error("Error creating metrics:", insertError);
          throw insertError;
        }
        
        console.log('✅ Nouvelles métriques créées avec succès');
        
        // Show motivational message based on type
        if (type === 'exercise') {
          toast.success('Premier exercice terminé! Continuez comme ça! 🎉');
          // Afficher un conseil pour débutant
          setTimeout(() => {
            toast.info(`Conseil: ${getRandomTip(1)}`);
          }, 1500);
        } else if (type === 'course') {
          toast.success('Premier cours terminé! Quel accomplissement! 🏆');
        }
        
        return true;
      }
      
      // If metrics exist, update the appropriate field
      const updateData: any = { 
        updated_at: new Date().toISOString() 
      };
      
      if (type === 'course') {
        updateData.course_completions = (data.course_completions || 0) + value;
      } else if (type === 'exercise') {
        updateData.exercises_completed = (data.exercises_completed || 0) + value;
      }
      
      console.log('📝 Mise à jour des métriques:', updateData);
      
      const { error: updateError, data: updateResult } = await supabase
        .from('user_metrics')
        .update(updateData)
        .eq('user_id', user.id)
        .select();
      
      console.log("Update result:", { updateResult, updateError });
      
      if (updateError) {
        console.error("Error updating metrics:", updateError);
        throw updateError;
      }
      
      console.log('✅ Métriques mises à jour avec succès');
      
      // Show motivational messages based on updated metrics and type
      if (type === 'exercise') {
        const newCount = (data.exercises_completed || 0) + value;
        
        // Différents messages selon le nombre d'exercices complétés
        if (newCount % 10 === 0) {
          toast.success(`🎯 Félicitations! ${newCount} exercices terminés! Quel parcours impressionnant!`);
        } else if (newCount % 5 === 0) {
          toast.success(`🌟 ${newCount} exercices complétés! Votre persévérance est admirable!`);
        } else {
          toast.success(`💪 +${value} point${value > 1 ? 's' : ''}! Total: ${newCount}`);
        }
        
        // Afficher un conseil personnalisé après un délai
        setTimeout(() => {
          toast.info(`Conseil: ${getRandomTip(newCount)}`);
        }, 1500);
      } else if (type === 'course') {
        const newCourseCount = (data.course_completions || 0) + value;
        toast.success(`📚 Cours terminé! Vous avez complété ${newCourseCount} cours au total!`);
      }
      
      return true;
      
    } catch (error) {
      console.error('❌ Erreur dans updateUserMetrics:', error);
      toast.error('Impossible de mettre à jour votre progression');
      return false;
    } finally {
      setUpdating(false);
    }
  }, [user]);
  
  // Simple test function for exercise completion with motivational feedback
  const testUpdateMetrics = useCallback(async (type: 'course' | 'exercise' = 'exercise', value: number = 1) => {
    if (!user) {
      toast.error('Vous devez être connecté pour tester');
      return;
    }
    
    console.log(`testUpdateMetrics: Testing ${type} update with value ${value}`);
    const result = await updateUserMetrics(type, value);
    
    if (result) {
      if (type === 'exercise') {
        toast.success('Test: exercice complété! 🎮');
      } else if (type === 'course') {
        toast.success('Test: cours complété! 📚');
      }
    }
  }, [user, updateUserMetrics]);
  
  const isUpdating = summaryUpdating || quizUpdating || videoUpdating || updating;

  return {
    trackSummaryRead,
    trackQuizCompletion,
    trackVideoProgress,
    updateUserMetrics,
    testUpdateMetrics,
    updating: isUpdating
  };
};
