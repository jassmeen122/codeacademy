
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useCourseModules } from '@/hooks/useProgrammingCourses';
import { ModuleCard } from '@/components/courses/ModuleCard';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, GraduationCap } from "lucide-react";
import type { ProgrammingLanguage, UserProgress } from '@/types/course';

const LanguageModulesPage = () => {
  const { languageId } = useParams<{ languageId: string }>();
  const navigate = useNavigate();
  const { modules, loading, error } = useCourseModules(languageId ?? null);
  const [language, setLanguage] = useState<ProgrammingLanguage | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [languageLoading, setLanguageLoading] = useState(true);

  useEffect(() => {
    const fetchLanguage = async () => {
      if (!languageId) return;
      
      try {
        setLanguageLoading(true);
        const { data, error } = await supabase
          .from('programming_languages')
          .select('*')
          .eq('id', languageId)
          .single();
          
        if (error) throw error;
        setLanguage(data as ProgrammingLanguage);
      } catch (err) {
        console.error('Error fetching language:', err);
      } finally {
        setLanguageLoading(false);
      }
    };

    const fetchUserProgress = async () => {
      if (!languageId) return;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        const progress: Record<string, boolean> = {};
        (data as UserProgress[]).forEach(item => {
          progress[item.module_id] = item.completed;
        });
        
        setUserProgress(progress);
        
        // Calculate completion percentage
        if (modules.length > 0) {
          const completedCount = modules.filter(mod => progress[mod.id]).length;
          setCompletionPercentage(Math.round((completedCount / modules.length) * 100));
        }
      } catch (err) {
        console.error('Error fetching user progress:', err);
      }
    };

    fetchLanguage();
    fetchUserProgress();
  }, [languageId, modules]);

  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];
  
  // Group modules by difficulty
  const groupedModules = difficultyLevels.reduce((acc, difficulty) => {
    acc[difficulty] = modules.filter(mod => mod.difficulty === difficulty);
    return acc;
  }, {} as Record<string, typeof modules>);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/student/languages')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Languages
        </Button>
        
        {languageLoading ? (
          <div className="animate-pulse mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        ) : language ? (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              {language.name} Modules
            </h1>
            <p className="text-muted-foreground mt-2">
              {language.description || `Learn ${language.name} programming from beginning to advanced concepts.`}
            </p>
            
            {modules.length > 0 && (
              <div className="mt-6 bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Your progress</span>
                  <span className="text-sm text-muted-foreground">{completionPercentage}% complete</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Programming Language Modules</h1>
          </div>
        )}
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-5 w-5 bg-gray-200 rounded-full" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                  </div>
                  <div className="h-12 bg-gray-100 rounded mb-4" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : modules.length > 0 ? (
          <Tabs defaultValue="Beginner">
            <TabsList className="mb-6">
              {difficultyLevels.map(level => (
                <TabsTrigger key={level} value={level} disabled={!groupedModules[level]?.length}>
                  {level}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {difficultyLevels.map(level => (
              <TabsContent key={level} value={level}>
                {groupedModules[level]?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedModules[level].map((module) => (
                      <ModuleCard 
                        key={module.id} 
                        module={module} 
                        isCompleted={!!userProgress[module.id]}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No {level} modules available yet.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <GraduationCap className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Modules Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We're still working on creating modules for this programming language. Please check back later.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LanguageModulesPage;
