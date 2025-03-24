
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useCodingGame } from '@/hooks/useCodingGame';
import { Trophy, Code, Award, CheckCircle, XCircle } from 'lucide-react';

export const CodingMiniGame = () => {
  const {
    currentQuiz,
    currentQuizIndex,
    selectedAnswer,
    isCorrect,
    score,
    gameState,
    gamification,
    startGame,
    selectAnswer,
    resetGame,
    totalQuestions
  } = useCodingGame();

  const renderAnswerButton = (option: string) => {
    const isSelected = selectedAnswer === option;
    const isCorrectAnswer = currentQuiz?.correct_answer === option;
    
    let className = "justify-start text-left h-auto py-3 px-4 font-normal";
    
    if (selectedAnswer) {
      if (isSelected) {
        className += isCorrect 
          ? " bg-green-100 border-green-400 hover:bg-green-100" 
          : " bg-red-100 border-red-400 hover:bg-red-100";
      } else if (isCorrectAnswer) {
        className += " bg-green-100 border-green-400 hover:bg-green-100";
      }
    }
    
    return (
      <Button
        key={option}
        variant="outline"
        className={className}
        onClick={() => selectAnswer(option)}
        disabled={!!selectedAnswer}
      >
        <span className="flex items-center w-full">
          <span className="flex-1">{option}</span>
          {selectedAnswer && isCorrectAnswer && (
            <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
          )}
          {selectedAnswer && isSelected && !isCorrect && (
            <XCircle className="h-5 w-5 text-red-600 ml-2" />
          )}
        </span>
      </Button>
    );
  };

  const renderOptions = () => {
    if (!currentQuiz) return null;
    
    // Get all options and shuffle them
    const options = [
      currentQuiz.option1,
      currentQuiz.option2,
      currentQuiz.option3
    ].sort(() => 0.5 - Math.random());
    
    return (
      <div className="space-y-3">
        {options.map(option => renderAnswerButton(option))}
      </div>
    );
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'loading':
        return (
          <div className="py-8 text-center">
            <p>Chargement des questions...</p>
          </div>
        );
      
      case 'ready':
        return (
          <div className="py-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
              <Code className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Mini-Jeu de Programmation</h3>
            <p className="text-muted-foreground">
              Testez vos connaissances avec 5 questions rapides!
            </p>
            {gamification && (
              <div className="text-sm text-muted-foreground mt-2">
                Points actuels: <span className="font-medium">{gamification.points}</span>
              </div>
            )}
            <Button className="mt-4" onClick={startGame}>
              Commencer le jeu
            </Button>
          </div>
        );
      
      case 'playing':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-sm font-medium">Question {currentQuizIndex + 1}/{totalQuestions}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{score}</span>
              </div>
            </div>
            
            <Progress value={(currentQuizIndex / totalQuestions) * 100} className="h-2 mb-6" />
            
            <div className="space-y-6">
              <div className="text-lg font-medium">{currentQuiz?.question}</div>
              {renderOptions()}
            </div>
          </>
        );
      
      case 'finished':
        return (
          <div className="py-8 text-center space-y-6">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            
            <h3 className="text-2xl font-bold">
              {score > 3 ? "Bravo, tu as réussi!" : "Réessaie encore!"}
            </h3>
            
            <div className="text-4xl font-bold">
              {score}/{totalQuestions}
            </div>
            
            <p className="text-muted-foreground">
              {score > 3 
                ? "Excellentes connaissances en programmation!" 
                : "Continue de pratiquer, tu progresseras!"}
            </p>
            
            {gamification && gamification.badges.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Badges débloqués:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {gamification.badges.map(badge => (
                    <Badge key={badge} variant="secondary" className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <Button onClick={resetGame} className="mt-4">
              Rejouer
            </Button>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader className={gameState === 'playing' ? 'pb-2' : ''}>
        <CardTitle className={gameState === 'playing' ? 'text-lg' : 'sr-only'}>
          Mini-Jeu de Code
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderGameState()}
      </CardContent>
    </Card>
  );
};
