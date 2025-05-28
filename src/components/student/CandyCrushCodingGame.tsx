
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Lock, Play, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Challenge {
  id: number;
  title: string;
  description: string;
  code: string;
  correctAnswer: string;
  explanation: string;
  type: 'sql' | 'python' | 'javascript';
}

interface GameLevel {
  id: number;
  name: string;
  challenge: Challenge;
  unlocked: boolean;
  completed: boolean;
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Erreur SQL Basique",
    description: "Trouve et corrige l'erreur dans cette requête SQL :",
    code: `SELECT nom, age 
FROM utilisateurs 
WERE age > 18;`,
    correctAnswer: "WHERE",
    explanation: "Il faut utiliser 'WHERE' et non 'WERE' pour filtrer les résultats.",
    type: 'sql'
  },
  {
    id: 2,
    title: "Bug Python Simple",
    description: "Corrige cette fonction Python :",
    code: `def calculer_moyenne(notes):
    total = sum(notes)
    return total / len(notes)

moyenne = calculer_moyenne([])
print(moyenne)`,
    correctAnswer: "if len(notes) == 0: return 0",
    explanation: "Il faut vérifier que la liste n'est pas vide pour éviter une division par zéro.",
    type: 'python'
  },
  {
    id: 3,
    title: "JavaScript Débutant",
    description: "Corrige cette fonction JavaScript :",
    code: `function additionner(a, b) {
    return a + b
}

console.log(additionner(5, "3"));`,
    correctAnswer: "parseInt(b) ou Number(b)",
    explanation: "Il faut convertir les paramètres en nombres pour éviter la concaténation.",
    type: 'javascript'
  },
  {
    id: 4,
    title: "SQL Intermédiaire",
    description: "Optimise cette requête SQL :",
    code: `SELECT * FROM produits 
WHERE prix > 100 
AND prix < 500 
AND categorie = 'electronique';`,
    correctAnswer: "BETWEEN 100 AND 500",
    explanation: "Utiliser BETWEEN est plus lisible et efficace pour les plages de valeurs.",
    type: 'sql'
  },
  {
    id: 5,
    title: "Python Avancé",
    description: "Optimise cette boucle Python :",
    code: `nombres = [1, 2, 3, 4, 5]
carres = []
for n in nombres:
    carres.append(n * n)`,
    correctAnswer: "[n*n for n in nombres]",
    explanation: "Une list comprehension est plus pythonique et plus rapide.",
    type: 'python'
  }
];

export const CandyCrushCodingGame = () => {
  const [levels, setLevels] = useState<GameLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameMode, setGameMode] = useState<'menu' | 'playing' | 'success'>('menu');

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

  const getLevelColor = (level: GameLevel) => {
    if (level.completed) return 'bg-green-500 hover:bg-green-600';
    if (level.unlocked) return 'bg-blue-500 hover:bg-blue-600';
    return 'bg-gray-400';
  };

  const getLevelIcon = (level: GameLevel) => {
    if (level.completed) return <CheckCircle className="h-6 w-6" />;
    if (level.unlocked) return <Play className="h-6 w-6" />;
    return <Lock className="h-6 w-6" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sql': return 'bg-purple-100 text-purple-800';
      case 'python': return 'bg-blue-100 text-blue-800';
      case 'javascript': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (gameMode === 'menu') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto p-6"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Code Crush
            </h1>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </motion.div>
          <p className="text-lg text-muted-foreground">
            Résous des défis de code pour débloquer les niveaux suivants !
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
                  level.unlocked ? 'hover:shadow-lg' : 'opacity-60'
                }`}
                onClick={() => handleLevelClick(level.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white ${getLevelColor(level)}`}>
                    {getLevelIcon(level)}
                  </div>
                  <h3 className="font-semibold mb-2">{level.name}</h3>
                  <Badge className={getTypeColor(level.challenge.type)}>
                    {level.challenge.type.toUpperCase()}
                  </Badge>
                  {level.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-2"
                    >
                      <Star className="h-5 w-5 text-yellow-500 mx-auto" />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (gameMode === 'success') {
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
        <h2 className="text-3xl font-bold text-green-600 mb-4">Bravo ! 🎉</h2>
        <p className="text-lg mb-6">Tu as réussi le niveau {currentLevel} !</p>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="text-6xl mb-6">🌟</div>
        </motion.div>
        <Button onClick={handleBackToMenu} size="lg">
          Continuer vers le menu
        </Button>
      </motion.div>
    );
  }

  // Playing mode
  const currentLevelData = levels.find(l => l.id === currentLevel);
  if (!currentLevelData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="mb-6">
        <Button variant="outline" onClick={handleBackToMenu} className="mb-4">
          ← Retour au menu
        </Button>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold">{currentLevelData.name}</h2>
          <Badge className={getTypeColor(currentLevelData.challenge.type)}>
            {currentLevelData.challenge.type.toUpperCase()}
          </Badge>
        </div>
        <h3 className="text-xl font-semibold text-blue-600">
          {currentLevelData.challenge.title}
        </h3>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <p className="mb-4 text-lg">{currentLevelData.challenge.description}</p>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap mb-4">
            {currentLevelData.challenge.code}
          </div>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium">Ta réponse :</label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Écris ta correction ici..."
              className="w-full p-3 border rounded-lg"
              disabled={showResult}
            />
            
            {!showResult && (
              <Button 
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim()}
                className="w-full"
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
                    {isCorrect ? 'Correct !' : 'Pas tout à fait...'}
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
