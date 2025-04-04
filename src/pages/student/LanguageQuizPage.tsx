
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Check, HelpCircle, X } from "lucide-react";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import { useProgrammingLanguages } from '@/hooks/useProgrammingCourses';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useProgressTracking } from '@/hooks/useProgressTracking';

interface Quiz {
  id: string;
  question: string;
  correct_answer: string;
  option1: string;
  option2: string;
  option3: string | null;
  explanation: string | null;
}

type LanguageParams = {
  languageId: string;
};

const LanguageQuizPage = () => {
  const { languageId } = useParams<LanguageParams>();
  const navigate = useNavigate();
  const { user } = useAuthState();
  const { languages } = useProgrammingLanguages();
  const { trackQuizCompletion } = useProgressTracking();
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.id === languageId);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!languageId) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('coding_quiz')
          .select('*')
          .eq('language', currentLanguage?.name || '')
          .limit(5);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setQuizzes(data as Quiz[]);
        } else {
          const { data: genericData, error: genericError } = await supabase
            .from('coding_quiz')
            .select('*')
            .limit(5);
            
          if (genericError) throw genericError;
          
          if (genericData && genericData.length > 0) {
            setQuizzes(genericData as Quiz[]);
          }
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des quiz:', err);
        toast.error('Impossible de charger les quiz');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizzes();
  }, [languageId, currentLanguage]);

  const handleAnswerSelection = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
  };

  const checkAnswer = () => {
    if (!selectedAnswer || !quizzes[currentQuizIndex]) return;
    
    const isAnswerCorrect = selectedAnswer === quizzes[currentQuizIndex].correct_answer;
    
    setIsAnswered(true);
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setScore(score + 1);
    }
  };

  // FIX: Make this function async
  const handleNextQuestion = async () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
      
      if (user && languageId && currentLanguage) {
        await trackQuizCompletion(
          languageId,
          currentLanguage.name,
          score >= Math.ceil(quizzes.length * 0.7),
          score
        );
      }
    }
  };

  const updateUserProgress = async () => {
    try {
      const passScore = Math.ceil(quizzes.length * 0.7);
      const isPassed = score >= passScore;
      
      if (user && languageId && currentLanguage) {
        await trackQuizCompletion(
          languageId,
          currentLanguage.name,
          isPassed,
          score
        );
      }
    } catch (err) {
      console.error('Error updating user progress:', err);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const renderOptions = (quiz: Quiz) => {
    const options = [
      { value: quiz.option1, label: quiz.option1 },
      { value: quiz.option2, label: quiz.option2 }
    ];
    
    if (quiz.option3) {
      options.push({ value: quiz.option3, label: quiz.option3 });
    }
    
    if (!options.some(opt => opt.value === quiz.correct_answer)) {
      options.push({ value: quiz.correct_answer, label: quiz.correct_answer });
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (quizzes.length === 0) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">
              Quiz: {currentLanguage?.name || 'Programmation'}
            </h1>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/student/language-summary/${languageId}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au résumé
            </Button>
          </div>
          
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <HelpCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">Quiz non disponible</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Les questions pour ce quiz sont en cours de préparation. Veuillez revenir plus tard.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (quizCompleted) {
    const passScore = Math.ceil(quizzes.length * 0.7);
    const isPassed = score >= passScore;
    
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">
              Quiz: {currentLanguage?.name || 'Programmation'}
            </h1>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/student/language-summary/${languageId}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au résumé
            </Button>
          </div>
          
          <Card className="w-full bg-white shadow-md">
            <CardHeader className="text-center border-b">
              <CardTitle className="text-2xl">Résultats du Quiz</CardTitle>
            </CardHeader>
            <CardContent className="py-8">
              <div className="text-center">
                {isPassed ? (
                  <div className="flex flex-col items-center">
                    <div className="bg-green-100 p-3 rounded-full mb-4">
                      <Check className="h-12 w-12 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-green-600 mb-2">Félicitations!</h3>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="bg-orange-100 p-3 rounded-full mb-4">
                      <X className="h-12 w-12 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-orange-600 mb-2">Essayez encore!</h3>
                  </div>
                )}
                
                <p className="text-lg mb-6">
                  Votre score: <span className="font-bold">{score}/{quizzes.length}</span>
                </p>
                
                <p className="text-sm text-gray-600 mb-8">
                  {isPassed 
                    ? "Vous avez réussi le quiz! Continuez votre apprentissage." 
                    : `Score minimum pour réussir: ${passScore}/${quizzes.length}. Vous pouvez réessayer!`}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4 border-t pt-4">
              <Button 
                onClick={resetQuiz}
                variant="outline"
              >
                Réessayer le quiz
              </Button>
              <Button 
                onClick={() => navigate(`/student/language-courses/${languageId}`)}
              >
                Retour au cours
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const currentQuiz = quizzes[currentQuizIndex];
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            Quiz: {currentLanguage?.name || 'Programmation'}
          </h1>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/student/language-summary/${languageId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au résumé
          </Button>
        </div>
        
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-600">
            Question {currentQuizIndex + 1} sur {quizzes.length}
          </div>
          <div className="text-sm font-medium text-gray-600">
            Score: {score}
          </div>
        </div>
        
        <Card className="w-full bg-white shadow-md">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">{currentQuiz.question}</CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            <RadioGroup 
              value={selectedAnswer || ''} 
              className="space-y-4"
            >
              {renderOptions(currentQuiz).map((option, index) => (
                <div 
                  key={index} 
                  className={`flex items-center space-x-2 p-3 rounded-md ${
                    isAnswered && option.value === currentQuiz.correct_answer 
                      ? 'bg-green-50 border border-green-200' 
                      : isAnswered && option.value === selectedAnswer 
                        ? 'bg-red-50 border border-red-200'
                        : 'hover:bg-gray-50 border border-gray-200'
                  }`}
                  onClick={() => handleAnswerSelection(option.value)}
                >
                  <RadioGroupItem 
                    value={option.value} 
                    id={`option-${index}`} 
                    disabled={isAnswered}
                  />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className={`flex-grow cursor-pointer ${
                      isAnswered && option.value === currentQuiz.correct_answer 
                        ? 'text-green-700' 
                        : isAnswered && option.value === selectedAnswer 
                          ? 'text-red-700'
                          : ''
                    }`}
                  >
                    {option.label}
                  </Label>
                  
                  {isAnswered && option.value === currentQuiz.correct_answer && (
                    <Check className="h-5 w-5 text-green-600" />
                  )}
                  
                  {isAnswered && option.value === selectedAnswer && option.value !== currentQuiz.correct_answer && (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                </div>
              ))}
            </RadioGroup>
            
            {isAnswered && currentQuiz.explanation && (
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <p className="text-blue-800 text-sm">{currentQuiz.explanation}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
            {!isAnswered ? (
              <Button 
                onClick={checkAnswer}
                disabled={!selectedAnswer}
              >
                Vérifier la réponse
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {currentQuizIndex < quizzes.length - 1 ? 'Question suivante' : 'Voir les résultats'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LanguageQuizPage;
