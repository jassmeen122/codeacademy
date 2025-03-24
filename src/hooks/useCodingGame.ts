
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CodingQuiz, UserGamification } from '@/types/course';
import { useAuthState } from '@/hooks/useAuthState';

export const useCodingGame = () => {
  const { user } = useAuthState();
  const [quizzes, setQuizzes] = useState<CodingQuiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'loading' | 'ready' | 'playing' | 'finished'>('loading');
  const [gamification, setGamification] = useState<UserGamification | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  
  // Number of questions per game
  const QUESTIONS_PER_GAME = 5;
  
  // Badge thresholds
  const BADGES = {
    BEGINNER: { name: 'Débutant', threshold: 50 },
    INTERMEDIATE: { name: 'Intermédiaire', threshold: 100 },
    ADVANCED: { name: 'Pro', threshold: 200 },
    MASTER: { name: 'Maître', threshold: 500 }
  };

  // Fetch quiz questions from Supabase
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data, error } = await supabase
          .from('coding_quiz')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          // Shuffle the questions
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          // Take only the number we need
          const selected = shuffled.slice(0, QUESTIONS_PER_GAME);
          setQuizzes(selected as CodingQuiz[]);
          setGameState('ready');
        }
      } catch (error: any) {
        console.error('Error fetching coding quizzes:', error);
        toast.error('Erreur lors du chargement des questions');
      }
    };

    fetchQuizzes();
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
            .insert([{ user_id: user.id }])
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

  // Start the game
  const startGame = () => {
    setCurrentQuizIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameState('playing');
  };

  // Handle answer selection
  const selectAnswer = async (answer: string) => {
    if (isAnswerLocked || gameState !== 'playing') return;
    
    setIsAnswerLocked(true);
    setSelectedAnswer(answer);
    
    const currentQuiz = quizzes[currentQuizIndex];
    const correct = answer === currentQuiz.correct_answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }
    
    // Wait a moment to show the result before moving to the next question
    setTimeout(() => {
      if (currentQuizIndex < quizzes.length - 1) {
        setCurrentQuizIndex(prevIndex => prevIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setIsAnswerLocked(false);
      } else {
        setGameState('finished');
        updateGamificationData(correct ? 1 : 0);
      }
    }, 1500);
  };

  // Update the user's gamification data
  const updateGamificationData = async (lastQuestionPoints: number) => {
    if (!user || !gamification) return;
    
    try {
      // Calculate points (10 points per correct answer)
      const pointsToAdd = score * 10 + lastQuestionPoints * 10;
      const newTotalPoints = gamification.points + pointsToAdd;
      
      // Check if any new badges were earned
      const currentBadges = gamification.badges || [];
      const newBadges = [...currentBadges];
      
      Object.values(BADGES).forEach(badge => {
        if (newTotalPoints >= badge.threshold && !currentBadges.includes(badge.name)) {
          newBadges.push(badge.name);
          toast.success(`🏆 Badge débloqué : ${badge.name}!`);
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
      
      // Update local state
      setGamification({
        ...gamification,
        points: newTotalPoints,
        badges: newBadges,
        last_played_at: new Date().toISOString()
      });
      
      toast.success(`+${pointsToAdd} points! Total: ${newTotalPoints}`);
    } catch (error: any) {
      console.error('Error updating gamification data:', error);
      toast.error('Erreur lors de la mise à jour des points');
    }
  };

  // Reset the game
  const resetGame = () => {
    setGameState('ready');
    setCurrentQuizIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setIsAnswerLocked(false);
    
    // Shuffle the questions
    const shuffled = [...quizzes].sort(() => 0.5 - Math.random());
    setQuizzes(shuffled);
  };

  return {
    quizzes,
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
    totalQuestions: QUESTIONS_PER_GAME
  };
};
