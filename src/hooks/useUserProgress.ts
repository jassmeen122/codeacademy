
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import { UserProgress, Badge, ProgressStats } from '@/types/userProgress';
import { toast } from 'sonner';

// Badges disponibles
const availableBadges: Badge[] = [
  {
    id: '1',
    name: 'Lecteur actif',
    description: '10 lectures terminées',
    icon: '📚',
    requirement_type: 'reading',
    requirement_value: 10
  },
  {
    id: '2',
    name: 'Débutant en logique',
    description: '3 bonnes réponses',
    icon: '🧠',
    requirement_type: 'answers',
    requirement_value: 3
  },
  {
    id: '3',
    name: 'Expert lecteur',
    description: '20 lectures terminées',
    icon: '🎓',
    requirement_type: 'reading',
    requirement_value: 20
  },
  {
    id: '4',
    name: 'Maître du quiz',
    description: '10 bonnes réponses',
    icon: '🏆',
    requirement_type: 'answers',
    requirement_value: 10
  }
];

export const useUserProgress = () => {
  const { user } = useAuthState();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserProgress();
    }
  }, [user]);

  const loadUserProgress = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Récupérer le progrès depuis localStorage pour simplicité
      const storageKey = `user_progress_${user.id}`;
      const savedProgress = localStorage.getItem(storageKey);
      
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      } else {
        // Créer un progrès initial
        const initialProgress: UserProgress = {
          id: crypto.randomUUID(),
          user_id: user.id,
          content_read: 0,
          total_content: 10,
          correct_answers: 0,
          total_answers: 0,
          badges_earned: [],
          last_updated: new Date().toISOString()
        };
        
        localStorage.setItem(storageKey, JSON.stringify(initialProgress));
        setProgress(initialProgress);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
      toast.error('Erreur lors du chargement du progrès');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = (type: 'reading' | 'answer', correct?: boolean) => {
    if (!user || !progress) return;

    const newProgress = { ...progress };
    
    if (type === 'reading') {
      newProgress.content_read = Math.min(newProgress.content_read + 1, newProgress.total_content);
    } else if (type === 'answer') {
      newProgress.total_answers += 1;
      if (correct) {
        newProgress.correct_answers += 1;
      }
    }

    // Vérifier les nouveaux badges
    const earnedBadges = checkForNewBadges(newProgress);
    if (earnedBadges.length > 0) {
      earnedBadges.forEach(badge => {
        if (!newProgress.badges_earned.includes(badge.id)) {
          newProgress.badges_earned.push(badge.id);
          toast.success(`🏅 Nouveau badge débloqué : ${badge.name}!`);
        }
      });
    }

    newProgress.last_updated = new Date().toISOString();
    
    // Sauvegarder dans localStorage
    const storageKey = `user_progress_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(newProgress));
    
    setProgress(newProgress);
  };

  const checkForNewBadges = (currentProgress: UserProgress): Badge[] => {
    return availableBadges.filter(badge => {
      // Si le badge est déjà obtenu, ne pas le retourner
      if (currentProgress.badges_earned.includes(badge.id)) return false;
      
      // Vérifier les conditions
      if (badge.requirement_type === 'reading') {
        return currentProgress.content_read >= badge.requirement_value;
      } else if (badge.requirement_type === 'answers') {
        return currentProgress.correct_answers >= badge.requirement_value;
      }
      
      return false;
    });
  };

  const getProgressStats = (): ProgressStats => {
    if (!progress) {
      return {
        contentProgress: 0,
        answersProgress: 0,
        badges: []
      };
    }

    const earnedBadges = availableBadges.filter(badge => 
      progress.badges_earned.includes(badge.id)
    );

    return {
      contentProgress: progress.total_content > 0 ? 
        Math.round((progress.content_read / progress.total_content) * 100) : 0,
      answersProgress: progress.total_answers > 0 ? 
        Math.round((progress.correct_answers / progress.total_answers) * 100) : 0,
      badges: earnedBadges
    };
  };

  return {
    progress,
    loading,
    updateProgress,
    getProgressStats,
    availableBadges
  };
};
