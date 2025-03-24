
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
  },
  {
    question: 'Quel langage est souvent utilisé pour le développement de sites web dynamiques ?',
    option1: 'PHP',
    option2: 'C',
    option3: 'Java',
    option4: 'Swift',
    correct_answer: 'PHP',
    explanation: 'PHP est un langage serveur très utilisé pour créer des sites dynamiques comme WordPress, Facebook ou Wikipedia.'
  },
  {
    question: 'Quel langage a introduit le concept de "Classes et Objets" ?',
    option1: 'Java',
    option2: 'Python',
    option3: 'C++',
    option4: 'C',
    correct_answer: 'C++',
    explanation: 'C++, conçu par Bjarne Stroustrup en 1983, a introduit la programmation orientée objet.'
  },
  {
    question: 'En quelle année JavaScript a-t-il été créé ?',
    option1: '1985',
    option2: '1995',
    option3: '2001',
    option4: '2010',
    correct_answer: '1995',
    explanation: 'JavaScript a été créé en 1995 par Brendan Eich en seulement 10 jours !'
  },
  {
    question: 'Quel langage est souvent utilisé pour l\'intelligence artificielle ?',
    option1: 'Java',
    option2: 'Python',
    option3: 'C++',
    option4: 'PHP',
    correct_answer: 'Python',
    explanation: 'Python est largement utilisé en IA grâce à ses bibliothèques comme TensorFlow, Keras et PyTorch.'
  },
  {
    question: 'Qui a inventé le langage C ?',
    option1: 'James Gosling',
    option2: 'Bjarne Stroustrup',
    option3: 'Dennis Ritchie',
    option4: 'Linus Torvalds',
    correct_answer: 'Dennis Ritchie',
    explanation: 'Dennis Ritchie a créé C en 1972 chez Bell Labs. C\'est un langage fondamental pour les systèmes d\'exploitation comme Unix et Linux.'
  }
];

// Badge thresholds
const BADGES = {
  BEGINNER: { name: 'Débutant', threshold: 50, icon: 'Trophy' },
  INTERMEDIATE: { name: 'Intermédiaire', threshold: 100, icon: 'Award' },
  ADVANCED: { name: 'Pro', threshold: 200, icon: 'Zap' },
  MASTER: { name: 'Maître', threshold: 500, icon: 'Star' }
};

// Game states
type GameState = 'loading' | 'ready' | 'playing' | 'result' | 'adventure' | 'finished';

export interface GamePosition {
  level: number;
  position: number;
  path: number[];
}

