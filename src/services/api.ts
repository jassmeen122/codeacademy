
import { supabase } from "@/integrations/supabase/client";

export const ApiService = {
  // Courses
  async getCourses() {
    const response = await supabase.functions.invoke('api', {
      body: { path: '/courses' }
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return response.data;
  },
  
  async getCourse(id: string) {
    const response = await supabase.functions.invoke('api', {
      body: { path: `/courses/${id}` }
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return response.data;
  },
  
  async createCourse(courseData: any) {
    const response = await supabase.functions.invoke('api', {
      body: { 
        path: '/courses',
        method: 'POST',
        data: courseData 
      }
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return response.data;
  }
  
  // Vous pouvez ajouter d'autres méthodes API au besoin
};
