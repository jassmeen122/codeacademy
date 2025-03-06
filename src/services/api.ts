
import { supabase } from "@/integrations/supabase/client";

export const ApiService = {
  // Courses
  async getCourses() {
    try {
      const response = await supabase.functions.invoke('api', {
        method: 'GET',
        body: { path: '/courses' }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },
  
  async getCourse(id: string) {
    try {
      const response = await supabase.functions.invoke('api', {
        method: 'GET',
        body: { path: `/courses/${id}` }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }
  },
  
  async createCourse(courseData: any) {
    try {
      const response = await supabase.functions.invoke('api', {
        method: 'POST',
        body: { 
          path: '/courses',
          data: courseData 
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  },
  
  async getCourseResources(courseId: string) {
    try {
      const response = await supabase.functions.invoke('api', {
        method: 'GET',
        body: { path: `/courses/${courseId}/resources` }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching resources for course ${courseId}:`, error);
      throw error;
    }
  }
};
