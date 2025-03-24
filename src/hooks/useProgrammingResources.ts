
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
        
        // Fetch default resources
        const { data: defaultData, error: defaultError } = await supabase
          .from('default_resources')
          .select('*')
          .eq('language_id', languageId)
          .single();
          
        if (defaultError && defaultError.code !== 'PGRST116') {
          throw defaultError;
        }
        
        // Fetch custom resources if they exist
        const { data: customData, error: customError } = await supabase
          .from('custom_resources')
          .select('*')
          .eq('language_id', languageId)
          .maybeSingle();
          
        if (customError && customError.code !== 'PGRST116') {
          throw customError;
        }
        
        setDefaultResources(defaultData);
        setCustomResources(customData);
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
      
      // Check if we already have custom resources for this language
      const { data: existingResource, error: fetchError } = await supabase
        .from('custom_resources')
        .select('id')
        .eq('language_id', languageId)
        .eq('teacher_id', teacherId)
        .maybeSingle();
        
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      
      // Prepare data for insertion/update
      const resourceData: any = {
        language_id: languageId,
        teacher_id: teacherId
      };
      
      // Only include fields that are provided
      if (data.course_video_url) resourceData.course_video_url = data.course_video_url;
      if (course_pdf_url) resourceData.course_pdf_url = course_pdf_url;
      if (data.exercise_video_url) resourceData.exercise_video_url = data.exercise_video_url;
      if (exercise_pdf_url) resourceData.exercise_pdf_url = exercise_pdf_url;
      
      let result;
      
      // Insert or update based on whether the resource exists
      if (existingResource) {
        const { data, error } = await supabase
          .from('custom_resources')
          .update(resourceData)
          .eq('id', existingResource.id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('custom_resources')
          .insert(resourceData)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
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
