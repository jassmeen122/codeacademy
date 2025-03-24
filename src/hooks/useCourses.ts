
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Course } from '@/types/course';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data: enrolledCourses, error } = await supabase
          .from('courses')
          .select(`
            *,
            teacher:teacher_id (
              name:full_name
            ),
            course_materials (
              id,
              type,
              title
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match our Course type
        const transformedCourses: Course[] = enrolledCourses.map(course => ({
          id: course.id,
          title: course.title,
          description: course.description || "",
          duration: "8 weeks", // Default duration
          students: 0, // We'll need to implement this
          image: "/placeholder.svg", // Default image
          difficulty: course.difficulty,
          path: course.path,
          category: course.category,
          language: "JavaScript", // Default language
          professor: {
            name: course.teacher?.name || "Unknown Professor",
            title: "Course Instructor"
          },
          materials: {
            videos: course.course_materials?.filter(m => m.type === 'video').length || 0,
            pdfs: course.course_materials?.filter(m => m.type === 'pdf').length || 0,
            presentations: course.course_materials?.filter(m => m.type === 'presentation').length || 0
          }
        }));
        
        setCourses(transformedCourses);
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        setError(err);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
};
