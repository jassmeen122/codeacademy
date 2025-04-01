
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

interface PHPExercise {
  id: string;
  title: string;
  concept: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  starter_code: string;
  solution: string;
  points: number;
  hint?: string;
  test_cases?: string[];
  expected_output?: string;
}

const phpExercises: PHPExercise[] = [
  {
    id: "php-1",
    title: "Insertion d'un utilisateur",
    concept: "Bases de données",
    description: "Créez une connexion à la base de données testdb. Insérez un utilisateur avec nom et email en utilisant PDO.",
    difficulty: "Beginner",
    starter_code: `<?php
// Informations de connexion
$host = "localhost";
$dbname = "testdb";
$username = "root";
$password = "";

// Créez une connexion à la base de données avec PDO
// ...

// Insérez un utilisateur avec le nom 'Alice' et l'email 'alice@example.com'
// ...

echo "Résultat de l'opération";
?>`,
    solution: `<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=testdb", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("INSERT INTO users (nom, email) VALUES (:nom, :email)");
    $stmt->execute(['nom' => 'Alice', 'email' => 'alice@example.com']);

    echo "✅ Utilisateur ajouté avec succès !";
} catch (PDOException $e) {
    echo "🔴 Erreur : " . $e->getMessage();
}
?>`,
    points: 40,
    hint: "Utilisez la classe PDO pour créer une connexion. N'oubliez pas de mettre en place un try/catch pour gérer les erreurs potentielles."
  },
  {
    id: "php-2",
    title: "Affichage des utilisateurs",
    concept: "Bases de données",
    description: "Connectez-vous à testdb et récupérez tous les utilisateurs. Affichez-les sous forme de liste en utilisant MySQLi procédural.",
    difficulty: "Beginner",
    starter_code: `<?php
// Informations de connexion
$host = "localhost";
$dbname = "testdb";
$username = "root";
$password = "";

// Créez une connexion à la base de données avec MySQLi procédural
// ...

// Récupérez tous les utilisateurs
// ...

// Affichez les utilisateurs
// ...

// Fermez la connexion
// ...
?>`,
    solution: `<?php
$conn = mysqli_connect("localhost", "root", "", "testdb");

if (!$conn) {
    die("🔴 Connexion échouée: " . mysqli_connect_error());
}

$result = mysqli_query($conn, "SELECT * FROM users");
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        echo "👤 " . $row['nom'] . " - 📧 " . $row['email'] . "<br>";
    }
} else {
    echo "⚠️ Aucun utilisateur trouvé.";
}
mysqli_close($conn);
?>`,
    points: 40,
    hint: "Utilisez mysqli_connect() pour établir une connexion, puis mysqli_query() pour exécuter votre requête SELECT."
  },
  {
    id: "php-3",
    title: "Mise à jour des informations",
    concept: "Bases de données",
    description: "Modifiez l'email d'un utilisateur avec un id donné en utilisant MySQLi orienté objet.",
    difficulty: "Intermediate",
    starter_code: `<?php
// Informations de connexion
$host = "localhost";
$dbname = "testdb";
$username = "root";
$password = "";

// ID de l'utilisateur à mettre à jour
$id = 1;
$newEmail = "nouveau_email@example.com";

// Créez une connexion à la base de données avec MySQLi orienté objet
// ...

// Mettez à jour l'email de l'utilisateur
// ...

// Vérifiez si la mise à jour a réussi
// ...

// Fermez la connexion
// ...
?>`,
    solution: `<?php
$conn = new mysqli("localhost", "root", "", "testdb");

if ($conn->connect_error) {
    die("🔴 Connexion échouée: " . $conn->connect_error);
}

$id = 1;
$newEmail = "nouveau_email@example.com";

$stmt = $conn->prepare("UPDATE users SET email=? WHERE id=?");
$stmt->bind_param("si", $newEmail, $id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo "✅ Email mis à jour !";
} else {
    echo "⚠️ Aucun changement détecté.";
}
$stmt->close();
$conn->close();
?>`,
    points: 45,
    hint: "Utilisez la classe mysqli pour créer une connexion, puis préparez une requête avec bind_param() pour éviter les injections SQL."
  },
  {
    id: "php-4",
    title: "Suppression d'un utilisateur",
    concept: "Bases de données",
    description: "Supprimez un utilisateur avec un id donné en utilisant PDO et les transactions.",
    difficulty: "Advanced",
    starter_code: `<?php
// Informations de connexion
$host = "localhost";
$dbname = "testdb";
$username = "root";
$password = "";

// ID de l'utilisateur à supprimer
$id = 2;

// Créez une connexion à la base de données avec PDO
// ...

// Supprimez l'utilisateur en utilisant une transaction
// ...

// Vérifiez si la suppression a réussi
// ...
?>`,
    solution: `<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=testdb", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Démarrer une transaction
    $pdo->beginTransaction();
    
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id");
    $stmt->execute(['id' => 2]);
    
    // Si nous sommes ici, c'est que la requête a réussi
    $pdo->commit();
    
    if ($stmt->rowCount() > 0) {
        echo "✅ Utilisateur supprimé !";
    } else {
        echo "⚠️ Aucun utilisateur avec cet ID.";
    }
} catch (PDOException $e) {
    // En cas d'erreur, annuler la transaction
    $pdo->rollBack();
    echo "🔴 Erreur : " . $e->getMessage();
}
?>`,
    points: 50,
    hint: "Utilisez beginTransaction(), commit() et rollBack() pour garantir l'intégrité des données pendant l'opération de suppression."
  }
];

