
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useCodingMinigame } from '@/hooks/useCodingMinigame';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Trophy, 
  Star, 
  Zap, 
  Code, 
  ChevronRight, 
  Sparkles, 
  Brain, 
  Timer,
  CheckCircle,
  XCircle,
  ArrowRight,
  Lightbulb,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Add framer-motion as dependency
import { toast } from 'sonner';

const CodingGamePage = () => {
  const {
    currentQuiz,
    currentQuizIndex,
    selectedAnswer,
    isCorrect,
    score,
    consecutiveCorrect,
    gameState,
    position,
    timeTaken,
    streak,
    showExplanation,
    startGame,
    selectAnswer,
    resetGame,
    totalQuestions,
    getFeedback
  } = useCodingMinigame();

  const [showInstructions, setShowInstructions] = useState(false);

  // Apply the cyberpunk theme when this page loads
  useEffect(() => {
    document.body.classList.add('game-mode');
    
    return () => {
      document.body.classList.remove('game-mode');
    };
  }, []);

  const renderAnswerButton = (option: string, label: string) => {
    const isSelected = selectedAnswer === option;
    const isCorrectAnswer = currentQuiz?.correct_answer === option;
    
    let buttonClass = "w-full text-left p-4 rounded-lg border-2 border-blue-900/50 bg-gray-900/80 hover:bg-blue-900/30 hover:border-blue-500/50 transition-all";
    let iconClass = "";
    
    if (selectedAnswer) {
      if (isSelected) {
        if (isCorrect) {
          buttonClass = "w-full text-left p-4 rounded-lg border-2 border-green-500/80 bg-green-900/20 text-green-400";
          iconClass = "text-green-400";
        } else {
          buttonClass = "w-full text-left p-4 rounded-lg border-2 border-red-500/80 bg-red-900/20 text-red-400";
          iconClass = "text-red-400";
        }
      } else if (isCorrectAnswer) {
        buttonClass = "w-full text-left p-4 rounded-lg border-2 border-green-500/80 bg-green-900/20 text-green-400";
        iconClass = "text-green-400";
      }
    }
    
    return (
      <motion.div 
        key={option}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-3"
      >
        <button
          className={buttonClass}
          onClick={() => selectAnswer(option)}
          disabled={!!selectedAnswer}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-900/50 text-blue-300 font-mono">
                {label}
              </span>
              <span className="text-lg">{option}</span>
            </div>
            
            {selectedAnswer && (
              <span className={iconClass}>
                {isCorrectAnswer && <CheckCircle className="h-6 w-6" />}
                {isSelected && !isCorrect && <XCircle className="h-6 w-6" />}
              </span>
            )}
          </div>
        </button>
      </motion.div>
    );
  };

  const renderGameContent = () => {
    switch(gameState) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <div className="w-20 h-20 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <p className="mt-4 text-blue-400 text-xl">Initialisation de l'expérience...</p>
          </div>
        );
      
      case 'ready':
        return (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center mb-8"
            >
              <Zap className="h-16 w-16 text-white" />
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4"
            >
              Cyber Code Challenge
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg text-blue-200 max-w-2xl mb-8"
            >
              Testez vos connaissances en programmation et obtenez des points pour débloquer des badges spéciaux. Répondez correctement pour progresser dans le labyrinthe digital !
            </motion.p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <Button 
                  onClick={startGame} 
                  className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-2 border-blue-400/30 rounded-xl shadow-[0_0_15px_rgba(66,153,225,0.5)] hover:shadow-[0_0_20px_rgba(66,153,225,0.8)] transition-all duration-300"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Commencer le défi
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                <Button 
                  variant="outline" 
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="px-6 py-6 text-lg border-2 border-blue-500/30 bg-transparent text-blue-400 rounded-xl hover:bg-blue-900/20 transition-all duration-300"
                >
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Comment jouer
                </Button>
              </motion.div>
            </div>
            
            {showInstructions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8 p-6 bg-blue-900/20 border-2 border-blue-500/30 rounded-xl max-w-2xl"
              >
                <h3 className="text-xl font-semibold text-blue-300 mb-4">Instructions</h3>
                <ul className="text-left space-y-2 text-blue-200">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Répondez correctement aux questions pour progresser dans le labyrinthe digital.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Chaque réponse correcte vous rapporte 10 points.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Enchaînez les bonnes réponses pour obtenir des combos et points bonus !</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>À la fin, un score vous est attribué et peut vous permettre de débloquer des badges.</span>
                  </li>
                </ul>
              </motion.div>
            )}
          </div>
        );
      
      case 'playing':
        if (!currentQuiz) return null;
        
        return (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg px-4 py-2 text-blue-300">
                  <span className="text-sm font-medium">Question</span>
                  <div className="text-xl font-bold">{currentQuizIndex + 1} / {totalQuestions}</div>
                </div>
                
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg px-4 py-2 text-purple-300">
                  <span className="text-sm font-medium">Score</span>
                  <div className="text-xl font-bold flex items-center">
                    <Trophy className="h-4 w-4 mr-1 text-yellow-400" />
                    {score}
                  </div>
                </div>
                
                {streak > 0 && (
                  <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg px-4 py-2 text-orange-300">
                    <span className="text-sm font-medium">Combo</span>
                    <div className="text-xl font-bold flex items-center">
                      <Flame className="h-4 w-4 mr-1 text-orange-400" />
                      {streak}x
                    </div>
                  </div>
                )}
              </div>
              
              <Progress 
                value={((currentQuizIndex) / totalQuestions) * 100} 
                className="h-2 bg-blue-900/30 w-full md:w-1/2" 
              />
            </div>
            
            <motion.div
              key={currentQuizIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 p-6 bg-blue-900/20 border-2 border-blue-500/30 rounded-xl"
            >
              <h2 className="text-2xl font-bold text-blue-200 mb-1">{currentQuiz.question}</h2>
              <div className="flex items-center gap-2 text-blue-400">
                <Brain className="h-4 w-4" />
                <span className="text-sm">Culture informatique</span>
              </div>
            </motion.div>
            
            <div className="space-y-2 mb-6">
              {renderAnswerButton(currentQuiz.option1, "A")}
              {renderAnswerButton(currentQuiz.option2, "B")}
              {renderAnswerButton(currentQuiz.option3, "C")}
              {renderAnswerButton(currentQuiz.option4, "D")}
            </div>
            
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-6 rounded-xl mt-6 ${isCorrect ? 'bg-green-900/20 border-2 border-green-500/30' : 'bg-red-900/20 border-2 border-red-500/30'}`}
                >
                  <h3 className={`text-xl font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? 'Bonne réponse !' : 'Pas tout à fait...'}
                  </h3>
                  <p className="text-blue-100">{currentQuiz.explanation}</p>
                  
                  <div className="mt-4 flex justify-end">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <Button 
                        variant="ghost" 
                        className="text-blue-300 hover:text-blue-100 border border-blue-500/30 hover:bg-blue-800/20 rounded-lg"
                      >
                        Suite <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
        
      case 'finished':
        return (
          <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center mb-6"
            >
              <Sparkles className="h-12 w-12 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4 text-center"
            >
              Défi terminé !
            </motion.h1>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-center mb-8"
            >
              <p className="text-xl text-blue-200 mb-2">{getFeedback()}</p>
              <p className="text-blue-400">
                Temps: <span className="font-mono font-medium text-blue-300">{Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, '0')}</span>
              </p>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="grid grid-cols-2 gap-6 mb-10 w-full max-w-md"
            >
              <div className="flex flex-col items-center justify-center bg-blue-900/30 border-2 border-blue-500/30 rounded-xl p-6">
                <Trophy className="h-8 w-8 text-yellow-400 mb-2" />
                <div className="text-3xl font-bold text-blue-200">{score}</div>
                <div className="text-sm text-blue-400">Points</div>
              </div>
              
              <div className="flex flex-col items-center justify-center bg-blue-900/30 border-2 border-blue-500/30 rounded-xl p-6">
                <Star className="h-8 w-8 text-blue-400 mb-2" />
                <div className="text-3xl font-bold text-blue-200">
                  {Math.round((score / (totalQuestions * 10)) * 100)}%
                </div>
                <div className="text-sm text-blue-400">Précision</div>
              </div>
            </motion.div>
            
            <div className="flex gap-4 mb-10">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                <Button 
                  onClick={resetGame}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-2 border-blue-400/30 rounded-lg shadow-[0_0_10px_rgba(66,153,225,0.4)] hover:shadow-[0_0_15px_rgba(66,153,225,0.6)] transition-all duration-300"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Rejouer
                </Button>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
              className="w-full bg-blue-900/20 border-2 border-blue-500/30 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                Progression des badges
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-blue-300 flex items-center">
                      <Trophy className="h-4 w-4 mr-1 text-yellow-400" />
                      Débutant
                    </span>
                    <span className="text-blue-400">50 points</span>
                  </div>
                  <Progress value={Math.min(score, 50) / 50 * 100} className="h-2 bg-blue-900/30" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-blue-300 flex items-center">
                      <Award className="h-4 w-4 mr-1 text-blue-400" />
                      Intermédiaire
                    </span>
                    <span className="text-blue-400">100 points</span>
                  </div>
                  <Progress value={Math.min(score, 100) / 100 * 100} className="h-2 bg-blue-900/30" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-blue-300 flex items-center">
                      <Zap className="h-4 w-4 mr-1 text-purple-400" />
                      Pro
                    </span>
                    <span className="text-blue-400">200 points</span>
                  </div>
                  <Progress value={Math.min(score, 200) / 200 * 100} className="h-2 bg-blue-900/30" />
                </div>
              </div>
            </motion.div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="coding-game-container min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {renderGameContent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CodingGamePage;
