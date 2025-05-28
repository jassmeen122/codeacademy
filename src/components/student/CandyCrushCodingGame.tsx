
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Lock, Play, CheckCircle, XCircle, Code } from 'lucide-react';
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

const PythonLogo = () => (
  <div className="inline-flex items-center gap-2">
    <div className="relative w-8 h-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-md transform rotate-3"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md transform -rotate-3 scale-90"></div>
      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">Py</div>
    </div>
    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">Python</span>
  </div>
);

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Tuple et Mutabilité",
    description: "Que renvoie ce code et pourquoi ?",
    code: `a = (1, 2, [3, 4])
a[2] += [5]
print(a)`,
    correctAnswer: "TypeError mais a est modifié",
    explanation: "Le tuple contient une liste mutable. L'opération += modifie la liste mais lève une TypeError car on essaie de réassigner dans un tuple.",
    type: 'python'
  },
  {
    id: 2,
    title: "Closure et Variable Locale",
    description: "Quel est le problème ici ?",
    code: `def make_counter():
    count = 0
    def counter():
        count += 1
        return count
    return counter`,
    correctAnswer: "UnboundLocalError",
    explanation: "L'opérateur += tente de lire count avant de l'assigner, mais Python considère count comme une variable locale non initialisée. Il faut utiliser 'nonlocal count'.",
    type: 'python'
  },
  {
    id: 3,
    title: "Argument par Défaut Mutable",
    description: "Que fait cette fonction exactement ?",
    code: `def func(x=[]):
    x.append(1)
    return x

print(func())
print(func())
print(func())`,
    correctAnswer: "Accumule les valeurs",
    explanation: "L'argument par défaut [] est créé une seule fois. Chaque appel modifie la même liste, causant une accumulation des valeurs : [1], [1,1], [1,1,1].",
    type: 'python'
  },
  {
    id: 4,
    title: "Paramètres Positional-Only",
    description: "Que fait ce code ?",
    code: `def f(x, y, /, z):
    return x + y + z

# f(1, 2, 3)     # OK
# f(x=1, y=2, z=3)  # Erreur`,
    correctAnswer: "/ sépare positional-only",
    explanation: "Le symbole / indique que x et y doivent être passés uniquement par position, pas par nom. Seul z peut être passé par nom.",
    type: 'python'
  },
  {
    id: 5,
    title: "Slots et Attributs Dynamiques",
    description: "Peut-on modifier un objet défini avec __slots__ ?",
    code: `class Test:
    __slots__ = ['a']
    def __init__(self):
        self.a = 1

t = Test()
t.b = 2  # Que se passe-t-il ?`,
    correctAnswer: "AttributeError",
    explanation: "__slots__ limite les attributs aux noms spécifiés et empêche la création d'un __dict__. Ajouter un attribut non défini lève AttributeError.",
    type: 'python'
  },
  {
    id: 6,
    title: "Méthodes Magiques getattr",
    description: "Quelle est la sortie ?",
    code: `class A:
    def __init__(self):
        self.x = 1
    def __getattr__(self, name):
        return 42

a = A()
print(a.x)
print(a.y)`,
    correctAnswer: "1 puis 42",
    explanation: "__getattr__ n'est appelé que si l'attribut n'existe pas. a.x existe (1), a.y n'existe pas donc __getattr__ retourne 42.",
    type: 'python'
  },
  {
    id: 7,
    title: "Métaclasses et Type",
    description: "Quelle est la différence entre ces deux appels ?",
    code: `print(type(type))
print(type(object))`,
    correctAnswer: "<class 'type'> deux fois",
    explanation: "type est une métaclasse, instance d'elle-même. object est la classe de base, instance de type. Donc type(type) et type(object) retournent tous deux <class 'type'>.",
    type: 'python'
  },
  {
    id: 8,
    title: "Opérations Booléennes",
    description: "Que produit cette expression ?",
    code: `result = (True * False) ** True + False
print(result)
print(type(result))`,
    correctAnswer: "0 de type int",
    explanation: "True=1, False=0 en arithmétique. (1*0)**1 + 0 = 0**1 + 0 = 0 + 0 = 0. Le résultat est un int car les opérations arithmétiques convertissent les bool en int.",
    type: 'python'
  },
  {
    id: 9,
    title: "Références et Slicing",
    description: "Que se passe-t-il ici ?",
    code: `a = [1, 2, 3]
b = a
a[:] = []
print(b)`,
    correctAnswer: "[] - liste vide",
    explanation: "b et a référencent la même liste. a[:] = [] modifie le contenu de la liste existante (ne crée pas une nouvelle liste), donc b est aussi affecté.",
    type: 'python'
  },
  {
    id: 10,
    title: "Décorateur Mémoization",
    description: "Que fait ce décorateur ?",
    code: `def memoize(f):
    cache = {}
    def wrapper(*args):
        if args not in cache:
            cache[args] = f(*args)
        return cache[args]
    return wrapper`,
    correctAnswer: "Met en cache les résultats",
    explanation: "Mémoization : stocke les résultats des appels de fonction pour éviter les recalculs. Limitation : ne fonctionne qu'avec des arguments hashables (pas de listes/dict).",
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
    if (level.unlocked) return 'bg-gradient-to-r from-blue-500 to-yellow-400 hover:from-blue-600 hover:to-yellow-500';
    return 'bg-gray-400';
  };

  const getLevelIcon = (level: GameLevel) => {
    if (level.completed) return <CheckCircle className="h-6 w-6" />;
    if (level.unlocked) return <Code className="h-6 w-6" />;
    return <Lock className="h-6 w-6" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'python': return 'bg-gradient-to-r from-blue-100 to-yellow-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (gameMode === 'menu') {
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
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Code Crush
            </h1>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </motion.div>
          <div className="flex justify-center mb-4">
            <PythonLogo />
          </div>
          <p className="text-lg text-muted-foreground">
            Résous des défis Python avancés pour débloquer les niveaux suivants !
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
                onClick={() => handleLevelClick(level.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white ${getLevelColor(level)}`}>
                    {getLevelIcon(level)}
                  </div>
                  <h3 className="font-semibold mb-2">{level.name}</h3>
                  <Badge className={getTypeColor(level.challenge.type)}>
                    PYTHON
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
        
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>🐍 Défis Python Avancés • Closures, Métaclasses, Méthodes Magiques</p>
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
        <h2 className="text-3xl font-bold text-green-600 mb-4">Excellent ! 🎉</h2>
        <p className="text-lg mb-6">Tu maîtrises Python niveau {currentLevel} !</p>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="text-6xl mb-6">🐍</div>
        </motion.div>
        <Button onClick={handleBackToMenu} size="lg" className="bg-gradient-to-r from-blue-500 to-yellow-400 hover:from-blue-600 hover:to-yellow-500">
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
          <h2 className="text-2xl font-bold">Niveau {currentLevel}</h2>
          <Badge className={getTypeColor(currentLevelData.challenge.type)}>
            PYTHON
          </Badge>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-blue-600">
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
              className="w-full p-3 border rounded-lg border-blue-200 focus:border-blue-400"
              disabled={showResult}
            />
            
            {!showResult && (
              <Button 
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-yellow-400 hover:from-blue-600 hover:to-yellow-500"
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
                    {isCorrect ? 'Parfait ! Tu maîtrises Python !' : 'Pas tout à fait...'}
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
