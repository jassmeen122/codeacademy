
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb, CheckCircle, XCircle, Award } from "lucide-react";
import { CodeEditorWrapper } from "@/components/CodeEditor/CodeEditorWrapper";
import { useProgressTracking } from '@/hooks/useProgressTracking';
import { toast } from 'sonner';
import type { CodingExercise } from '@/types/course';

interface CodingExerciseComponentProps {
  exercise: CodingExercise;
  onComplete: (completed: boolean) => void;
}

export const CodingExerciseComponent = ({ exercise, onComplete }: CodingExerciseComponentProps) => {
  const [code, setCode] = useState(exercise.starter_code || '');
  const [output, setOutput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { updateUserMetrics } = useProgressTracking();

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleRun = (executionOutput: string) => {
    setOutput(executionOutput);
    
    // Check if the output matches the expected output
    if (exercise.expected_output && executionOutput.trim() === exercise.expected_output.trim()) {
      setIsCorrect(true);
      if (!isSubmitted) {
        toast.info("🎯 La solution semble correcte! Cliquez sur 'Soumettre' pour valider.", {
          duration: 5000
        });
      }
    } else {
      setIsCorrect(false);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    setIsSubmitted(true);
    
    if (isCorrect && !isCompleted) {
      try {
        // First call onComplete to update exercise state
        onComplete(true);
        
        // Then update metrics
        console.log('🎮 Enregistrement de l\'exercice dans les statistiques...');
        const updated = await updateUserMetrics('exercise', 1);
        
        if (updated) {
          console.log('✅ Exercice enregistré avec succès');
          setIsCompleted(true);
          
          // Show different motivational messages randomly
          const messages = [
            'Bravo! Exercice complété avec succès! 🎉',
            'Excellente logique! Vous progressez bien! 💪',
            'Quelle réussite! Continuez comme ça! 🌟',
            'Parfait! Votre compétence s\'améliore! 📈',
            'Code correct! Un pas de plus vers la maîtrise! 🚀'
          ];
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          toast.success(randomMessage);
        } else {
          console.error('❌ Échec de l\'enregistrement de l\'exercice');
          toast.error('Exercice sauvegardé, mais l\'actualisation des statistiques a échoué');
        }
      } catch (error) {
        console.error('❌ Erreur pendant la soumission:', error);
        toast.error('Un problème est survenu avec votre soumission');
      } finally {
        setSubmitting(false);
      }
    } else if (isCorrect && isCompleted) {
      toast.info('Vous avez déjà complété cet exercice! 👍');
      setSubmitting(false);
    } else {
      toast.error('Votre solution n\'est pas encore correcte. Réessayez! 🔄');
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-6 border-t-4 border-t-blue-500">
      <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="p-1 bg-blue-100 dark:bg-blue-800 rounded-full">
            <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </span>
          {exercise.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border">
          <p>{exercise.description}</p>
        </div>
        
        {exercise.hints && exercise.hints.length > 0 && (
          <div className="mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-amber-600 dark:text-amber-400"
            >
              <Lightbulb className="h-4 w-4" />
              {showHint ? 'Masquer l\'indice' : 'Afficher l\'indice'}
            </Button>
            
            {showHint && (
              <div className="mt-2 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg">
                <p className="text-sm">{exercise.hints[0]}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="h-80">
          <CodeEditorWrapper
            initialCode={code}
            initialLanguage={exercise.module_id.includes('python') ? 'python' : 'javascript'}
            onChange={handleCodeChange}
            onRun={handleRun}
          />
        </div>
        
        {output && (
          <div className="p-4 bg-gray-900 text-white rounded-lg font-mono text-sm overflow-auto max-h-40">
            <pre>{output}</pre>
          </div>
        )}
        
        {isSubmitted && (
          <Alert className={isCorrect ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30" : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30"}>
            <div className="flex items-center gap-2">
              {isCorrect ? 
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" /> : 
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              }
              <AlertDescription>
                {isCorrect 
                  ? "Bravo! Votre solution est correcte. Continuez comme ça! 🎉" 
                  : "Pas tout à fait. Réessayez et assurez-vous que votre sortie correspond exactement à ce qui est attendu. Vous y êtes presque! 💪"}
              </AlertDescription>
            </div>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between bg-blue-50/50 dark:bg-blue-900/10">
        <div className="text-sm text-muted-foreground">
          {exercise.expected_output && (
            <span>Sortie attendue: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{exercise.expected_output}</code></span>
          )}
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={!output || isCompleted || submitting}
          className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {submitting ? "Soumission..." : isCompleted ? "Complété! ✅" : "Soumettre la solution"}
        </Button>
      </CardFooter>
    </Card>
  );
};
