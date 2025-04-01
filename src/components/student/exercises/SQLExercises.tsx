
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Info, Lightbulb } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { MonacoEditorWrapper } from "@/components/CodeEditor/MonacoEditorWrapper";
import { toast } from 'sonner';
import { FormattedMessage } from '@/components/ai-assistant/FormattedMessage';

interface SQLExercise {
  id: string;
  title: string;
  concept: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  starter_code: string;
  solution: string;
  points: number;
  hint?: string;
  feedback?: string;
}

const sqlExercises: SQLExercise[] = [
  {
    id: "sql-1",
    title: "Sélection Basique",
    concept: "SELECT",
    description: "Afficher tous les étudiants de la table `etudiants` triés par nom.",
    difficulty: "Beginner",
    starter_code: `-- Écrivez votre requête SQL ici:

`,
    solution: `SELECT * FROM etudiants ORDER BY nom;`,
    feedback: "✅ Bonne pratique :\n- Utilisation de `ORDER BY` pour le tri\n- Sélection explicite avec `*` (à éviter en production)",
    points: 30,
    hint: "Utilisez ORDER BY pour trier les résultats."
  },
  {
    id: "sql-2",
    title: "Filtrage avec WHERE",
    concept: "WHERE",
    description: "Trouver les étudiants nés après 2005.",
    difficulty: "Beginner",
    starter_code: `-- Écrivez votre requête SQL ici:

`,
    solution: `SELECT nom, prenom 
FROM etudiants 
WHERE annee_naissance > 2005;`,
    feedback: "⚠️ Amélioration possible :\n```sql\nWHERE date_naissance > '2005-12-31' -- Si le champ est DATE\n```",
    points: 35,
    hint: "Utilisez la clause WHERE pour filtrer les résultats selon un critère."
  },
  {
    id: "sql-3",
    title: "Agrégation",
    concept: "GROUP BY",
    description: "Calculer la moyenne des notes par matière.",
    difficulty: "Intermediate",
    starter_code: `-- Écrivez votre requête SQL ici:

`,
    solution: `SELECT matiere, AVG(note) AS moyenne
FROM notes
GROUP BY matiere;`,
    feedback: "✅ Bonnes pratiques :\n- Alias clair avec `AS`\n- Agrégation propre avec `GROUP BY`",
    points: 40,
    hint: "Utilisez la fonction AVG() pour calculer la moyenne et GROUP BY pour regrouper par matière."
  },
  {
    id: "sql-4",
    title: "Jointure",
    concept: "JOIN",
    description: "Afficher les étudiants avec leurs professeurs principaux.",
    difficulty: "Intermediate",
    starter_code: `-- Écrivez votre requête SQL ici:

`,
    solution: `SELECT e.nom, p.nom AS professeur
FROM etudiants e
INNER JOIN professeurs p ON e.prof_id = p.id;`,
    feedback: "⚠️ Attention aux :\n- Jointures multiples non-indexées\n- Choix entre INNER/LEFT JOIN",
    points: 45,
    hint: "Utilisez INNER JOIN pour lier les tables etudiants et professeurs en utilisant la clé étrangère."
  },
  {
    id: "sql-5",
    title: "Sous-requête",
    concept: "Subqueries",
    description: "Trouver les étudiants avec une note supérieure à la moyenne.",
    difficulty: "Advanced",
    starter_code: `-- Écrivez votre requête SQL ici:

`,
    solution: `SELECT nom 
FROM etudiants
WHERE id IN (
    SELECT etudiant_id 
    FROM notes 
    WHERE note > (SELECT AVG(note) FROM notes)
);`,
    feedback: "💡 Alternative optimisée :\n```sql\nWITH moyenne_globale AS (\n    SELECT AVG(note) AS moyenne FROM notes\n)\nSELECT e.nom \nFROM etudiants e\nJOIN notes n ON e.id = n.etudiant_id\nCROSS JOIN moyenne_globale\nWHERE n.note > moyenne_globale.moyenne;\n```",
    points: 50,
    hint: "Utilisez une sous-requête pour calculer la moyenne globale, puis une autre sous-requête pour trouver les étudiants concernés."
  },
  {
    id: "sql-6",
    title: "Gestion de Données",
    concept: "INSERT, UPDATE, DELETE",
    description: "Effectuez les trois opérations suivantes :\n1. Ajouter un nouvel étudiant\n2. Modifier son adresse\n3. Supprimer les étudiants sans notes",
    difficulty: "Advanced",
    starter_code: `-- Écrivez votre requête SQL ici:
-- 1. Insertion

-- 2. Mise à jour

-- 3. Suppression

`,
    solution: `-- 1. Insertion
INSERT INTO etudiants 
(nom, prenom, email) 
VALUES 
('Martin', 'Luc', 'luc.martin@example.com');

-- 2. Mise à jour
UPDATE etudiants
SET adresse = '12 Rue des Écoles, Paris'
WHERE email = 'luc.martin@example.com';

-- 3. Suppression
DELETE FROM etudiants
WHERE id NOT IN (SELECT DISTINCT etudiant_id FROM notes);`,
    feedback: "⚠️ Sécurité :\n- Toujours vérifier les WHERE avant DELETE/UPDATE\n- Utiliser des transactions si possible",
    points: 60,
    hint: "N'oubliez pas d'utiliser WHERE pour les opérations UPDATE et DELETE afin de cibler les bonnes lignes."
  }
];

