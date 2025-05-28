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
  type: 'sql' | 'python' | 'javascript' | 'php';
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

const SQLLogo = () => (
  <div className="inline-flex items-center gap-2">
    <div className="relative w-8 h-8">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-md"></div>
      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">SQL</div>
    </div>
    <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">SQL</span>
  </div>
);

const PHPLogo = () => (
  <div className="inline-flex items-center gap-2">
    <div className="relative w-8 h-8">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-md"></div>
      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">PHP</div>
    </div>
    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">PHP</span>
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
  },
  {
    id: 11,
    title: "Comparaison NULL",
    description: "Quelle est la sortie de cette requête et pourquoi ?",
    code: `SELECT NULL = NULL;`,
    correctAnswer: "NULL (pas TRUE)",
    explanation: "En SQL, NULL représente l'absence de valeur. Comparer NULL avec quoi que ce soit (même NULL) retourne NULL, pas TRUE. Il faut utiliser IS NULL pour tester la nullité.",
    type: 'sql'
  },
  {
    id: 12,
    title: "Requête Récursive",
    description: "Que fait cette requête récursive ?",
    code: `WITH RECURSIVE cnt(x) AS (
  SELECT 1
  UNION ALL
  SELECT x + 1 FROM cnt WHERE x < 5
)
SELECT * FROM cnt;`,
    correctAnswer: "Génère les nombres 1 à 5",
    explanation: "CTE récursive : commence par SELECT 1, puis ajoute x+1 tant que x<5. Résultat : 1, 2, 3, 4, 5. La récursivité s'arrête quand la condition WHERE devient fausse.",
    type: 'sql'
  },
  {
    id: 13,
    title: "LEFT JOIN vs FULL OUTER JOIN",
    description: "Quelle est la différence entre LEFT JOIN et FULL OUTER JOIN ?",
    code: `-- LEFT JOIN : garde toutes les lignes de la table de gauche
-- FULL OUTER JOIN : garde toutes les lignes des deux tables
SELECT * FROM table1 LEFT JOIN table2 ON ...
-- vs
SELECT * FROM table1 FULL OUTER JOIN table2 ON ...`,
    correctAnswer: "FULL garde toutes les lignes",
    explanation: "LEFT JOIN garde toutes les lignes de la table de gauche + les correspondances. FULL OUTER JOIN garde toutes les lignes des deux tables, même sans correspondance (avec NULL).",
    type: 'sql'
  },
  {
    id: 14,
    title: "Fonction Fenêtre OVER",
    description: "Que fait cette requête ?",
    code: `SELECT department_id, AVG(salary) OVER (PARTITION BY department_id)
FROM employees;`,
    correctAnswer: "Moyenne par département",
    explanation: "OVER (PARTITION BY ...) calcule AVG(salary) pour chaque département séparément, tout en gardant toutes les lignes individuelles. Différent de GROUP BY qui agrège les lignes.",
    type: 'sql'
  },
  {
    id: 15,
    title: "Contrainte CHECK",
    description: "Que signifie cette contrainte ?",
    code: `CHECK (salary > 0 AND salary < 99999)`,
    correctAnswer: "Valide les valeurs de salary",
    explanation: "CHECK valide que salary est entre 0 et 99999. Peut être contournée en désactivant les contraintes ou avec des privilèges admin. NULL passe toujours les contraintes CHECK.",
    type: 'sql'
  },
  {
    id: 16,
    title: "Transaction et Crash",
    description: "Que se passe-t-il ici ?",
    code: `BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
-- crash du système ici
COMMIT;`,
    correctAnswer: "Transaction annulée (ROLLBACK)",
    explanation: "Si le système crash avant COMMIT, la transaction est automatiquement annulée (ROLLBACK). En autocommit, chaque instruction est commitée immédiatement.",
    type: 'sql'
  },
  {
    id: 17,
    title: "Injection SQL",
    description: "Pourquoi cette requête est-elle dangereuse ?",
    code: `SELECT * FROM users WHERE name = 'John' OR 1=1;`,
    correctAnswer: "Injection SQL - retourne tout",
    explanation: "OR 1=1 est toujours vrai, donc retourne tous les utilisateurs. Injection SQL classique. Solution : requêtes préparées avec paramètres liés (prepared statements).",
    type: 'sql'
  },
  {
    id: 18,
    title: "EXISTS vs IN",
    description: "Que fait cette requête ?",
    code: `SELECT * FROM orders o
WHERE EXISTS (
  SELECT 1 FROM customers c WHERE c.id = o.customer_id AND c.status = 'VIP'
);`,
    correctAnswer: "Commandes de clients VIP",
    explanation: "EXISTS teste l'existence d'au moins une ligne. Plus efficace que IN pour les grosses tables. EXISTS s'arrête dès qu'une ligne est trouvée, IN doit tout évaluer.",
    type: 'sql'
  },
  {
    id: 19,
    title: "COUNT et NULL",
    description: "Quelle est la différence ?",
    code: `SELECT COUNT(*), COUNT(column_name) FROM table_name;`,
    correctAnswer: "COUNT(*) compte tout, COUNT(col) ignore NULL",
    explanation: "COUNT(*) compte toutes les lignes. COUNT(column_name) ignore les valeurs NULL dans cette colonne. Important pour les statistiques avec des données manquantes.",
    type: 'sql'
  },
  {
    id: 20,
    title: "Vue Matérialisée",
    description: "Qu'est-ce qu'une vue matérialisée ?",
    code: `CREATE MATERIALIZED VIEW sales_summary AS
SELECT region, SUM(amount) as total
FROM sales GROUP BY region;

-- vs vue normale :
CREATE VIEW sales_view AS SELECT ...`,
    correctAnswer: "Vue stockée physiquement",
    explanation: "Vue matérialisée : résultats stockés physiquement, rapide à lire mais doit être rafraîchie. Vue normale : recalculée à chaque accès, toujours à jour mais plus lente.",
    type: 'sql'
  },
  {
    id: 21,
    title: "Comparaisons PHP Bizarres",
    description: "Que renvoie ce code, et pourquoi ?",
    code: `$a = "0";
$b = 0;
$c = false;

var_dump($a == $b);
var_dump($b == $c);
var_dump($a == $c);`,
    correctAnswer: "true, true, false",
    explanation: "PHP fait du type juggling : '0' == 0 (string vers int), 0 == false (int vers bool), mais '0' != false car la conversion directe string-bool donne true pour toute string non-vide.",
    type: 'php'
  },
  {
    id: 22,
    title: "Destructeur et Variables Statiques",
    description: "Quelle est la sortie, et pourquoi ?",
    code: `class A {
    public function __destruct() {
        echo "Bye";
    }
}

function test() {
    static $a = new A();
}

test();
echo "End";`,
    correctAnswer: "End puis Bye",
    explanation: "Les variables statiques persistent pendant toute l'exécution du script. Le destructeur n'est appelé qu'à la fin du script, après 'End'. L'objet reste en mémoire car il est statique.",
    type: 'php'
  },
  {
    id: 23,
    title: "Retour par Référence Dangereux",
    description: "Pourquoi cette fonction ne renvoie pas ce que l'on attend ?",
    code: `function &getValue() {
    $value = 42;
    return $value;
}

$a = &getValue();`,
    correctAnswer: "Référence vers variable locale détruite",
    explanation: "Retour par référence d'une variable locale : $value est détruite à la fin de la fonction, laissant $a avec une référence invalide. Cause un avertissement et un comportement imprévisible.",
    type: 'php'
  },
  {
    id: 24,
    title: "Modification de String par Index",
    description: "Que se passe-t-il ici ?",
    code: `$a = '1';
$a[1] = '2';
echo $a;`,
    correctAnswer: "12",
    explanation: "PHP étend automatiquement la string quand on assigne à un index. $a[0]='1' existe, $a[1]='2' est ajouté. Résultat : '12'. Comportement unique à PHP parmi les langages populaires.",
    type: 'php'
  },
  {
    id: 25,
    title: "Méthodes Magiques PHP",
    description: "Que fait réellement cette classe ?",
    code: `class Magic {
    public function __call($name, $args) {
        echo "Call $name";
    }
    public function __get($name) {
        echo "Get $name";
    }
    public function __set($name, $value) {
        echo "Set $name = $value";
    }
}

$magic = new Magic();
$magic->nonExistentMethod(1, 2);
echo $magic->prop;
$magic->other = 10;`,
    correctAnswer: "Call nonExistentMethod, Get prop, Set other = 10",
    explanation: "__call() intercepte les méthodes inexistantes, __get() les propriétés lues, __set() les assignations. Ordre d'exécution : call, get, set. Ces méthodes permettent la programmation dynamique en PHP.",
    type: 'php'
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
    if (level.unlocked) {
      if (level.challenge.type === 'python') {
        return 'bg-gradient-to-r from-blue-500 to-yellow-400 hover:from-blue-600 hover:to-yellow-500';
      } else if (level.challenge.type === 'sql') {
        return 'bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500';
      } else if (level.challenge.type === 'php') {
        return 'bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500';
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
      case 'python': return 'bg-gradient-to-r from-blue-100 to-yellow-100 text-blue-800 border-blue-200';
      case 'sql': return 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200';
      case 'php': return 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeText = (type: string) => {
    switch (type) {
      case 'python': return 'PYTHON';
      case 'sql': return 'SQL';
      case 'php': return 'PHP';
      default: return type.toUpperCase();
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
          <div className="flex justify-center gap-6 mb-4">
            <PythonLogo />
            <SQLLogo />
            <PHPLogo />
          </div>
          <p className="text-lg text-muted-foreground">
            Résous des défis Python, SQL et PHP avancés pour débloquer les niveaux suivants !
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
                    {getTypeBadgeText(level.challenge.type)}
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
          <p>🗃️ Défis SQL Experts • Récursivité, Fonctions Fenêtre, Optimisation</p>
          <p>🐘 Défis PHP Experts • Type Juggling, Méthodes Magiques, Références</p>
        </div>
      </motion.div>
    );
  }

  if (gameMode === 'success') {
    const currentLevelData = levels.find(l => l.id === currentLevel);
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
                      currentLevelData?.challenge.type === 'sql' ? 'SQL' : 'PHP'} niveau {currentLevel} !
        </p>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="text-6xl mb-6">
            {currentLevelData?.challenge.type === 'python' ? '🐍' : 
             currentLevelData?.challenge.type === 'sql' ? '🗃️' : '🐘'}
          </div>
        </motion.div>
        <Button onClick={handleBackToMenu} size="lg" className={
          currentLevelData?.challenge.type === 'python' 
            ? "bg-gradient-to-r from-blue-500 to-yellow-400 hover:from-blue-600 hover:to-yellow-500"
            : currentLevelData?.challenge.type === 'sql'
            ? "bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500"
            : "bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500"
        }>
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
            ) : (
              <>
                <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                <div className="w-4 h-4 bg-indigo-400 rounded-sm"></div>
              </>
            )}
          </div>
        </div>
        <h3 className={`text-xl font-semibold ${
          currentLevelData.challenge.type === 'python' ? 'text-blue-600' : 
          currentLevelData.challenge.type === 'sql' ? 'text-orange-600' : 'text-purple-600'
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
                  : 'border-purple-200'
              }`}
              disabled={showResult}
            />
            
            {!showResult && (
              <Button 
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim()}
                className={
                  currentLevelData.challenge.type === 'python'
                    ? "w-full bg-gradient-to-r from-blue-500 to-yellow-400 hover:from-blue-600 hover:to-yellow-500"
                    : currentLevelData.challenge.type === 'sql'
                    ? "w-full bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500"
                    : "w-full bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500"
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
                                                currentLevelData.challenge.type === 'sql' ? 'SQL' : 'PHP'} !` 
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
