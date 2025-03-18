
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CourseResource } from "@/types/course";
import { toast } from "sonner";

export const useCourseResources = (courseId: string) => {
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('course_resources')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      
      setResources(data as CourseResource[]);
    } catch (err: any) {
      console.error("Error fetching course resources:", err);
      setError(err);
      toast.error("Impossible de charger les ressources du cours");
    } finally {
      setLoading(false);
    }
  };

  const addResource = async (resource: Omit<CourseResource, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('course_resources')
        .insert(resource)
        .select()
        .single();
      
      if (error) throw error;
      
      setResources(prev => [...prev, data as CourseResource]);
      return data;
    } catch (err: any) {
      console.error("Error adding course resource:", err);
      toast.error("Impossible d'ajouter la ressource");
      throw err;
    }
  };

  const removeResource = async (resourceId: string) => {
    try {
      const { error } = await supabase
        .from('course_resources')
        .delete()
        .eq('id', resourceId);
      
      if (error) throw error;
      
      setResources(prev => prev.filter(resource => resource.id !== resourceId));
      return true;
    } catch (err: any) {
      console.error("Error removing course resource:", err);
      toast.error("Impossible de supprimer la ressource");
      throw err;
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchResources();
    }
  }, [courseId]);

  return {
    resources,
    loading,
    error,
    fetchResources,
    addResource,
    removeResource
  };
};
