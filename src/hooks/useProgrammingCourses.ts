
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProgrammingLanguage } from '@/types/course';

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
