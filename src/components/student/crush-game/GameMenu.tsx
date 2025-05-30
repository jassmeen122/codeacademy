
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Lock, Code, CheckCircle } from 'lucide-react';
import { GameLevel } from '@/types/codingChallenge';
import { PythonLogo, SQLLogo, PHPLogo, JavaLogo, JavaScriptLogo, CLogo, CPPLogo } from './LanguageLogos';

interface GameMenuProps {
  levels: GameLevel[];
  onLevelClick: (levelId: number) => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({ levels, onLevelClick }) => {
  const getLevelColor = (level: GameLevel) => {
    if (level.completed) return 'bg-green-500 hover:bg-green-600';
    if (level.unlocked) {
      if (level.challenge.type === 'python') {
        return 'bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500';
      } else if (level.challenge.type === 'sql') {
        return 'bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500';
      } else if (level.challenge.type === 'php') {
        return 'bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500';
      } else if (level.challenge.type === 'java') {
        return 'bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500';
      } else if (level.challenge.type === 'javascript') {
        return 'bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500';
      } else if (level.challenge.type === 'c') {
        return 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900';
      } else if (level.challenge.type === 'cpp') {
        return 'bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800';
      }
    }
    return 'bg-gray-400';
  };

  const getLevelIcon = (level: GameLevel) => {
    if (level.completed) return <CheckCircle className="h-6 w-6" />;
    if (level.unlocked) return <Code className="h-6 w-6" />;
    return <Lock className="h-6 w-6" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'python': return 'bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 border-blue-200';
      case 'sql': return 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200';
      case 'php': return 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-200';
      case 'java': return 'bg-gradient-to-r from-red-100 to-orange-100 text-red-800 border-red-200';
      case 'javascript': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-200';
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl mx-auto p-6"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <Trophy className="h-8 w-8 text-green-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Code Crush
          </h1>
          <Trophy className="h-8 w-8 text-green-500" />
        </motion.div>
        <div className="flex justify-center gap-6 mb-4 flex-wrap">
          <PythonLogo />
          <SQLLogo />
          <PHPLogo />
          <JavaLogo />
          <JavaScriptLogo />
          <CLogo />
          <CPPLogo />
        </div>
        <p className="text-lg text-muted-foreground">
          Résous des défis Python, SQL, PHP, Java, JavaScript, C et C++ avancés pour débloquer les niveaux suivants !
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {levels.map((level, index) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={level.unlocked ? { scale: 1.05 } : {}}
            whileTap={level.unlocked ? { scale: 0.95 } : {}}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 ${
                level.unlocked ? 'hover:shadow-lg border-blue-200' : 'opacity-60'
              }`}
              onClick={() => onLevelClick(level.id)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white ${getLevelColor(level)}`}>
                  {getLevelIcon(level)}
                </div>
                <h3 className="font-semibold mb-2">{level.name}</h3>
                <Badge className={getTypeColor(level.challenge.type)}>
                  {getTypeBadgeText(level.challenge.type)}
                </Badge>
                {level.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-2"
                  >
                    <Star className="h-5 w-5 text-green-500 mx-auto" />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center mt-8 text-sm text-muted-foreground">
        <p>🐍 Défis Python Avancés • Closures, Métaclasses, Méthodes Magiques</p>
        <p>🗃️ Défis SQL Experts • Récursivité, Fonctions Fenêtre, Optimisation</p>
        <p>🐘 Défis PHP Experts • Type Juggling, Méthodes Magiques, Références</p>
        <p>☕ Défis Java Experts • Final, Héritage, Threads, String Pool</p>
        <p>🌐 Défis JavaScript Experts • NaN, Closures, ASI, Références</p>
        <p>🔥 Défis C Experts • Pointeurs, Chaînes Constantes, Double Pointeurs</p>
        <p>🚀 Défis C++ Experts • Constructeurs, rvalue, Surcharge</p>
      </div>
    </motion.div>
  );
};
