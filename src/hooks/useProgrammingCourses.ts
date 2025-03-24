
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProgrammingLanguage, CourseModule } from '@/types/course';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!moduleId) {
      setModule(null);
      setLoading(false);
      return;
    }

    const fetchModule = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('course_modules')
          .select('*')
          .eq('id', moduleId)
          .single();
          
        if (error) {
          throw error;
        }
        
        setModule(data as CourseModule);
      } catch (err: any) {
        console.error('Error fetching module content:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  return { module, loading, error };
};
