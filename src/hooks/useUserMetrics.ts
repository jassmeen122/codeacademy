
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { UserMetric } from '@/types/progress';
import { toast } from 'sonner';

export const useUserMetrics = () => {
  const [metrics, setMetrics] = useState<UserMetric | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();
  const [previousMetrics, setPreviousMetrics] = useState<UserMetric | null>(null);

  // Improved fetch metrics function with better error handling and debugging
  const fetchMetrics = useCallback(async () => {
    if (!user) {
      console.log("No user found, cannot fetch metrics");
      setMetrics(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(`⭐ Chargement des statistiques pour l'utilisateur ${user.id}...`);
      
      // Save previous metrics to check for changes
      setPreviousMetrics(metrics);
      
      // Check if metrics exist for the user
      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      console.log("Query result:", { data, error });
      
      if (error) {
        console.error('Erreur lors du chargement des métriques:', error);
        toast.error("Impossible de charger vos statistiques");
        setMetrics(null);
      } 
      // If no metrics exist yet, create a new record
      else if (!data) {
        console.log('🌟 Pas de statistiques trouvées, création d\'un nouveau profil');
        
        const newMetricsData = {
          user_id: user.id,
          course_completions: 0,
          exercises_completed: 0,
          total_time_spent: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { data: insertResult, error: insertError } = await supabase
          .from('user_metrics')
          .insert([newMetricsData])
          .select('*');
          
        if (insertError) {
          console.error('Erreur lors de la création des métriques:', insertError);
          toast.error("Impossible de créer votre profil de progression");
          setMetrics(null);
        } else if (insertResult && insertResult.length > 0) {
          console.log('📊 Nouveau profil de métriques créé:', insertResult[0]);
          setMetrics(insertResult[0] as UserMetric);
          toast.success("Bienvenue! Votre parcours d'apprentissage commence maintenant! 🚀");
        }
      } 
      // If metrics exist, use the data and check for improvements
      else {
        console.log('📈 Métriques existantes trouvées:', data);
        setMetrics(data as UserMetric);
        
        // Show congratulatory message if metrics have improved since last check
        if (previousMetrics) {
          if (data.exercises_completed > previousMetrics.exercises_completed) {
            const diff = data.exercises_completed - previousMetrics.exercises_completed;
            toast.success(`Vous avez terminé ${diff} nouvel${diff > 1 ? 'les' : 'le'} exercice${diff > 1 ? 's' : ''} depuis la dernière vérification! 🎉`);
          }
          if (data.course_completions > previousMetrics.course_completions) {
            toast.success("Félicitations pour votre nouveau cours terminé! 🏆");
          }
          if (data.total_time_spent > previousMetrics.total_time_spent) {
            const diffMinutes = data.total_time_spent - previousMetrics.total_time_spent;
            if (diffMinutes >= 30) {
              toast.success(`+${diffMinutes} minutes d'apprentissage! Votre persévérance est admirable! ⏱️`);
            }
          }
        }
      }
    } catch (error) {
      console.error("Erreur dans fetchMetrics:", error);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  }, [user, metrics]);

  // Initial fetch when component mounts or user changes
  useEffect(() => {
    if (user) {
      console.log("User found, fetching metrics:", user.id);
      fetchMetrics();
    } else {
      console.log("No user available for fetching metrics");
    }
  }, [user, fetchMetrics]);

  // Add debug info
  console.log("useUserMetrics hook state:", { user: user?.id, metrics, loading });

  return {
    metrics,
    loading,
    fetchMetrics
  };
};
