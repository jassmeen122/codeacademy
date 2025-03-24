
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ProgrammingLanguage, CourseModule } from '@/types/course';

export const useProgrammingLanguages = () => {
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('programming_languages')
          .select('*')
          .order('name');
          
        if (error) throw error;
        setLanguages(data as ProgrammingLanguage[]);
      } catch (err: any) {
        console.error('Error fetching programming languages:', err);
        setError(err);
        toast.error('Failed to load programming languages');
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  return { languages, loading, error };
};

export const useCourseModules = (languageId: string | null) => {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!languageId) {
      setModules([]);
      setLoading(false);
      return;
    }

    const fetchModules = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('course_modules')
          .select('*')
          .eq('language_id', languageId)
          .order('order_index');
          
        if (error) throw error;
        setModules(data as CourseModule[]);
      } catch (err: any) {
        console.error('Error fetching course modules:', err);
        setError(err);
        toast.error('Failed to load course modules');
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [languageId]);

  return { modules, loading, error };
};

export const useModuleContent = (moduleId: string | null) => {
  const [module, setModule] = useState<CourseModule | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [exercises, setExercises] = useState<CodingExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!moduleId) {
      setModule(null);
      setQuizzes([]);
      setExercises([]);
      setLoading(false);
      return;
    }

    const fetchModuleContent = async () => {
      try {
        setLoading(true);
        
        // Fetch module
        const { data: moduleData, error: moduleError } = await supabase
          .from('course_modules')
          .select('*')
          .eq('id', moduleId)
          .single();
          
        if (moduleError) throw moduleError;
        
        // Fetch quizzes
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('module_id', moduleId);
          
        if (quizError) throw quizError;
        
        // Fetch exercises
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('coding_exercises')
          .select('*')
          .eq('module_id', moduleId);
          
        if (exerciseError) throw exerciseError;
        
        setModule(moduleData as CourseModule);
        setQuizzes(quizData as Quiz[]);
        setExercises(exerciseData as CodingExercise[]);
      } catch (err: any) {
        console.error('Error fetching module content:', err);
        setError(err);
        toast.error('Failed to load module content');
      } finally {
        setLoading(false);
      }
    };

    fetchModuleContent();
  }, [moduleId]);

  return { module, quizzes, exercises, loading, error };
};
