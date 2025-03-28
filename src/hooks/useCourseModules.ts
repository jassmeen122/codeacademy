
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CourseModule, CourseLesson } from "@/types/course";
import { toast } from "sonner";

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
      
      // We'll fetch lessons separately using RPC or custom queries
      // since course_lessons might not be in the generated types
      
      const moduleIds = (modulesData || []).map(module => module.id);
      
      if (moduleIds.length > 0) {
        // Use a custom query to get lessons for these modules
        const { data: lessonsData, error: lessonsError } = await supabase
          .rpc('get_lessons_for_modules', { module_ids: moduleIds })
          .select('*')
          .order('order_index');
        
        if (lessonsError) {
          console.error("Falling back to alternative query method:", lessonsError);
          
          // If RPC fails, try a direct SQL query as fallback
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('lessons') // Using 'lessons' instead of 'course_lessons'
            .select('*')
            .in('module_id', moduleIds)
            .order('order_index');
            
          if (fallbackError) {
            console.error("All lesson fetching methods failed:", fallbackError);
            
            // Proceed with just the modules, no lessons
            const typedModules = modulesData.map(module => ({
              ...module,
              lessons: []
            })) as CourseModule[];
            
            setModules(typedModules);
            return;
          }
          
          // Use the fallback data
          const modulesWithLessons = modulesData.map(module => {
            const moduleLessons = (fallbackData || [])
              .filter(lesson => lesson.module_id === module.id)
              .map(lesson => lesson as unknown as CourseLesson);
            
            return {
              ...module,
              lessons: moduleLessons
            };
          }) as CourseModule[];
          
          setModules(modulesWithLessons);
          return;
        }
        
        // Use the RPC data if it worked
        const modulesWithLessons = modulesData.map(module => {
          const moduleLessons = (lessonsData || [])
            .filter(lesson => lesson.module_id === module.id)
            .map(lesson => lesson as unknown as CourseLesson);
          
          return {
            ...module,
            lessons: moduleLessons
          };
        }) as CourseModule[];
        
        setModules(modulesWithLessons);
      } else {
        // No modules found, return empty array
        setModules([] as CourseModule[]);
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
        language_id: module.language_id || "00000000-0000-0000-0000-000000000000", // Fallback ID
        difficulty: module.difficulty || "Beginner" // Fallback difficulty
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
      
      return {
        ...savedModule,
        lessons: module.lessons || []
      };
    } catch (err: any) {
      console.error("Error saving module:", err);
      toast.error("Failed to save module");
      throw err;
    }
  };

  const saveLesson = async (lesson: CourseLesson): Promise<CourseLesson> => {
    try {
      // Since we're having issues with the course_lessons table
      // Let's use a generic approach using the most likely table name
      const isNewLesson = lesson.id.startsWith('temp-');
      
      // Prepare lesson data for Supabase - only include fields that exist in the table
      const lessonData = {
        module_id: lesson.module_id,
        title: lesson.title,
        content: lesson.content || null,
        order_index: lesson.order_index,
        is_published: lesson.is_published !== undefined ? lesson.is_published : false,
        requires_completion: lesson.requires_completion !== undefined ? lesson.requires_completion : true
      };
      
      let savedLesson: CourseLesson;
      let result;
      
      try {
        // Try using 'lessons' table first
        if (isNewLesson) {
          result = await supabase
            .from('course_lessons')
            .insert(lessonData)
            .select()
            .single();
        } else {
          result = await supabase
            .from('course_lessons')
            .update(lessonData)
            .eq('id', lesson.id)
            .select()
            .single();
        }
      } catch (innerErr) {
        console.error("Error with course_lessons table, trying lessons table:", innerErr);
        
        // Fallback to 'lessons' if course_lessons doesn't work
        if (isNewLesson) {
          result = await supabase
            .from('lessons')
            .insert(lessonData)
            .select()
            .single();
        } else {
          result = await supabase
            .from('lessons')
            .update(lessonData)
            .eq('id', lesson.id)
            .select()
            .single();
        }
      }
      
      const { data, error } = result;
      if (error) throw error;
      
      savedLesson = data as unknown as CourseLesson;
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
      try {
        // Try course_lessons first
        await supabase
          .from('course_lessons')
          .delete()
          .eq('module_id', moduleId);
      } catch (err) {
        // Fallback to lessons
        await supabase
          .from('lessons')
          .delete()
          .eq('module_id', moduleId);
      }
      
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
      let deleted = false;
      
      // Try course_lessons first
      try {
        const { error } = await supabase
          .from('course_lessons')
          .delete()
          .eq('id', lessonId);
        
        if (!error) deleted = true;
      } catch (err) {
        console.log("Failed with course_lessons, trying lessons");
      }
      
      // If that failed, try lessons
      if (!deleted) {
        const { error } = await supabase
          .from('lessons')
          .delete()
          .eq('id', lessonId);
        
        if (error) throw error;
      }
      
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
      // Prepare batch update with only necessary fields
      const updates = updatedModules.map(module => ({
        id: module.id,
        order_index: module.order_index,
        title: module.title // Include title as it's a required field
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
      // Prepare batch update with only necessary fields
      const updates = updatedLessons.map(lesson => ({
        id: lesson.id,
        order_index: lesson.order_index,
        title: lesson.title, // Include title as it's a required field
        module_id: lesson.module_id // Include module_id as it's a required field
      }));
      
      let updated = false;
      
      // Try course_lessons first
      try {
        const { error } = await supabase
          .from('course_lessons')
          .upsert(updates, { onConflict: 'id' });
        
        if (!error) updated = true;
      } catch (err) {
        console.log("Failed with course_lessons, trying lessons");
      }
      
      // If that failed, try lessons
      if (!updated) {
        const { error } = await supabase
          .from('lessons')
          .upsert(updates, { onConflict: 'id' });
        
        if (error) throw error;
      }
      
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
