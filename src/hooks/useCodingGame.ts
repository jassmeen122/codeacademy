
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CodingQuiz, UserGamification } from '@/types/course';
import { useAuthState } from '@/hooks/useAuthState';

// Define static quiz data for the mini-game
const QUIZ_DATA: Omit<CodingQuiz, 'id' | 'created_at' | 'difficulty' | 'language'>[] = [
  {
    question: 'Qui a créé le langage Python ?',
    option1: 'James Gosling',
    option2: 'Bjarne Stroustrup',
    option3: 'Guido van Rossum',
    option4: 'Dennis Ritchie',
    correct_answer: 'Guido van Rossum',
    explanation: 'Python a été créé en 1989 par Guido van Rossum, un programmeur néerlandais. Il voulait un langage simple et lisible.'
  },
  {
    question: 'Quel langage est utilisé pour développer Android ?',
    option1: 'Java',
    option2: 'C#',
    option3: 'Python',
    option4: 'Swift',
    correct_answer: 'Java',
    explanation: 'Java est le langage principal pour Android. Kotlin est aussi populaire aujourd\'hui.'
  },
  {
    question: 'Quel langage est surnommé "le langage du web" ?',
    option1: 'JavaScript',
    option2: 'C',
    option3: 'Python',
    option4: 'Ruby',
    correct_answer: 'JavaScript',
    explanation: 'JavaScript est utilisé pour le développement front-end et back-end sur le web. Il est né en 1995 avec Netscape.'
  },
  {
    question: 'Quel langage a été conçu pour les bases de données ?',
    option1: 'SQL',
    option2: 'C++',
    option3: 'Python',
    option4: 'PHP',
    correct_answer: 'SQL',
    explanation: 'SQL (Structured Query Language) est utilisé pour gérer et interroger les bases de données relationnelles.'
  },
  {
    question: 'Lequel de ces langages est compilé ?',
    option1: 'Python',
    option2: 'PHP',
    option3: 'C',
    option4: 'JavaScript',
    correct_answer: 'C',
    explanation: 'C est un langage compilé qui se transforme en code machine avant d\'être exécuté.'
  }
];

// Badge thresholds and game states
const BADGES = {
  BEGINNER: { name: 'Débutant', threshold: 50 },
  INTERMEDIATE: { name: 'Intermédiaire', threshold: 100 },
  ADVANCED: { name: 'Pro', threshold: 200 },
  MASTER: { name: 'Maître', threshold: 500 }
};

type GameState = 'loading' | 'ready' | 'playing' | 'finished';

export const useCodingGame = () => {
  const { user } = useAuthState();
  const [quizzes, setQuizzes] = useState<CodingQuiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('loading');
  const [gamification, setGamification] = useState<UserGamification | null>(null);

  // Initialize the game data
  useEffect(() => {
    const initializeGame = async () => {
      try {
        // Format quiz data with required fields
        const formattedQuizzes = QUIZ_DATA.map((quiz, index) => ({
          ...quiz,
          id: `static-quiz-${index}`,
          created_at: new Date().toISOString(),
          difficulty: 'Beginner',
          language: 'general',
        }));

        setQuizzes(formattedQuizzes);
        setGameState('ready');
      } catch (error) {
        console.error('Error initializing game:', error);
        toast.error('Erreur lors de l\'initialisation du jeu');
        setGameState('ready');
      }
    };

    initializeGame();
  }, []);

  // Fetch user gamification data
  useEffect(() => {
    const fetchGamificationData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_gamification')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
          throw error;
        }
        
        if (data) {
          setGamification(data as UserGamification);
        } else {
          // Create a new gamification record
          const { data: newData, error: insertError } = await supabase
            .from('user_gamification')
            .insert([{ 
              user_id: user.id,
              points: 0,
              badges: [],
              last_played_at: new Date().toISOString()
            }])
            .select('*')
            .single();
          
          if (insertError) throw insertError;
          
          if (newData) {
            setGamification(newData as UserGamification);
          }
        }
      } catch (error: any) {
        console.error('Error fetching gamification data:', error);
      }
    };

    fetchGamificationData();
  }, [user]);

  // Start game function
  const startGame = useCallback(() => {
    setCurrentQuizIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameState('playing');
  }, []);

  // Select answer function
  const selectAnswer = useCallback((answer: string) => {
    if (!quizzes[currentQuizIndex]) return;
    
    setSelectedAnswer(answer);
    
    const currentQuiz = quizzes[currentQuizIndex];
    const correct = answer === currentQuiz.correct_answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prevScore => prevScore + 1);
      toast.success('Bonne réponse !');
    } else {
      toast.error('Pas tout à fait...');
    }
    
    // Move to next question or finish after a delay
    setTimeout(() => {
      if (currentQuizIndex < quizzes.length - 1) {
        setCurrentQuizIndex(prevIndex => prevIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setGameState('finished');
        updateGamificationData();
      }
    }, 1500);
  }, [currentQuizIndex, quizzes]);

  // Update gamification data at the end of the game
  const updateGamificationData = useCallback(async () => {
    if (!user || !gamification) return;
    
    try {
      // Calculate points
      const newTotalPoints = gamification.points + (score * 10);
      
      // Check for new badges
      const currentBadges = gamification.badges || [];
      const newBadges = [...currentBadges];
      
      Object.values(BADGES).forEach(badge => {
        if (newTotalPoints >= badge.threshold && !currentBadges.includes(badge.name)) {
          newBadges.push(badge.name);
          toast.success(`Badge débloqué : ${badge.name}!`);
        }
      });
      
      // Update user_gamification table
      const { error } = await supabase
        .from('user_gamification')
        .update({
          points: newTotalPoints,
          badges: newBadges,
          last_played_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Store game result
      const { error: gameError } = await supabase
        .from('mini_game_scores')
        .insert([{
          user_id: user.id,
          score: score * 10,
          time_taken: 0, // We're not tracking time in this simplified version
          completed_at: new Date().toISOString()
        }]);
      
      if (gameError) throw gameError;
      
      // Update local state
      setGamification({
        ...gamification,
        points: newTotalPoints,
        badges: newBadges,
        last_played_at: new Date().toISOString()
      });
      
      toast.success(`+${score * 10} points! Total: ${newTotalPoints}`);
    } catch (error: any) {
      console.error('Error updating gamification data:', error);
      toast.error('Erreur lors de la mise à jour des points');
    }
  }, [user, gamification, score]);

  // Reset game for replay
  const resetGame = useCallback(() => {
    setGameState('ready');
    setCurrentQuizIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  return {
    currentQuiz: quizzes[currentQuizIndex],
    currentQuizIndex,
    selectedAnswer,
    isCorrect,
    score,
    gameState,
    gamification,
    startGame,
    selectAnswer,
    resetGame,
    totalQuestions: quizzes.length
  };
};
