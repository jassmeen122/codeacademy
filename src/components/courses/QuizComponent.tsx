
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";
import type { Quiz } from '@/types/course';

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
}

export const QuizComponent = ({ quiz, onComplete }: QuizComponentProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const options = [
    { value: 'option1', label: quiz.option1 },
    { value: 'option2', label: quiz.option2 },
    ...(quiz.option3 ? [{ value: 'option3', label: quiz.option3 }] : []),
  ];

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const correctOption = options.findIndex(opt => opt.label === quiz.correct_answer) + 1;
    const userOption = parseInt(selectedAnswer.replace('option', ''));
    
    const isAnswerCorrect = userOption === correctOption;
    setIsCorrect(isAnswerCorrect);
    setIsSubmitted(true);
    
    if (isAnswerCorrect) {
      onComplete(1);
    } else {
      onComplete(0);
    }
  };

  const handleNext = () => {
    setSelectedAnswer('');
    setIsSubmitted(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Quiz Question</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-lg font-medium">{quiz.question}</div>
          
          <RadioGroup 
            value={selectedAnswer} 
            onValueChange={setSelectedAnswer}
            disabled={isSubmitted}
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label 
                  htmlFor={option.value} 
                  className={`
                    ${isSubmitted && option.label === quiz.correct_answer ? 'text-green-600 font-medium' : ''}
                    ${isSubmitted && selectedAnswer === option.value && option.label !== quiz.correct_answer ? 'text-red-600 font-medium' : ''}
                  `}
                >
                  {option.label}
                </Label>
                {isSubmitted && option.label === quiz.correct_answer && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {isSubmitted && selectedAnswer === option.value && option.label !== quiz.correct_answer && (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            ))}
          </RadioGroup>
          
          {isSubmitted && quiz.explanation && (
            <div className={`p-4 rounded-lg mt-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="text-sm">{quiz.explanation}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {isSubmitted ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedAnswer}
          >
            Submit Answer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
