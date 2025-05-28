
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Trophy } from 'lucide-react';
import { GameLevel } from '@/types/codingChallenge';

interface GameSuccessProps {
  currentLevel: number | null;
  currentLevelData: GameLevel | undefined;
  onBackToMenu: () => void;
}

export const GameSuccess: React.FC<GameSuccessProps> = ({ 
  currentLevel, 
  currentLevelData, 
  onBackToMenu 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto p-6 text-center"
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
      >
        <Trophy className="h-24 w-24 text-yellow-500 mx-auto mb-4" />
      </motion.div>
      <h2 className="text-3xl font-bold text-green-600 mb-4">Excellent ! 🎉</h2>
      <p className="text-lg mb-6">
        Tu maîtrises {currentLevelData?.challenge.type === 'python' ? 'Python' : 
                    currentLevelData?.challenge.type === 'sql' ? 'SQL' : 
                    currentLevelData?.challenge.type === 'php' ? 'PHP' :
                    currentLevelData?.challenge.type === 'java' ? 'Java' : 
                    currentLevelData?.challenge.type === 'c' ? 'C' :
                    currentLevelData?.challenge.type === 'cpp' ? 'C++' : 'JavaScript'} niveau {currentLevel} !
      </p>
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="text-6xl mb-6">
          {currentLevelData?.challenge.type === 'python' ? '🐍' : 
           currentLevelData?.challenge.type === 'sql' ? '🗃️' : 
           currentLevelData?.challenge.type === 'php' ? '🐘' :
           currentLevelData?.challenge.type === 'java' ? '☕' : 
           currentLevelData?.challenge.type === 'c' ? '🔥' :
           currentLevelData?.challenge.type === 'cpp' ? '🚀' : '🌐'}
        </div>
      </motion.div>
      <Button onClick={onBackToMenu} size="lg" className={
        currentLevelData?.challenge.type === 'python' 
          ? "bg-gradient-to-r from-blue-500 to-yellow-400 hover:from-blue-600 hover:to-yellow-500"
          : currentLevelData?.challenge.type === 'sql'
          ? "bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500"
          : currentLevelData?.challenge.type === 'php'
          ? "bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500"
          : currentLevelData?.challenge.type === 'java'
          ? "bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500"
          : currentLevelData?.challenge.type === 'c'
          ? "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
          : currentLevelData?.challenge.type === 'cpp'
          ? "bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800"
          : "bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500"
      }>
        Continuer vers le menu
      </Button>
    </motion.div>
  );
};
