import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useModuleContent } from '@/hooks/useProgrammingCourses';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, CheckCircle, BookOpen, FileQuestion, Code } from "lucide-react";
import { QuizComponent } from '@/components/courses/QuizComponent';
import { CodingExerciseComponent } from '@/components/courses/CodingExerciseComponent';
import { toast } from 'sonner';
import type { CourseModule } from '@/types/course';

const ModuleContentPage = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { module, quizzes, exercises, loading, error } = useModuleContent(moduleId ?? null);
  const [languageName, setLanguageName] = useState('');
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [exerciseCompletions, setExerciseCompletions] = useState<Record<string, boolean>>({});
  const [completionStatus, setCompletionStatus] = useState<boolean>(false);

  useEffect(() => {
    const fetchLanguageName = async () => {
      if (!module?.language_id) return;
      
      try {
        const { data, error } = await supabase
          .from('programming_languages')
          .select('name')
          .eq('id', module.language_id)
          .single();
          
        if (error) throw error;
        setLanguageName(data.name);
      } catch (err) {
        console.error('Error fetching language name:', err);
      }
    };

    const fetchUserProgress = async () => {
      if (!moduleId) return;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('module_id', moduleId)
          .single();
          
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
        
        if (data) {
          setCompletionStatus(data.completed);
        }
      } catch (err) {
        console.error('Error fetching user progress:', err);
      }
    };
    
    fetchLanguageName();
    fetchUserProgress();
  }, [module, moduleId]);

  const handleQuizCompletion = (quizId: string, score: number) => {
    setQuizScores(prev => ({
      ...prev,
      [quizId]: score
    }));
    
    checkModuleCompletion();
  };

  const handleExerciseCompletion = (exerciseId: string, completed: boolean) => {
    setExerciseCompletions(prev => ({
      ...prev,
      [exerciseId]: completed
    }));
    
    checkModuleCompletion();
  };

  const checkModuleCompletion = () => {
    const allQuizzesAttempted = quizzes.every(quiz => quiz.id in quizScores);
    
    if (!allQuizzesAttempted) return;
    
    const quizTotal = quizzes.length;
    const quizCorrect = Object.values(quizScores).reduce((sum, score) => sum + score, 0);
    const quizPercentage = quizTotal > 0 ? (quizCorrect / quizTotal) * 100 : 0;
    
    const allExercisesComplete = exercises.every(ex => exerciseCompletions[ex.id]);
    
    const isModuleComplete = allQuizzesAttempted && quizPercentage >= 70 && allExercisesComplete;
    
    if (isModuleComplete && !completionStatus) {
      updateUserProgress(true);
    }
  };

  const updateUserProgress = async (completed: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !moduleId) return;
      
      const { data: existingProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      
      if (existingProgress) {
        const { error } = await supabase
          .from('user_progress')
          .update({
            completed,
            quiz_score: Object.values(quizScores).reduce((sum, score) => sum + score, 0),
            exercise_completed: Object.values(exerciseCompletions).every(Boolean),
            last_accessed: new Date().toISOString()
          })
          .eq('id', existingProgress.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            module_id: moduleId,
            completed,
            quiz_score: Object.values(quizScores).reduce((sum, score) => sum + score, 0),
            exercise_completed: Object.values(exerciseCompletions).every(Boolean)
          });
          
        if (error) throw error;
      }
      
      setCompletionStatus(completed);
      toast.success('Module completed! Great job!');
    } catch (err) {
      console.error('Error updating user progress:', err);
      toast.error('Failed to update progress');
    }
  };

  const renderModuleContent = (content: string | null) => {
    if (!content) return <p>No content available for this module.</p>;
    
    const sections = content.split('\n\n').map((section, index) => {
      if (section.startsWith('# ')) {
        return <h2 key={index} className="text-2xl font-bold my-4">{section.substring(2)}</h2>;
      } else if (section.startsWith('## ')) {
        return <h3 key={index} className="text-xl font-bold my-3">{section.substring(3)}</h3>;
      } else if (section.startsWith('### ')) {
        return <h4 key={index} className="text-lg font-bold my-2">{section.substring(4)}</h4>;
      } else if (section.startsWith('```')) {
        const code = section.substring(section.indexOf('\n') + 1, section.lastIndexOf('```'));
        return (
          <pre key={index} className="bg-gray-900 text-white p-4 rounded-lg my-4 overflow-x-auto">
            <code>{code}</code>
          </pre>
        );
      } else {
        return <p key={index} className="my-2">{section}</p>;
      }
    });
    
    return <div className="prose max-w-none">{sections}</div>;
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Modules
        </Button>
        
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-100 rounded w-1/4 mb-8" />
            <div className="h-96 bg-gray-100 rounded" />
          </div>
        ) : module ? (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-800">{module.title}</h1>
                {completionStatus && (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
              </div>
              <div className="flex items-center text-muted-foreground mt-1">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>{languageName}</span>
                <span className="mx-2">•</span>
                <span>{module.difficulty}</span>
                {module.estimated_duration && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{module.estimated_duration}</span>
                  </>
                )}
              </div>
            </div>
            
            <Tabs defaultValue="content">
              <TabsList className="mb-6">
                <TabsTrigger value="content" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger 
                  value="quiz" 
                  className="flex items-center gap-1"
                  disabled={quizzes.length === 0}
                >
                  <FileQuestion className="h-4 w-4" />
                  Quiz ({quizzes.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="exercises" 
                  className="flex items-center gap-1"
                  disabled={exercises.length === 0}
                >
                  <Code className="h-4 w-4" />
                  Exercises ({exercises.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="content">
                <Card>
                  <CardContent className="pt-6">
                    {renderModuleContent(module.content)}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="quiz">
                {quizzes.length > 0 ? (
                  <div className="space-y-6">
                    {quizzes.map((quiz) => (
                      <QuizComponent 
                        key={quiz.id} 
                        quiz={quiz} 
                        onComplete={(score) => handleQuizCompletion(quiz.id, score)} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <FileQuestion className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-800 mb-2">No Quizzes Available</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      There are no quizzes available for this module yet.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="exercises">
                {exercises.length > 0 ? (
                  <div className="space-y-6">
                    {exercises.map((exercise) => (
                      <CodingExerciseComponent 
                        key={exercise.id} 
                        exercise={exercise} 
                        onComplete={(completed) => handleExerciseCompletion(exercise.id, completed)} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <Code className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-800 mb-2">No Exercises Available</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      There are no coding exercises available for this module yet.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">Module Not Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find the module you're looking for. Please try selecting a different module.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ModuleContentPage;
