
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CourseModule {
  id: string;
  language_id: string;
  title: string;
  description: string | null;
  content: string | null;
  order_index: number;
  difficulty: string | null;
  estimated_duration: string | null;
  created_at: string;
  updated_at: string;
}

type ModuleRecord = {
  id: string;
  language_id: string;
  title: string;
  description: string | null;
  content: string | null;
  order_index: number;
  difficulty: string | null;
  estimated_duration: string | null;
  created_at: string;
  updated_at: string;
};

export function useCourseModules(languageId?: string) {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchModules = useCallback(async (langId?: string) => {
    try {
      setLoading(true);
      
      const targetLanguageId = langId || languageId;
      
      if (!targetLanguageId) {
        setModules([]);
        return;
      }
      
      let query = supabase
        .from('course_modules')
        .select('*')
        .order('order_index');
      
      if (targetLanguageId) {
        query = query.eq('language_id', targetLanguageId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        setModules(data as CourseModule[]);
      }
    } catch (err: any) {
      console.error('Error fetching course modules:', err);
      setError(err);
      toast.error('Failed to load course modules');
    } finally {
      setLoading(false);
    }
  }, [languageId]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const createModule = async (module: Omit<CourseModule, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .insert(module)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Module created successfully');
      fetchModules();
      
      return data;
    } catch (err: any) {
      console.error('Error creating module:', err);
      toast.error('Failed to create module');
      return null;
    }
  };

  return {
    modules,
    loading,
    error,
    fetchModules,
    createModule
  };
}
