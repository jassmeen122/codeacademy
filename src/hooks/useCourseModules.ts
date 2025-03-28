import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CourseModule, CourseLesson } from "@/types/course";
import { toast } from "sonner";
import {
  getModuleLessons,
  saveCourseLesson,
  deleteCourseLesson,
  deleteModuleLessons,
  updateLessonsOrder
} from "@/utils/rpcFunctions";

// Define explicit types for database records
interface ModuleRecord {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  language_id: string;
  content?: string | null;
  difficulty?: string | null;
  estimated_duration?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface LessonRecord {
  id: string;
  module_id: string;
  title: string;
  content: string | null;
  order_index: number;
  is_published?: boolean;
  requires_completion?: boolean;
  created_at?: string;
  updated_at?: string;
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
      
      // Type assertion to prevent deep type instantiation
      const typedModulesData = modulesData as unknown as ModuleRecord[];
      
      // Create properly shaped modules
      const formattedModules: CourseModule[] = (typedModulesData || []).map(module => ({
        id: module.id,
        title: module.title,
        description: module.description || undefined,
        order_index: module.order_index,
        language_id: module.language_id,
        content: module.content || undefined,
        difficulty: module.difficulty as any || undefined,
        estimated_duration: module.estimated_duration || undefined,
        created_at: module.created_at,
        updated_at: module.updated_at,
        lessons: []
      }));

      // Then, get all lessons for these modules
      if (formattedModules.length > 0) {
        const moduleIds = formattedModules.map(module => module.id);
        
        const { data: lessonsData, error: lessonsError } = await getModuleLessons(moduleIds);
        
        if (lessonsError) {
          console.error("Error fetching lessons:", lessonsError);
          // Continue execution even if lessons fetch fails
        } else if (lessonsData) {
          // Properly shape the lesson data
          const typedLessonsData = lessonsData as unknown as LessonRecord[];
          
          // Add lessons to their respective modules
          formattedModules.forEach(module => {
            const moduleLessons = (typedLessonsData || [])
              .filter(lesson => lesson.module_id === module.id)
              .map(lesson => ({
                id: lesson.id,
                title: lesson.title,
                content: lesson.content || undefined,
                module_id: lesson.module_id,
                order_index: lesson.order_index,
                is_published: lesson.is_published,
                requires_completion: lesson.requires_completion,
                created_at: lesson.created_at,
                updated_at: lesson.updated_at
              }));
            
            module.lessons = moduleLessons;
          });
        }
      }
      
      setModules(formattedModules);
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
        language_id: module.language_id || courseId, // Fallback to courseId if language_id is missing
        title: module.title,
        description: module.description || null,
        order_index: module.order_index,
        content: module.content || null,
        difficulty: module.difficulty || null,
        estimated_duration: module.estimated_duration || null
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
        savedModule = data as unknown as CourseModule;
      } else {
        // Update existing module
        const { data, error } = await supabase
          .from('course_modules')
          .update(moduleData)
          .eq('id', module.id)
          .select()
          .single();
        
        if (error) throw error;
        savedModule = data as unknown as CourseModule;
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
      const { data, error } = await saveCourseLesson(lesson);
      
      if (error) throw error;
      
      return data as unknown as CourseLesson;
    } catch (err: any) {
      console.error("Error saving lesson:", err);
      toast.error("Failed to save lesson");
      throw err;
    }
  };

  const deleteModule = async (moduleId: string): Promise<boolean> => {
    try {
      // First delete all lessons in this module
      const { error: lessonsError } = await deleteModuleLessons(moduleId);
      
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
      const { error } = await deleteCourseLesson(lessonId);
      
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
      // Prepare batch update
      const updates = updatedModules.map(module => ({
        id: module.id,
        order_index: module.order_index,
        language_id: module.language_id || courseId, // Required field
        title: module.title // Required field
      }));
      
      // Update all modules in a single batch
      const { error } = await supabase
        .from('course_modules')
        .upsert(updates, { onConflict: 'id' });
      
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
      const { error } = await updateLessonsOrder(
        updatedLessons.map(l => ({
          id: l.id,
          order_index: l.order_index
        }))
      );
      
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
