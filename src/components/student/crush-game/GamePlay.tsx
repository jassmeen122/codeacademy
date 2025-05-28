
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from 'lucide-react';
import { GameLevel } from '@/types/codingChallenge';

interface GamePlayProps {
  currentLevel: number | null;
  currentLevelData: GameLevel | undefined;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  showResult: boolean;
  isCorrect: boolean;
  onSubmitAnswer: () => void;
  onBackToMenu: () => void;
}

export const GamePlay: React.FC<GamePlayProps> = ({
  currentLevel,
  currentLevelData,
  userAnswer,
  setUserAnswer,
  showResult,
  isCorrect,
  onSubmitAnswer,
  onBackToMenu
}) => {
  if (!currentLevelData) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'python': return 'bg-gradient-to-r from-blue-100 to-yellow-100 text-blue-800 border-blue-200';
      case 'sql': return 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200';
      case 'php': return 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-200';
      case 'java': return 'bg-gradient-to-r from-red-100 to-orange-100 text-red-800 border-red-200';
      case 'javascript': return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-200';
      case 'c': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200';
      case 'cpp': return 'bg-gradient-to-r from-indigo-100 to-purple-200 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeText = (type: string) => {
    switch (type) {
      case 'python': return 'PYTHON';
      case 'sql': return 'SQL';
      case 'php': return 'PHP';
      case 'java': return 'JAVA';
      case 'javascript': return 'JAVASCRIPT';
      case 'c': return 'C';
      case 'cpp': return 'C++';
      default: return type.toUpperCase();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="mb-6">
        <Button variant="outline" onClick={onBackToMenu} className="mb-4">
          ← Retour au menu
        </Button>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold">Niveau {currentLevel}</h2>
          <Badge className={getTypeColor(currentLevelData.challenge.type)}>
            {getTypeBadgeText(currentLevelData.challenge.type)}
          </Badge>
          <div className="flex items-center gap-1">
            {currentLevelData.challenge.type === 'python' ? (
              <>
                <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
              </>
            ) : currentLevelData.challenge.type === 'sql' ? (
              <>
                <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
                <div className="w-4 h-4 bg-red-400 rounded-sm"></div>
              </>
            ) : currentLevelData.challenge.type === 'php' ? (
              <>
                <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                <div className="w-4 h-4 bg-indigo-400 rounded-sm"></div>
              </>
            ) : currentLevelData.challenge.type === 'java' ? (
              <>
                <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                <div className="w-4 h-4 bg-orange-400 rounded-sm"></div>
              </>
            ) : currentLevelData.challenge.type === 'c' ? (
              <>
                <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                <div className="w-4 h-4 bg-blue-800 rounded-sm"></div>
              </>
            ) : currentLevelData.challenge.type === 'cpp' ? (
              <>
                <div className="w-4 h-4 bg-indigo-600 rounded-sm"></div>
                <div className="w-4 h-4 bg-purple-700 rounded-sm"></div>
              </>
            ) : (
              <>
                <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
                <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
              </>
            )}
          </div>
        </div>
        <h3 className={`text-xl font-semibold ${
          currentLevelData.challenge.type === 'python' ? 'text-blue-600' : 
          currentLevelData.challenge.type === 'sql' ? 'text-orange-600' : 
          currentLevelData.challenge.type === 'php' ? 'text-purple-600' :
          currentLevelData.challenge.type === 'java' ? 'text-red-600' : 
          currentLevelData.challenge.type === 'c' ? 'text-blue-700' :
          currentLevelData.challenge.type === 'cpp' ? 'text-indigo-700' : 'text-yellow-600'
        }`}>
          {currentLevelData.challenge.title}
        </h3>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <p className="mb-4 text-lg">{currentLevelData.challenge.description}</p>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap mb-4 border-l-4 border-blue-500">
            {currentLevelData.challenge.code}
          </div>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium">Ta réponse :</label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Explique ce qui se passe..."
              className={`w-full p-3 border rounded-lg focus:border-blue-400 ${
                currentLevelData.challenge.type === 'python' 
                  ? 'border-blue-200' 
                  : currentLevelData.challenge.type === 'sql' 
                  ? 'border-orange-200'
                  : currentLevelData.challenge.type === 'php'
                  ? 'border-purple-200'
                  : currentLevelData.challenge.type === 'java'
                  ? 'border-red-200'
                  : currentLevelData.challenge.type === 'c'
                  ? 'border-blue-300'
                  : currentLevelData.challenge.type === 'cpp'
                  ? 'border-indigo-300'
                  : 'border-yellow-200'
              }`}
              disabled={showResult}
            />
            
            {!showResult && (
              <Button 
                onClick={onSubmitAnswer}
                disabled={!userAnswer.trim()}
                className={
                  currentLevelData.challenge.type === 'python'
                    ? "w-full bg-gradient-to-r from-blue-500 to-yellow-400 hover:from-blue-600 hover:to-yellow-500"
                    : currentLevelData.challenge.type === 'sql'
                    ? "w-full bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500"
                    : currentLevelData.challenge.type === 'php'
                    ? "w-full bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500"
                    : currentLevelData.challenge.type === 'java'
                    ? "w-full bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500"
                    : currentLevelData.challenge.type === 'c'
                    ? "w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                    : currentLevelData.challenge.type === 'cpp'
                    ? "w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800"
                    : "w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500"
                }
              >
                Vérifier ma réponse
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className={`border-2 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {isCorrect ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                  <h3 className={`text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect 
                      ? `Parfait ! Tu maîtrises ${currentLevelData.challenge.type === 'python' ? 'Python' : 
                                                currentLevelData.challenge.type === 'sql' ? 'SQL' : 
                                                currentLevelData.challenge.type === 'php' ? 'PHP' :
                                                currentLevelData.challenge.type === 'java' ? 'Java' : 
                                                currentLevelData.challenge.type === 'c' ? 'C' :
                                                currentLevelData.challenge.type === 'cpp' ? 'C++' : 'JavaScript'} !` 
                      : 'Pas tout à fait...'
                    }
                  </h3>
                </div>
                <p className="mb-4">
                  <strong>Réponse attendue :</strong> {currentLevelData.challenge.correctAnswer}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Explication :</strong> {currentLevelData.challenge.explanation}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
