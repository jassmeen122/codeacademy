
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from './useAuthState';
import type { CourseLevel, CoursePath, CourseCategory } from '@/types/course';

interface CoursePublication {
  id: string;
  title: string;
  description: string;
  chapters: string[];
  content: string;
  file_url?: string;
  video_url?: string;
  teacher_id: string;
  teacher_name: string;
  difficulty: CourseLevel;
  path: CoursePath;
  category: CourseCategory;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateCourseData {
  title: string;
  description: string;
  chapters: string[];
  content: string;
  file_url?: string;
  video_url?: string;
  difficulty: CourseLevel;
  path: CoursePath;
  category: CourseCategory;
}

export const useCoursePublications = () => {
  const [courses, setCourses] = useState<CoursePublication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:teacher_id (
            full_name
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const coursesData = (data || []).map((course: any) => ({
        id: course.id,
        title: course.title,
        description: course.description || '',
        chapters: course.chapters || [],
        content: course.content || '',
        file_url: course.file_url,
        video_url: course.video_url,
        teacher_id: course.teacher_id,
        teacher_name: course.profiles?.full_name || 'Enseignant inconnu',
        difficulty: course.difficulty as CourseLevel,
        path: course.path as CoursePath,
        category: course.category as CourseCategory,
        is_published: course.is_published,
        created_at: course.created_at,
        updated_at: course.updated_at
      }));

      setCourses(coursesData);
    } catch (error: any) {
      console.error('Erreur lors du chargement des cours:', error);
      toast.error('Impossible de charger les cours');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherCourses = async (teacherId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:teacher_id (
            full_name
          )
        `)
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const coursesData = (data || []).map((course: any) => ({
        id: course.id,
        title: course.title,
        description: course.description || '',
        chapters: course.chapters || [],
        content: course.content || '',
        file_url: course.file_url,
        video_url: course.video_url,
        teacher_id: course.teacher_id,
        teacher_name: course.profiles?.full_name || 'Enseignant inconnu',
        difficulty: course.difficulty as CourseLevel,
        path: course.path as CoursePath,
        category: course.category as CourseCategory,
        is_published: course.is_published,
        created_at: course.created_at,
        updated_at: course.updated_at
      }));

      setCourses(coursesData);
    } catch (error: any) {
      console.error('Erreur lors du chargement des cours du professeur:', error);
      toast.error('Impossible de charger vos cours');
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData: CreateCourseData) => {
    if (!user) {
      toast.error('Vous devez être connecté pour créer un cours');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: courseData.title,
          description: courseData.description,
          content: courseData.content,
          chapters: courseData.chapters,
          file_url: courseData.file_url,
          video_url: courseData.video_url,
          difficulty: courseData.difficulty,
          path: courseData.path,
          category: courseData.category,
          teacher_id: user.id,
          is_published: true
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Cours publié avec succès !');
      await fetchCourses();
      return data;
    } catch (error: any) {
      console.error('Erreur lors de la création du cours:', error);
      toast.error('Erreur lors de la publication du cours');
      return null;
    }
  };

  const updateCourse = async (courseId: string, updates: Partial<CreateCourseData>) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          title: updates.title,
          description: updates.description,
          content: updates.content,
          chapters: updates.chapters,
          file_url: updates.file_url,
          video_url: updates.video_url,
          difficulty: updates.difficulty,
          path: updates.path,
          category: updates.category
        })
        .eq('id', courseId);

      if (error) throw error;

      toast.success('Cours mis à jour avec succès !');
      await fetchCourses();
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du cours:', error);
      toast.error('Erreur lors de la mise à jour du cours');
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      toast.success('Cours supprimé avec succès !');
      await fetchCourses();
    } catch (error: any) {
      console.error('Erreur lors de la suppression du cours:', error);
      toast.error('Erreur lors de la suppression du cours');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    fetchCourses,
    fetchTeacherCourses,
    createCourse,
    updateCourse,
    deleteCourse
  };
};
