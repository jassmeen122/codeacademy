
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CourseModule, CourseLesson } from "@/types/course";
import { toast } from "sonner";

// Define simpler, non-recursive types for database records
type ModuleRecord = {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  course_id: string;
}

type LessonRecord = {
  id: string;
  title: string;
  content: string | null;
  module_id: string;
  order_index: number;
  is_published: boolean;
  requires_completion: boolean;
}

// Custom type for Supabase responses to avoid type recursion
type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
}

export const useCourseModules = (courseId: string) => {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchModules = async () => {
    try {
      setLoading(true);
      
      // First, get all modules for this course
      const { data: modulesData, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');
      
      if (modulesError) throw modulesError;
      
      // Then, get all lessons for these modules - handling type-safely
      const moduleIds = (modulesData || []).map(module => module.id);
      
      if (moduleIds.length > 0) {
        // Use type assertion and handle potential error
        const lessonsQuery = await supabase
          .from('course_lessons') // This is a string literal type so it's safe
          .select('*')
          .in('module_id', moduleIds)
          .order('order_index');
          
        // Check for errors before proceeding
        if (lessonsQuery.error) {
          console.error("Error fetching lessons:", lessonsQuery.error);
          throw lessonsQuery.error;
        }
        
        // Use explicit type assertion for the lessons data
        const lessonsData = lessonsQuery.data as LessonRecord[] | null;
        
        // Combine modules with their lessons
        const modulesWithLessons = (modulesData || []).map(module => {
          const moduleLessons = (lessonsData || [])
            .filter(lesson => lesson.module_id === module.id)
            .map(lesson => ({
              ...lesson,
              // Ensure all CourseLesson properties are present
              id: lesson.id,
              title: lesson.title,
              content: lesson.content || '',
              module_id: lesson.module_id,
              order_index: lesson.order_index,
              is_published: lesson.is_published,
              requires_completion: lesson.requires_completion
            } as CourseLesson));
          
          return {
            ...module,
            lessons: moduleLessons
          } as CourseModule;
        });
        
        setModules(modulesWithLessons);
      } else {
        // Just set the modules without lessons
        setModules((modulesData || []) as CourseModule[]);
      }
    } catch (err: any) {
      console.error("Error fetching course modules:", err);
      setError(err);
      toast.error("Failed to load course structure");
    } finally {
      setLoading(false);
    }
  };

  const saveModule = async (module: CourseModule): Promise<CourseModule> => {
    try {
      // Determine if this is a new module or an update
      const isNewModule = module.id.startsWith('temp-');
      
      // Prepare module data for Supabase
      const moduleData = {
        course_id: courseId,
        title: module.title,
        description: module.description || null,
        order_index: module.order_index,
        // Add required language_id field
        language_id: module.language_id || '00000000-0000-0000-0000-000000000000' // Default UUID
      };
      
      let savedModule: CourseModule;
      
      if (isNewModule) {
        // Create new module
        const { data, error } = await supabase
          .from('course_modules')
          .insert(moduleData)
          .select()
          .single();
        
        if (error) throw error;
        savedModule = data as CourseModule;
      } else {
        // Update existing module
        const { data, error } = await supabase
          .from('course_modules')
          .update(moduleData)
          .eq('id', module.id)
          .select()
          .single();
        
        if (error) throw error;
        savedModule = data as CourseModule;
      }
      
      return savedModule;
    } catch (err: any) {
      console.error("Error saving module:", err);
      toast.error("Failed to save module");
      throw err;
    }
  };

  const saveLesson = async (lesson: CourseLesson): Promise<CourseLesson> => {
    try {
      // Determine if this is a new lesson or an update
      const isNewLesson = lesson.id.startsWith('temp-');
      
      // Prepare lesson data for Supabase - use type assertion to satisfy TS
      const lessonData = {
        module_id: lesson.module_id,
        title: lesson.title,
        content: lesson.content || null,
        order_index: lesson.order_index,
        is_published: lesson.is_published !== undefined ? lesson.is_published : false,
        requires_completion: lesson.requires_completion !== undefined ? lesson.requires_completion : true
      };
      
      let savedLesson: CourseLesson;
      
      if (isNewLesson) {
        // Create new lesson - use as any for the table name since it's not in the types
        const response = await supabase
          .from('course_lessons' as any)
          .insert(lessonData as any)
          .select();
        
        if (response.error) throw response.error;
        savedLesson = (response.data?.[0] || {}) as CourseLesson;
      } else {
        // Update existing lesson
        const response = await supabase
          .from('course_lessons' as any)
          .update(lessonData as any)
          .eq('id', lesson.id)
          .select();
        
        if (response.error) throw response.error;
        savedLesson = (response.data?.[0] || {}) as CourseLesson;
      }
      
      return savedLesson;
    } catch (err: any) {
      console.error("Error saving lesson:", err);
      toast.error("Failed to save lesson");
      throw err;
    }
  };

  const deleteModule = async (moduleId: string): Promise<boolean> => {
    try {
      // First delete all lessons in this module
      const { error: lessonsError } = await supabase
        .from('course_lessons' as any)
        .delete()
        .eq('module_id', moduleId);
      
      if (lessonsError) throw lessonsError;
      
      // Then delete the module
      const { error } = await supabase
        .from('course_modules')
        .delete()
        .eq('id', moduleId);
      
      if (error) throw error;
      
      // Update local state
      setModules(prevModules => 
        prevModules.filter(m => m.id !== moduleId)
          .map((m, index) => ({ ...m, order_index: index }))
      );
      
      return true;
    } catch (err: any) {
      console.error("Error deleting module:", err);
      toast.error("Failed to delete module");
      return false;
    }
  };

  const deleteLesson = async (lessonId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('course_lessons' as any)
        .delete()
        .eq('id', lessonId);
      
      if (error) throw error;
      
      // Update local state
      setModules(prevModules => 
        prevModules.map(module => {
          if (!module.lessons || !module.lessons.some(l => l.id === lessonId)) {
            return module;
          }
          
          const updatedLessons = module.lessons
            .filter(l => l.id !== lessonId)
            .map((l, index) => ({ ...l, order_index: index }));
          
          return { ...module, lessons: updatedLessons };
        })
      );
      
      return true;
    } catch (err: any) {
      console.error("Error deleting lesson:", err);
      toast.error("Failed to delete lesson");
      return false;
    }
  };

  const updateModulesOrder = async (updatedModules: CourseModule[]): Promise<boolean> => {
    try {
      // Prepare batch update with only the necessary fields
      const updates = updatedModules.map(module => ({
        id: module.id,
        order_index: module.order_index
      }));
      
      // Handle the type issue with explicit cast
      const { error } = await supabase
        .from('course_modules')
        .upsert(updates as any[], { onConflict: 'id' });
      
      if (error) throw error;
      
      // Update local state
      setModules(updatedModules);
      
      return true;
    } catch (err: any) {
      console.error("Error updating modules order:", err);
      toast.error("Failed to update course structure");
      return false;
    }
  };

  const updateLessonsOrder = async (moduleId: string, updatedLessons: CourseLesson[]): Promise<boolean> => {
    try {
      // Prepare batch update
      const updates = updatedLessons.map(lesson => ({
        id: lesson.id,
        order_index: lesson.order_index
      }));
      
      // Update all lessons in a single batch
      const { error } = await supabase
        .from('course_lessons' as any)
        .upsert(updates as any, { onConflict: 'id' });
      
      if (error) throw error;
      
      // Update local state
      setModules(prevModules => 
        prevModules.map(module => {
          if (module.id === moduleId) {
            return { ...module, lessons: updatedLessons };
          }
          return module;
        })
      );
      
      return true;
    } catch (err: any) {
      console.error("Error updating lessons order:", err);
      toast.error("Failed to update lessons order");
      return false;
    }
  };

  // Load modules when courseId changes
  useEffect(() => {
    if (courseId) {
      fetchModules();
    }
  }, [courseId]);

  return {
    modules,
    loading,
    error,
    fetchModules,
    saveModule,
    saveLesson,
    deleteModule,
    deleteLesson,
    updateModulesOrder,
    updateLessonsOrder
  };
};
