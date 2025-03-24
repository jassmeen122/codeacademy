
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProgrammingLanguage, CourseModule, Quiz, CodingExercise } from '@/types/course';

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
          
        if (error) {
          throw error;
        }
        
        setLanguages(data as ProgrammingLanguage[]);
      } catch (err: any) {
        console.error('Error fetching programming languages:', err);
        setError(err);
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
          
        if (error) {
          throw error;
        }
        
        setModules(data as CourseModule[]);
      } catch (err: any) {
        console.error('Error fetching course modules:', err);
        setError(err);
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

    const fetchModuleData = async () => {
      try {
        setLoading(true);
        
        // Fetch the module content
        const { data: moduleData, error: moduleError } = await supabase
          .from('course_modules')
          .select('*')
          .eq('id', moduleId)
          .single();
          
        if (moduleError) throw moduleError;
        
        setModule(moduleData as CourseModule);
        
        // Fetch related quizzes
        const { data: quizzesData, error: quizzesError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('module_id', moduleId);
          
        if (quizzesError) throw quizzesError;
        
        setQuizzes(quizzesData as Quiz[]);
        
        // Fetch related coding exercises
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('coding_exercises')
          .select('*')
          .eq('module_id', moduleId);
          
        if (exercisesError) throw exercisesError;
        
        setExercises(exercisesData as CodingExercise[]);
        
      } catch (err: any) {
        console.error('Error fetching module content:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [moduleId]);

  return { module, quizzes, exercises, loading, error };
};
