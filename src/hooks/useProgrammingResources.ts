
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProgrammingLanguage } from '@/types/course';

export interface LanguageResource {
  id: string;
  language_id: string;
  course_video_url: string;
  course_pdf_url: string;
  exercise_video_url: string;
  exercise_pdf_url: string;
  created_at?: string;
}

export interface CustomResource extends LanguageResource {
  teacher_id: string;
  updated_at?: string;
}

export const useLanguageResources = (languageId: string | null) => {
  const [defaultResources, setDefaultResources] = useState<LanguageResource | null>(null);
  const [customResources, setCustomResources] = useState<CustomResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!languageId) {
      setLoading(false);
      return;
    }

    const fetchResources = async () => {
      try {
        setLoading(true);
        
        // Fetch default resources using RPC
        const { data: defaultData, error: defaultError } = await supabase
          .rpc('get_default_resources', { lang_id: languageId });
          
        if (defaultError) {
          console.error('Error fetching default resources:', defaultError);
          // Only throw if it's not just a "no rows returned" error
          if (defaultError.code !== 'PGRST116') {
            throw defaultError;
          }
        }
        
        // Fetch custom resources using RPC
        const { data: customData, error: customError } = await supabase
          .rpc('get_custom_resources', { lang_id: languageId });
          
        if (customError) {
          console.error('Error fetching custom resources:', customError);
          // Only throw if it's not just a "no rows returned" error
          if (customError.code !== 'PGRST116') {
            throw customError;
          }
        }
        
        if (defaultData) {
          setDefaultResources(defaultData as unknown as LanguageResource);
        }
        
        if (customData) {
          setCustomResources(customData as unknown as CustomResource);
        }
      } catch (err: any) {
        console.error('Error fetching language resources:', err);
        setError(err);
        toast.error('Erreur lors du chargement des ressources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [languageId]);

  // Get effective resources (custom if available, otherwise default)
  const getEffectiveResources = () => {
    if (!defaultResources && !customResources) return null;
    
    if (customResources) {
      return {
        course_video_url: customResources.course_video_url || (defaultResources?.course_video_url || ''),
        course_pdf_url: customResources.course_pdf_url || (defaultResources?.course_pdf_url || ''),
        exercise_video_url: customResources.exercise_video_url || (defaultResources?.exercise_video_url || ''),
        exercise_pdf_url: customResources.exercise_pdf_url || (defaultResources?.exercise_pdf_url || '')
      };
    }
    
    return defaultResources;
  };

  return { 
    defaultResources, 
    customResources, 
    effectiveResources: getEffectiveResources(),
    loading, 
    error 
  };
};

export const useUploadLanguageResource = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadResource = async (
    languageId: string, 
    teacherId: string, 
    data: { 
      course_video_url?: string, 
      course_pdf_file?: File, 
      exercise_video_url?: string, 
      exercise_pdf_file?: File 
    }
  ) => {
    try {
      setUploading(true);
      setError(null);
      
      let course_pdf_url = '';
      let exercise_pdf_url = '';
      
      // Upload course PDF if provided
      if (data.course_pdf_file) {
        const fileExt = data.course_pdf_file.name.split('.').pop();
        const filePath = `courses/${languageId}/course_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('course_materials')
          .upload(filePath, data.course_pdf_file);
          
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('course_materials')
          .getPublicUrl(filePath);
          
        course_pdf_url = publicUrlData.publicUrl;
      }
      
      // Upload exercise PDF if provided
      if (data.exercise_pdf_file) {
        const fileExt = data.exercise_pdf_file.name.split('.').pop();
        const filePath = `exercises/${languageId}/exercise_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('course_materials')
          .upload(filePath, data.exercise_pdf_file);
          
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('course_materials')
          .getPublicUrl(filePath);
          
        exercise_pdf_url = publicUrlData.publicUrl;
      }
      
      // Use RPC function to upsert custom resource
      const { data: result, error: upsertError } = await supabase.rpc(
        'upsert_custom_resource',
        {
          lang_id: languageId,
          teach_id: teacherId,
          c_video_url: data.course_video_url || null,
          c_pdf_url: course_pdf_url || null,
          e_video_url: data.exercise_video_url || null,
          e_pdf_url: exercise_pdf_url || null
        }
      );
      
      if (upsertError) throw upsertError;
      
      return result;
    } catch (err: any) {
      console.error('Error uploading resources:', err);
      setError(err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadResource, uploading, error };
};
