
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { GameDifficulty, useCodingGame } from '@/hooks/useCodingGame';
import { Trophy, Code, Award, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

export const CodingMiniGame = () => {
  const {
    currentQuiz,
    currentQuizIndex,
    selectedAnswer,
    isCorrect,
    score,
    gameState,
    gamification,
    difficulty,
    changeDifficulty,
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
    
    // Get all options and filter out null/undefined ones
    const options = [
      currentQuiz.option1,
      currentQuiz.option2,
      currentQuiz.option3,
      // Check if option4 exists before adding it
      currentQuiz.hasOwnProperty('option4') ? (currentQuiz as any).option4 : null
    ].filter(Boolean).sort(() => 0.5 - Math.random());
    
    return (
      <div className="space-y-3">
        {options.map(option => renderAnswerButton(option))}
      </div>
    );
  };

  const getDifficultyColor = (level: GameDifficulty) => {
    switch(level) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return '';
    }
  };

  const renderDifficultySelector = () => {
    const difficulties: GameDifficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
    
    return (
      <div className="flex flex-col gap-2 mb-6">
        <h3 className="text-sm font-medium">Niveau de difficulté:</h3>
        <div className="flex gap-2">
          {difficulties.map(level => (
            <Button
              key={level}
              variant={difficulty === level ? "default" : "outline"}
              size="sm"
              className={`${difficulty === level ? 'bg-primary' : ''}`}
              onClick={() => changeDifficulty(level)}
            >
              {level === 'Beginner' ? 'Débutant' : level === 'Intermediate' ? 'Intermédiaire' : 'Avancé'}
            </Button>
          ))}
        </div>
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
              Testez vos connaissances avec {totalQuestions} questions en mode {
                difficulty === 'Beginner' ? 'Débutant' : 
                difficulty === 'Intermediate' ? 'Intermédiaire' : 'Avancé'
              }!
            </p>
            {gamification && (
              <div className="text-sm text-muted-foreground mt-2">
                Points actuels: <span className="font-medium">{gamification.points}</span>
              </div>
            )}
            
            {renderDifficultySelector()}
            
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
                <Badge className={`ml-2 ${getDifficultyColor(difficulty)}`}>
                  {difficulty === 'Beginner' ? 'Débutant' : 
                  difficulty === 'Intermediate' ? 'Intermédiaire' : 'Avancé'}
                </Badge>
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
              
              {selectedAnswer && currentQuiz && (currentQuiz as any).explanation && (
                <div className={`p-4 rounded-lg mt-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex gap-2 items-start">
                    <Lightbulb className={`h-5 w-5 ${isCorrect ? 'text-green-600' : 'text-red-600'}`} />
                    <p className="text-sm">{(currentQuiz as any).explanation}</p>
                  </div>
                </div>
              )}
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
              {score > totalQuestions * 0.6 ? "Bravo, tu as réussi!" : "Réessaie encore!"}
            </h3>
            
            <div className="text-4xl font-bold">
              {score}/{totalQuestions}
            </div>
            
            <Badge className={`${getDifficultyColor(difficulty)}`}>
              {difficulty === 'Beginner' ? 'Débutant' : 
              difficulty === 'Intermediate' ? 'Intermédiaire' : 'Avancé'}
            </Badge>
            
            <p className="text-muted-foreground">
              {score > totalQuestions * 0.6 
                ? "Excellentes connaissances en programmation!" 
                : "Continue de pratiquer, tu progresseras!"}
            </p>
            
            {gamification && gamification.badges && gamification.badges.length > 0 && (
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
