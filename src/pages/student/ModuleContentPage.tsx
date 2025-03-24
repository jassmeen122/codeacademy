import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, File, ListChecks, Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { QuizComponent } from "@/components/courses/QuizComponent";
import { CodingExerciseComponent } from "@/components/courses/CodingExerciseComponent";
import { useModuleDetails } from '@/hooks/useProgrammingCourses';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Trophy } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';

const ModuleContentPage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthState();
  const moduleDetails = useModuleDetails(moduleId || '');

  if (!moduleId) {
    return <DashboardLayout>Module ID is required.</DashboardLayout>;
  }

  if (moduleDetails.loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading module content...
        </div>
      </DashboardLayout>
    );
  }

  if (!moduleDetails.module) {
    return <DashboardLayout>Module not found.</DashboardLayout>;
  }

  const handleCompleteQuiz = async (score: number) => {
    await moduleDetails.updateProgress(true, score, moduleDetails.userProgress?.exercise_completed || false);
    
    // Give points for completing a quiz
    const pointsEarned = score > 0 ? 50 : 10;
    
    if (user) {
      try {
        await supabase.rpc('increment_user_points', {
          user_id: user.id,
          points_to_add: pointsEarned
        });
        
        toast.success(
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>+{pointsEarned} points earned for quiz completion!</span>
          </div>
        );
        
        // Check for quiz score badge if perfect score
        if (score === 1) {
          checkForQuizBadge(user.id);
        }
      } catch (error) {
        console.error('Error updating points:', error);
      }
    }
  };

  const handleCompleteExercise = async (completed: boolean) => {
    await moduleDetails.updateProgress(
      moduleDetails.userProgress?.completed || false,
      moduleDetails.userProgress?.quiz_score || 0,
      completed
    );
    
    // Give points for completing an exercise
    if (completed && user) {
      try {
        // Award more points for coding exercise completion
        const pointsEarned = 100;
        
        await supabase.rpc('increment_user_points', {
          user_id: user.id,
          points_to_add: pointsEarned
        });
        
        toast.success(
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>+{pointsEarned} points earned for exercise completion!</span>
          </div>
        );
      } catch (error) {
        console.error('Error updating points:', error);
      }
    }
  };

  const checkForQuizBadge = async (userId: string) => {
    try {
      // Check how many perfect quizzes the user has completed
      const { data: perfectQuizzes, error: quizError } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('quiz_score', 1);
        
      if (quizError) throw quizError;
      
      // If user has 5 perfect quizzes, check for the "Quiz Ace" badge
      if (perfectQuizzes && perfectQuizzes.length >= 5) {
        const { data: quizAceBadge, error: badgeError } = await supabase
          .from('badges')
          .select('id')
          .eq('name', 'Quiz Ace')
          .single();
          
        if (badgeError) throw badgeError;
        
        // Check if user already has this badge
        const { data: existingBadge, error: existingError } = await supabase
          .from('user_badges')
          .select('id')
          .eq('user_id', userId)
          .eq('badge_id', quizAceBadge.id)
          .maybeSingle();
        
        if (existingError) throw existingError;
        
        // Award badge if they don't have it yet
        if (!existingBadge && quizAceBadge) {
          const { error: insertError } = await supabase
            .from('user_badges')
            .insert({
              user_id: userId,
              badge_id: quizAceBadge.id
            });
            
          if (insertError) throw insertError;
          
          // Add the badge points too
          const { data: badgePoints, error: pointsError } = await supabase
            .from('badges')
            .select('points')
            .eq('id', quizAceBadge.id)
            .single();
            
          if (pointsError) throw pointsError;
          
          await supabase.rpc('increment_user_points', {
            user_id: userId,
            points_to_add: badgePoints.points
          });
          
          toast.success(`🏆 New badge earned: Quiz Ace!`, {
            duration: 5000
          });
        }
      }
    } catch (error) {
      console.error('Error checking quiz badge:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{moduleDetails.module.title}</h1>
            <p className="text-muted-foreground">
              {moduleDetails.module.description || 'No description available for this module.'}
            </p>
          </div>
          <Button onClick={() => navigate(`/student/languages/${moduleDetails.module.language_id}`)}>
            Back to Course
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Module Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="content">
                <AccordionTrigger>
                  <Video className="mr-2 h-4 w-4" />
                  Module Content
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-sm max-w-none">
                    {moduleDetails.module.content ? (
                      <div dangerouslySetInnerHTML={{ __html: moduleDetails.module.content }} />
                    ) : (
                      <p>No content available for this module.</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {moduleDetails.quizzes.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              {moduleDetails.quizzes.map((quiz) => (
                <QuizComponent 
                  key={quiz.id} 
                  quiz={quiz} 
                  onComplete={handleCompleteQuiz} 
                />
              ))}
            </CardContent>
          </Card>
        )}

        {moduleDetails.exercises.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Coding Exercises</CardTitle>
            </CardHeader>
            <CardContent>
              {moduleDetails.exercises.map((exercise) => (
                <CodingExerciseComponent
                  key={exercise.id}
                  exercise={exercise}
                  onComplete={handleCompleteExercise}
                />
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ModuleContentPage;
