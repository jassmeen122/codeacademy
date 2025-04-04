
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb, CheckCircle, XCircle } from "lucide-react";
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
  const [exerciseTracked, setExerciseTracked] = useState(false);
  const { updateUserMetrics } = useProgressTracking();

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleRun = (executionOutput: string) => {
    setOutput(executionOutput);
    
    // Check if the output matches the expected output
    if (exercise.expected_output && executionOutput.trim() === exercise.expected_output.trim()) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    
    if (isCorrect && !exerciseTracked) {
      // Track exercise completion in metrics
      const updated = await updateUserMetrics('exercise', 1);
      if (updated) {
        console.log('Exercise completion tracked in metrics');
        setExerciseTracked(true);
        toast.success('Progress updated!');
      } else {
        console.error('Failed to track exercise in metrics');
      }
      
      onComplete(true);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">{exercise.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg border">
          <p>{exercise.description}</p>
        </div>
        
        {exercise.hints && exercise.hints.length > 0 && (
          <div className="mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-amber-600"
            >
              <Lightbulb className="h-4 w-4" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>
            
            {showHint && (
              <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
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
          <Alert className={isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
            <div className="flex items-center gap-2">
              {isCorrect ? 
                <CheckCircle className="h-5 w-5 text-green-600" /> : 
                <XCircle className="h-5 w-5 text-red-600" />
              }
              <AlertDescription>
                {isCorrect 
                  ? "Great job! Your solution is correct." 
                  : "Not quite right. Try again and ensure your output matches exactly what's expected."}
              </AlertDescription>
            </div>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {exercise.expected_output && (
            <span>Expected output: <code className="bg-gray-100 px-1 rounded">{exercise.expected_output}</code></span>
          )}
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={!output || exerciseTracked}
        >
          {exerciseTracked ? "Submitted" : "Submit Solution"}
        </Button>
      </CardFooter>
    </Card>
  );
};
