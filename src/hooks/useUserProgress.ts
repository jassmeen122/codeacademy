
import { useState, useEffect } from 'react';
import { Badge, UserProgress } from '@/types/userProgress';

export const useUserProgress = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  // Badges disponibles dans le système
  const availableBadges: Badge[] = [
    {
      id: 'first-steps',
      name: 'FIRST_STEPS',
      description: 'Complete your first lesson',
      icon: '🚀',
      requirements: { content_read: 1 }
    },
    {
      id: 'knowledge-seeker',
      name: 'KNOWLEDGE_SEEKER',
      description: 'Read 10 lessons',
      icon: '📖',
      requirements: { content_read: 10 }
    },
    {
      id: 'quick-learner',
      name: 'QUICK_LEARNER',
      description: 'Answer 5 questions correctly',
      icon: '⚡',
      requirements: { correct_answers: 5 }
    },
    {
      id: 'scholar',
      name: 'SCHOLAR',
      description: 'Answer 25 questions correctly',
      icon: '🎓',
      requirements: { correct_answers: 25 }
    },
    {
      id: 'master',
      name: 'CYBER_MASTER',
      description: 'Complete 50 lessons and 50 correct answers',
      icon: '👑',
      requirements: { content_read: 50, correct_answers: 50 }
    }
  ];

  useEffect(() => {
    // Simuler le chargement des données de progression
    const loadProgress = () => {
      const savedProgress = localStorage.getItem('userProgress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      } else {
        // Données initiales
        const initialProgress: UserProgress = {
          content_read: 3,
          total_content: 25,
          correct_answers: 8,
          total_answers: 15
        };
        setProgress(initialProgress);
        localStorage.setItem('userProgress', JSON.stringify(initialProgress));
      }
      setLoading(false);
    };

    setTimeout(loadProgress, 500); // Simuler un délai de chargement
  }, []);

  const updateProgress = (type: 'reading' | 'answer', correct?: boolean) => {
    if (!progress) return;

    const newProgress = { ...progress };

    if (type === 'reading') {
      newProgress.content_read += 1;
      newProgress.total_content = Math.max(newProgress.total_content, newProgress.content_read);
    } else if (type === 'answer') {
      newProgress.total_answers += 1;
      if (correct) {
        newProgress.correct_answers += 1;
      }
    }

    setProgress(newProgress);
    localStorage.setItem('userProgress', JSON.stringify(newProgress));
  };

  const getProgressStats = () => {
    if (!progress) return { badges: [], answersProgress: 0 };

    // Calculer les badges obtenus
    const earnedBadges = availableBadges.filter(badge => {
      return Object.entries(badge.requirements).every(([key, value]) => {
        return progress[key as keyof UserProgress] >= value;
      });
    });

    // Calculer le pourcentage de bonnes réponses
    const answersProgress = progress.total_answers > 0 
      ? Math.round((progress.correct_answers / progress.total_answers) * 100)
      : 0;

    return {
      badges: earnedBadges,
      answersProgress
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
