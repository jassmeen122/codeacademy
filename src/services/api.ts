
import { supabase } from "@/integrations/supabase/client";

export const ApiService = {
  // Courses
  async getCourses() {
    try {
      const { data: courses, error } = await supabase
        .from("courses")
        .select();
      
      if (error) throw error;
      
      return { success: true, data: courses };
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },
  
  async getCourse(id: string) {
    try {
      const { data: course, error } = await supabase
        .from("courses")
        .select()
        .eq("id", id)
        .single();
      
      if (error) throw error;
      
      if (!course) {
        throw new Error("Course not found");
      }
      
      return { success: true, data: course };
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }
  },
  
  async createCourse(courseData: any) {
    try {
      const { data: insertedCourse, error } = await supabase
        .from("courses")
        .insert(courseData);
      
      if (error) throw error;

      // Fetch the newly created course
      const query = supabase
        .from("courses")
        .select()
        .eq("title", courseData.title)
        .order('created_at', { ascending: false });
      
      const { data: newCourse, error: fetchError } = await query.limit(1).single();
      
      if (fetchError) throw fetchError;
      
      return { success: true, data: newCourse };
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  },
  
  async getCourseResources(courseId: string) {
    try {
      const { data: resources, error } = await supabase
        .from("course_resources")
        .select()
        .eq("course_id", courseId);
      
      if (error) throw error;
      
      return { success: true, data: resources };
    } catch (error) {
      console.error(`Error fetching resources for course ${courseId}:`, error);
      throw error;
    }
  }
};
