
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

  // Improved fetch metrics function with better error handling and motivational feedback
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
      
      // Check if metrics exist for the user - Correction de la requête ici
      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
        .single();
      
      console.log("Query result:", { data, error });
      
      if (error) {
        // Si l'erreur est "No rows found", c'est que l'utilisateur n'a pas encore de métriques
        if (error.code === 'PGRST116' || error.message.includes('found no rows')) {
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
            .select()
            .single();
            
          if (insertError) {
            console.error('Erreur lors de la création des métriques:', insertError);
            toast.error("Impossible de créer votre profil de progression");
            setMetrics(null);
          } else if (insertResult) {
            console.log('📊 Nouveau profil de métriques créé:', insertResult);
            setMetrics(insertResult as UserMetric);
            toast.success("Bienvenue! Votre parcours d'apprentissage commence maintenant! 🚀");
          }
        } else {
          console.error('Erreur lors du chargement des métriques:', error);
          toast.error("Impossible de charger vos statistiques");
          setMetrics(null);
        }
      } 
      // If metrics exist, use the data and check for improvements
      else if (data) {
        console.log('📈 Métriques existantes trouvées:', data);
        setMetrics(data as UserMetric);
        
        // Show congratulatory message if metrics have improved since last check
        if (previousMetrics) {
          if (data.exercises_completed > previousMetrics.exercises_completed) {
            const diff = data.exercises_completed - previousMetrics.exercises_completed;
            toast.success(`🎯 Nouveau record ! +${diff} point${diff > 1 ? 's' : ''} depuis la dernière vérification!`);
            
            // Affiche un conseil basé sur les points obtenus
            showPointBasedTip(data.exercises_completed);
          }
          if (data.course_completions > previousMetrics.course_completions) {
            toast.success("Félicitations pour votre nouveau cours terminé! 🏆");
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

  // Fonction pour afficher des conseils personnalisés basés sur les points
  const showPointBasedTip = (points: number) => {
    const tips = [
      "Essayez les exercices de niveau supérieur pour gagner plus de points! 🚀",
      "Une séance d'exercices quotidienne de 10 minutes peut améliorer vos compétences rapidement! 💡",
      "Pensez à revoir les concepts fondamentaux pour renforcer votre base! 📚",
      "Avez-vous essayé de résoudre des problèmes avec une approche différente? 🧩",
      "Les grands programmeurs s'améliorent en pratiquant régulièrement! 💪",
      "Pourquoi ne pas essayer un nouveau langage de programmation? 🌍",
      "Les algorithmes sont comme des recettes - pratiquez-les souvent! 🍳",
      "N'oubliez pas de célébrer vos petites victoires! Chaque point compte! 🎉",
      "La persévérance est la clé du succès en programmation! 🔑",
      "Fixez-vous un objectif de points à atteindre cette semaine! 🎯"
    ];
    
    // Choisir un conseil basé sur les points (rotation cyclique)
    const tipIndex = Math.floor(points / 10) % tips.length;
    
    // Afficher le conseil avec un délai pour ne pas écraser le toast précédent
    setTimeout(() => {
      toast.info(`Conseil: ${tips[tipIndex]}`);
    }, 1500);
  };

  // Initial fetch when component mounts or user changes
  useEffect(() => {
    if (user) {
      console.log("User found, fetching metrics:", user.id);
      fetchMetrics();
    } else {
      console.log("No user available for fetching metrics");
    }
  }, [user, fetchMetrics]);

  return {
    metrics,
    loading,
    fetchMetrics
  };
};