export const PHPExercises: React.FC = () => {
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string>("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const activeExercise = phpExercises.find(ex => ex.id === activeExerciseId);

  const handleSelectExercise = (exerciseId: string) => {
    const exercise = phpExercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setActiveExerciseId(exerciseId);
      setUserCode(exercise.starter_code);
      setShowHint(false);
      setShowSolution(false);
    }
  };

  const handleCodeChange = (code: string | undefined) => {
    if (code !== undefined) {
      setUserCode(code);
    }
  };

  const handleSubmit = () => {
    if (!activeExercise) return;

    // Simple code comparison (in a real app, this would be a more sophisticated evaluation)
    const normalizedUserCode = userCode.replace(/\s+/g, " ").trim();
    const normalizedSolution = activeExercise.solution.replace(/\s+/g, " ").trim();
    
    const similarity = calculateSimilarity(normalizedUserCode, normalizedSolution);
    
    if (similarity > 0.6) {
      // Code is similar enough to be considered correct
      if (!completedExercises.includes(activeExercise.id)) {
        setCompletedExercises([...completedExercises, activeExercise.id]);
        setUserPoints(userPoints + activeExercise.points);
        toast.success(`🎉 Bravo ! +${activeExercise.points} points !`);
      } else {
        toast.success("Exercice déjà complété !");
      }
    } else {
      toast.error("Votre solution n'est pas correcte. Essayez encore !");
    }
  };

  // Simple string similarity calculation
  const calculateSimilarity = (a: string, b: string): number => {
    if (a === b) return 1.0;
    if (a.length === 0 || b.length === 0) return 0.0;
    
    // This is a very simplified version - in a real app use a proper algorithm
    const commonChars = a.split('').filter(char => b.includes(char)).length;
    return commonChars / Math.max(a.length, b.length);
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

  const exerciseProgress = (completedExercises.length / phpExercises.length) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Exercices PHP: Bases de données</h2>
            <p className="text-gray-600">Maîtrisez les opérations CRUD avec PDO et MySQLi</p>
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
            Ces exercices simulent l'utilisation d'une base de données MySQL. Dans un environnement réel, vous auriez besoin d'un serveur MySQL fonctionnel avec une base de données "testdb".
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            <h3 className="text-lg font-semibold">Liste des exercices</h3>
            <div className="space-y-3">
              {phpExercises.map((exercise) => (
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
                <p className="text-gray-700 mb-4">{activeExercise.description}</p>
                
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
                      <FormattedMessage content={`\`\`\`php\n${activeExercise.solution}\n\`\`\``} />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Votre code:</h4>
                <div className="border rounded-md overflow-hidden">
                  <div className="h-[350px]">
                    <MonacoEditorWrapper
                      language="javascript" // Utilisons javascript car PHP n'est pas directement supporté
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
