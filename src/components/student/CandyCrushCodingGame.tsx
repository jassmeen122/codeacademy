
import React, { useState, useEffect } from 'react';
import { GameLevel, GameMode } from '@/types/codingChallenge';
import { challenges } from '@/data/codingChallenges';
import { GameMenu } from './crush-game/GameMenu';
import { GameSuccess } from './crush-game/GameSuccess';
import { GamePlay } from './crush-game/GamePlay';

export const CandyCrushCodingGame = () => {
  const [levels, setLevels] = useState<GameLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('menu');

  useEffect(() => {
    // Initialize levels
    const initialLevels: GameLevel[] = challenges.map((challenge, index) => ({
      id: index + 1,
      name: `Niveau ${index + 1}`,
      challenge,
      unlocked: index === 0, // Only first level unlocked initially
      completed: false
    }));
    setLevels(initialLevels);
  }, []);

  const handleLevelClick = (levelId: number) => {
    const level = levels.find(l => l.id === levelId);
    if (level && level.unlocked && !level.completed) {
      setCurrentLevel(levelId);
      setGameMode('playing');
      setUserAnswer('');
      setShowResult(false);
    }
  };

  const handleSubmitAnswer = () => {
    const level = levels.find(l => l.id === currentLevel);
    if (!level) return;

    const correct = userAnswer.toLowerCase().includes(level.challenge.correctAnswer.toLowerCase());
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setTimeout(() => {
        // Mark current level as completed
        const updatedLevels = levels.map(l => {
          if (l.id === currentLevel) {
            return { ...l, completed: true };
          }
          // Unlock next level
          if (l.id === currentLevel! + 1) {
            return { ...l, unlocked: true };
          }
          return l;
        });
        setLevels(updatedLevels);
        setGameMode('success');
      }, 2000);
    }
  };

  const handleBackToMenu = () => {
    setGameMode('menu');
    setCurrentLevel(null);
    setUserAnswer('');
    setShowResult(false);
  };

  const currentLevelData = levels.find(l => l.id === currentLevel);

  if (gameMode === 'menu') {
    return <GameMenu levels={levels} onLevelClick={handleLevelClick} />;
  }

  if (gameMode === 'success') {
    return (
      <GameSuccess 
        currentLevel={currentLevel}
        currentLevelData={currentLevelData}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  return (
    <GamePlay
      currentLevel={currentLevel}
      currentLevelData={currentLevelData}
      userAnswer={userAnswer}
      setUserAnswer={setUserAnswer}
      showResult={showResult}
      isCorrect={isCorrect}
      onSubmitAnswer={handleSubmitAnswer}
      onBackToMenu={handleBackToMenu}
    />
  );
};