export const SQLExercises: React.FC = () => {
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string>("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const activeExercise = sqlExercises.find(ex => ex.id === activeExerciseId);

  const handleSelectExercise = (exerciseId: string) => {
    const exercise = sqlExercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setActiveExerciseId(exerciseId);
      setUserCode(exercise.starter_code);
      setShowHint(false);
      setShowSolution(false);
      setShowFeedback(false);
    }
  };

  const handleCodeChange = (code: string | undefined) => {
    if (code !== undefined) {
      setUserCode(code);
    }
  };

  const handleSubmit = () => {
    if (!activeExercise) return;

    // Normalize code by removing extra spaces and newlines for comparison
    const normalizeSQL = (sql: string) => {
      return sql.replace(/\s+/g, ' ').trim().toLowerCase();
    };
    
    const normalizedUserCode = normalizeSQL(userCode);
    const normalizedSolution = normalizeSQL(activeExercise.solution);
    
    // Calculate similarity score (very simple implementation)
    const similarity = calculateSimilarity(normalizedUserCode, normalizedSolution);
    
    if (similarity > 0.7) {
      // Code is similar enough to be considered correct
      if (!completedExercises.includes(activeExercise.id)) {
        setCompletedExercises([...completedExercises, activeExercise.id]);
        setUserPoints(userPoints + activeExercise.points);
        toast.success(`🎉 Bravo ! +${activeExercise.points} points !`);
      } else {
        toast.success("Exercice déjà complété !");
      }
      setShowFeedback(true);
    } else {
      toast.error("Votre solution n'est pas correcte. Essayez encore !");
    }
  };

  // Simple string similarity calculation
  const calculateSimilarity = (a: string, b: string): number => {
    if (a === b) return 1.0;
    if (a.length === 0 || b.length === 0) return 0.0;
    
    // This is a simplified version - in a real app, use a proper algorithm
    const commonWords = a.split(' ').filter(word => b.includes(word)).length;
    const totalWords = new Set([...a.split(' '), ...b.split(' ')]).size;
    return commonWords / totalWords;
  };

  const getDifficultyBadgeClass = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const exerciseProgress = (completedExercises.length / sqlExercises.length) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Exercices SQL</h2>
            <p className="text-gray-600">Maîtrisez les requêtes SQL avec des exercices pratiques</p>
          </div>
          <div>
            <Badge className="text-lg px-3 py-1 bg-blue-500">
              {userPoints} points
            </Badge>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Progression</h3>
          <div className="flex items-center gap-3">
            <Progress value={exerciseProgress} className="h-2 flex-grow" />
            <span className="text-sm font-medium">{Math.round(exerciseProgress)}%</span>
          </div>
        </div>
        
        <Alert className="bg-blue-50 border-blue-200 mb-4">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Ces exercices simulent l'utilisation d'une base de données. Dans un environnement réel, vous exécuteriez ces requêtes sur un serveur SQL fonctionnel.
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            <h3 className="text-lg font-semibold">Liste des exercices</h3>
            <div className="space-y-3">
              {sqlExercises.map((exercise) => (
                <div 
                  key={exercise.id}
                  className={`p-3 rounded-md cursor-pointer border transition-all ${
                    activeExerciseId === exercise.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleSelectExercise(exercise.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{exercise.title}</h4>
                      <p className="text-sm text-gray-600">{exercise.concept}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyBadgeClass(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                      {completedExercises.includes(exercise.id) && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          {activeExercise ? (
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold">{activeExercise.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getDifficultyBadgeClass(activeExercise.difficulty)}>
                    {activeExercise.difficulty}
                  </Badge>
                  <Badge variant="outline">{activeExercise.concept}</Badge>
                  <Badge className="bg-purple-100 text-purple-800">
                    {activeExercise.points} points
                  </Badge>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="font-medium mb-2">Description:</h4>
                <p className="text-gray-700 mb-4 whitespace-pre-line">{activeExercise.description}</p>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowHint(!showHint)}
                    className="text-sm"
                  >
                    <Lightbulb className="h-4 w-4 mr-1" />
                    {showHint ? "Cacher l'indice" : "Afficher l'indice"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowSolution(!showSolution)}
                    className="text-sm"
                  >
                    {showSolution ? "Cacher la solution" : "Voir la solution"}
                  </Button>
                </div>
                
                {showHint && activeExercise.hint && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Indice:</strong> {activeExercise.hint}
                    </p>
                  </div>
                )}
                
                {showSolution && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="font-medium text-sm mb-2">Solution:</p>
                    <div className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                      <FormattedMessage content={`\`\`\`sql\n${activeExercise.solution}\n\`\`\``} />
                    </div>
                  </div>
                )}
                
                {showFeedback && activeExercise.feedback && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="font-medium text-sm mb-2">Feedback:</p>
                    <div className="text-sm text-gray-800 whitespace-pre-line">
                      <FormattedMessage content={activeExercise.feedback} />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Votre requête SQL:</h4>
                <div className="border rounded-md overflow-hidden">
                  <div className="h-[300px]">
                    <MonacoEditorWrapper
                      language="javascript" // Utilisons javascript pour la coloration SQL
                      code={userCode}
                      onChange={handleCodeChange}
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleSubmit}>
                    Soumettre
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-medium text-gray-600 mb-2">Sélectionnez un exercice</h3>
                <p className="text-gray-500">Choisissez un exercice dans la liste de gauche pour commencer</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