export const useCodingMinigame = () => {
  const { user } = useAuthState();
  const [quizzes, setQuizzes] = useState<CodingQuiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [gameState, setGameState] = useState<GameState>('loading');
  const [gamification, setGamification] = useState<UserGamification | null>(null);
  const [position, setPosition] = useState<GamePosition>({ level: 1, position: 0, path: [] });
  const [answerLocked, setAnswerLocked] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);

  // Initialize game data
  useEffect(() => {
    const initializeGame = async () => {
      try {
        // Transform static data to include required fields
        const formattedQuizzes = QUIZ_DATA.map((quiz, index) => ({
          ...quiz,
          id: `static-quiz-${index}`,
          created_at: new Date().toISOString(),
          difficulty: 'Beginner',
          language: 'general',
        }));

        // Shuffle quiz questions
        const shuffledQuizzes = [...formattedQuizzes].sort(() => Math.random() - 0.5);
        setQuizzes(shuffledQuizzes);
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
          // Create a new gamification record if none exists
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
    // Shuffle quizzes when starting the game
    const shuffled = [...quizzes].sort(() => Math.random() - 0.5);
    setQuizzes(shuffled);
    setCurrentQuizIndex(0);
    setScore(0);
    setConsecutiveCorrect(0);
    setStreak(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameState('playing');
    setPosition({ level: 1, position: 0, path: [] });
    setGameStartTime(new Date());
    setShowExplanation(false);
  }, [quizzes]);

  // Select answer function
  const selectAnswer = useCallback((answer: string) => {
    if (answerLocked || !quizzes[currentQuizIndex]) return;
    
    setAnswerLocked(true);
    setSelectedAnswer(answer);
    
    const currentQuiz = quizzes[currentQuizIndex];
    const correct = answer === currentQuiz.correct_answer;
    setIsCorrect(correct);
    
    if (correct) {
      // Update score and streak
      setScore(prevScore => prevScore + 10);
      setConsecutiveCorrect(prev => prev + 1);
      setStreak(prev => prev + 1);
      
      // Update position in adventure
      setPosition(prev => ({
        ...prev,
        position: prev.position + 1,
        path: [...prev.path, 1]
      }));
      
      // Show visual success feedback
      toast.success('Bonne réponse ! +10 points', {
        position: 'top-center',
      });
      
      // Earn badges for streaks
      if (streak === 2) {
        toast.success('🔥 Combo x3 ! +5 points bonus', {
          position: 'top-center',
        });
        setScore(prevScore => prevScore + 5);
      } else if (streak === 4) {
        toast.success('🔥🔥 Combo x5 ! +10 points bonus', {
          position: 'top-center',
        });
        setScore(prevScore => prevScore + 10);
      }
    } else {
      // Reset streak on wrong answer
      setStreak(0);
      setPosition(prev => ({
        ...prev,
        path: [...prev.path, 0]
      }));
      
      // Show visual failure feedback
      toast.error('Pas tout à fait...', {
        position: 'top-center',
      });
    }
    
    // Show explanation
    setShowExplanation(true);
    
    // After a delay, move to next question or finish
    setTimeout(() => {
      if (currentQuizIndex < quizzes.length - 1) {
        setCurrentQuizIndex(prevIndex => prevIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setAnswerLocked(false);
        setShowExplanation(false);
      } else {
        // Game completed
        setGameState('finished');
        const endTime = new Date();
        const startTime = gameStartTime || new Date();
        const seconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
        setTimeTaken(seconds);
        updateGamificationData();
      }
    }, 3000);
  }, [answerLocked, currentQuizIndex, quizzes, gameStartTime, streak]);

  // Update gamification data at the end of the game
  const updateGamificationData = useCallback(async () => {
    if (!user || !gamification) return;
    
    try {
      // Calculate points from this game session
      const basePoints = score;
      const timeBonus = Math.max(0, 300 - timeTaken) / 10; // Faster = more bonus points (max 30)
      const totalPoints = Math.floor(basePoints + timeBonus);
      
      // Calculate new total points
      const newTotalPoints = gamification.points + totalPoints;
      
      // Check for new badges earned
      const currentBadges = gamification.badges || [];
      const newBadges = [...currentBadges];
      
      Object.values(BADGES).forEach(badge => {
        if (newTotalPoints >= badge.threshold && !currentBadges.includes(badge.name)) {
          newBadges.push(badge.name);
          toast.success(`🏆 Badge débloqué : ${badge.name}!`, {
            position: 'top-center',
            duration: 5000,
          });
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
      
      // Store this game result
      const { error: gameError } = await supabase
        .from('mini_game_scores')
        .insert([{
          user_id: user.id,
          score: totalPoints,
          time_taken: timeTaken,
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
      
      toast.success(`+${totalPoints} points! Total: ${newTotalPoints}`, {
        position: 'bottom-center',
        duration: 4000,
      });
    } catch (error: any) {
      console.error('Error updating gamification data:', error);
      toast.error('Erreur lors de la mise à jour des points');
    }
  }, [user, gamification, score, timeTaken]);

  // Reset game for replay
  const resetGame = useCallback(() => {
    setGameState('ready');
    setCurrentQuizIndex(0);
    setScore(0);
    setConsecutiveCorrect(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setAnswerLocked(false);
    setShowExplanation(false);
    setStreak(0);
    setPosition({ level: 1, position: 0, path: [] });
    
    // Shuffle the questions for next game
    const shuffled = [...quizzes].sort(() => Math.random() - 0.5);
    setQuizzes(shuffled);
  }, [quizzes]);

  // Get feedback based on score
  const getFeedback = useCallback(() => {
    const maxScore = quizzes.length * 10;
    const scorePercentage = (score / maxScore) * 100;
    
    if (scorePercentage >= 80) {
      return "Expert en programmation ! 🎉";
    } else if (scorePercentage >= 40) {
      return "Bon niveau, continue comme ça !";
    } else {
      return "Apprenti codeur, continue d'apprendre !";
    }
  }, [score, quizzes.length]);

  return {
    quizzes,
    currentQuiz: quizzes[currentQuizIndex],
    currentQuizIndex,
    selectedAnswer,
    isCorrect,
    score,
    consecutiveCorrect,
    gameState,
    gamification,
    position,
    timeTaken,
    streak,
    showExplanation,
    startGame,
    selectAnswer,
    resetGame,
    totalQuestions: quizzes.length,
    getFeedback,
  };
};
