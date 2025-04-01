
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StudentInternshipPreferences } from '@/types/internship';
import { useAuthState } from '@/hooks/useAuthState';

export const useInternshipPreferences = () => {
  const [preferences, setPreferences] = useState<StudentInternshipPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthState();

  const fetchPreferences = async () => {
    if (!user || user.role !== 'student') {
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('student_internship_preferences')
        .select('*')
        .eq('student_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // No rows found is not an error
      
      setPreferences(data as StudentInternshipPreferences || null);
    } catch (err: any) {
      console.error('Error fetching internship preferences:', err);
      setError(err);
      toast.error('Failed to load internship preferences');
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (preferences: {
    industries: string[];
    locations: string[];
    is_remote: boolean | null;
  }) => {
    if (!user || user.role !== 'student') {
      toast.error('Only students can save internship preferences');
      return null;
    }

    try {
      // Check if preferences already exist
      const { data: existingPrefs } = await supabase
        .from('student_internship_preferences')
        .select('id')
        .eq('student_id', user.id)
        .single();
      
      let result;
      
      if (existingPrefs) {
        // Update existing preferences
        const { data, error } = await supabase
          .from('student_internship_preferences')
          .update({
            industries: preferences.industries,
            locations: preferences.locations,
            is_remote: preferences.is_remote
          })
          .eq('id', existingPrefs.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new preferences
        const { data, error } = await supabase
          .from('student_internship_preferences')
          .insert({
            student_id: user.id,
            industries: preferences.industries,
            locations: preferences.locations,
            is_remote: preferences.is_remote
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      toast.success('Preferences saved successfully');
      setPreferences(result as StudentInternshipPreferences);
      
      return result;
    } catch (err: any) {
      console.error('Error saving preferences:', err);
      toast.error('Failed to save preferences');
      return null;
    }
  };

  useEffect(() => {
    if (user && user.role === 'student') {
      fetchPreferences();
    }
  }, [user]);

  return {
    preferences,
    loading,
    error,
    fetchPreferences,
    savePreferences
  };
};
