
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CourseModule, CourseLesson, CourseLevel } from "@/types/course";
import { toast } from "sonner";

// Define an interface for the database module structure
interface ModuleRecord {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  language_id: string;
  course_id: string;
  content: string | null;
  difficulty: string | null;
  estimated_duration: string | null;
  created_at: string;
  updated_at: string;
}

export const useCourseModules = (courseId: string) => {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchModules = async () => {
    try {
      setLoading(true);
      
      // First, get all modules for this course
      const { data, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');
      
      if (modulesError) throw modulesError;
      
      if (!data || data.length === 0) {
        setModules([]);
        return;
      }
      
      // Explicitly type the modules data and cast it to avoid deep type inference
      const moduleRecords = data as unknown as ModuleRecord[];
      
      // Transform module data with explicit typing
      const modulesWithLessons: CourseModule[] = moduleRecords.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description || undefined,
        order_index: module.order_index,
        language_id: module.language_id,
        course_id: courseId,
        content: module.content || undefined,
        difficulty: (module.difficulty as CourseLevel) || 'Beginner',
        estimated_duration: module.estimated_duration || undefined,
        created_at: module.created_at,
        updated_at: module.updated_at,
        lessons: [] // Initialize with empty array
      }));
      
      setModules(modulesWithLessons);
      
      // For now, we'll use user_progress to simulate lessons since we don't have a 
      // course_lessons table yet
      try {
        const moduleIds = moduleRecords.map(module => module.id);
        
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .in('module_id', moduleIds);
        
        if (progressError) throw progressError;
        
        if (progressData && progressData.length > 0) {
          // Map progress records to module structure
          const updatedModules = modulesWithLessons.map(module => {
            // Create mock lessons from progress data
            const moduleLessons: CourseLesson[] = progressData
              .filter(record => record.module_id === module.id)
              .map((record, index) => ({
                id: record.id,
                title: `Lesson ${index + 1}`,
                module_id: record.module_id,
                order_index: index,
                content: "Lesson content placeholder",
                is_published: true,
                requires_completion: true,
                created_at: record.created_at
              }));
            
            return {
              ...module,
              lessons: moduleLessons
            };
          });
          
          setModules(updatedModules);
        }
      } catch (lessonsError) {
        console.error("Error fetching lesson data:", lessonsError);
        // Continue with modules without lessons
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
      const isNewModule = !module.id || module.id.startsWith('temp-');
      
      // Prepare module data for Supabase with proper typing
      const moduleData = {
        course_id: courseId,
        title: module.title,
        description: module.description || null,
        order_index: module.order_index,
        language_id: module.language_id || "00000000-0000-0000-0000-000000000000", // Fallback ID
        difficulty: module.difficulty || "Beginner", // Ensure correct typing
        content: module.content || null,
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
        if (!data) throw new Error("No data returned when creating module");
        
        // Cast the difficulty to CourseLevel to ensure type safety
        savedModule = {
          ...data,
          difficulty: data.difficulty as CourseLevel || 'Beginner',
          lessons: module.lessons || []
        };
      } else {
        // Update existing module
        const { data, error } = await supabase
          .from('course_modules')
          .update(moduleData)
          .eq('id', module.id)
          .select()
          .single();
        
        if (error) throw error;
        if (!data) throw new Error("No data returned when updating module");
        
        // Cast the difficulty to CourseLevel to ensure type safety
        savedModule = {
          ...data,
          difficulty: data.difficulty as CourseLevel || 'Beginner',
          lessons: module.lessons || []
        };
      }
      
      // Update modules state
      setModules(prevModules => {
        const index = prevModules.findIndex(m => m.id === savedModule.id);
        if (index >= 0) {
          // Replace existing module
          const updatedModules = [...prevModules];
          updatedModules[index] = savedModule;
          return updatedModules;
        } else {
          // Add new module
          return [...prevModules, savedModule];
        }
      });
      
      return savedModule;
    } catch (err: any) {
      console.error("Error saving module:", err);
      toast.error("Failed to save module");
      throw err;
    }
  };

  const saveLesson = async (lesson: CourseLesson): Promise<CourseLesson> => {
    try {
      console.log("Saving lesson:", lesson);
      
      // Simulate saving by returning the lesson with a real ID if it's a temp ID
      const isNew = !lesson.id || lesson.id.startsWith('temp-');
      const newLesson = isNew
        ? { ...lesson, id: `lesson-${Date.now()}` }
        : lesson;
      
      // Update the modules in state
      setModules(prevModules => 
        prevModules.map(module => {
          if (module.id === lesson.module_id) {
            const updatedLessons = [...(module.lessons || [])];
            const lessonIndex = updatedLessons.findIndex(l => l.id === lesson.id);
            
            if (lessonIndex >= 0) {
              updatedLessons[lessonIndex] = newLesson;
            } else {
              updatedLessons.push(newLesson);
            }
            
            return { ...module, lessons: updatedLessons };
          }
          return module;
        })
      );
      
      return newLesson;
    } catch (err: any) {
      console.error("Error saving lesson:", err);
      toast.error("Failed to save lesson");
      throw err;
    }
  };

  const deleteModule = async (moduleId: string): Promise<boolean> => {
    try {
      // Delete the module
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
      // Since we're mocking, we'll just update the local state
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
      // Prepare updates with required fields and proper typing
      const updates = updatedModules.map(module => ({
        id: module.id,
        order_index: module.order_index,
        title: module.title,
        language_id: module.language_id || "00000000-0000-0000-0000-000000000000",
        difficulty: module.difficulty || "Beginner"
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
      // Since we're mocking, we'll just update the local state
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
