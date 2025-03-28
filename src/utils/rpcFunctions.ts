
import { supabase } from "@/integrations/supabase/client";
import { CourseLesson } from "@/types/course";

// This file contains wrapper functions around RPC calls
// to make them more TypeScript friendly

/**
 * Gets lessons for specified modules
 */
export const getModuleLessons = async (moduleIds: string[]) => {
  // Implement using direct SQL query via supabase functions
  const { data, error } = await supabase
    .from('course_lessons')
    .select('*')
    .in('module_id', moduleIds)
    .order('order_index');
    
  return { data, error };
};

/**
 * Create or update a course lesson
 */
export const saveCourseLesson = async (
  lesson: Omit<CourseLesson, 'id' | 'created_at' | 'updated_at'> & { id?: string }
) => {
  // Determine if this is a new lesson or an update
  const isNewLesson = !lesson.id || lesson.id.startsWith('temp-');
  
  if (isNewLesson) {
    // Create new lesson
    const { data, error } = await supabase
      .from('course_lessons')
      .insert({
        module_id: lesson.module_id,
        title: lesson.title,
        content: lesson.content || null,
        order_index: lesson.order_index,
        is_published: lesson.is_published !== undefined ? lesson.is_published : false,
        requires_completion: lesson.requires_completion !== undefined ? lesson.requires_completion : true
      })
      .select()
      .single();
    
    return { data, error };
  } else {
    // Update existing lesson
    const { data, error } = await supabase
      .from('course_lessons')
      .update({
        module_id: lesson.module_id,
        title: lesson.title,
        content: lesson.content || null,
        order_index: lesson.order_index,
        is_published: lesson.is_published !== undefined ? lesson.is_published : false,
        requires_completion: lesson.requires_completion !== undefined ? lesson.requires_completion : true
      })
      .eq('id', lesson.id)
      .select()
      .single();
    
    return { data, error };
  }
};

/**
 * Delete a course lesson
 */
export const deleteCourseLesson = async (lessonId: string) => {
  return await supabase
    .from('course_lessons')
    .delete()
    .eq('id', lessonId);
};

/**
 * Delete all lessons for a module
 */
export const deleteModuleLessons = async (moduleId: string) => {
  return await supabase
    .from('course_lessons')
    .delete()
    .eq('module_id', moduleId);
};

/**
 * Update order of lessons
 */
export const updateLessonsOrder = async (lessons: { id: string; order_index: number }[]) => {
  // For each lesson, update its order_index
  const promises = lessons.map(lesson => 
    supabase
      .from('course_lessons')
      .update({ order_index: lesson.order_index })
      .eq('id', lesson.id)
  );
  
  // Wait for all updates to complete
  const results = await Promise.all(promises);
  
  // Check if any update failed
  const error = results.find(result => result.error)?.error;
  
  return { error };
};
