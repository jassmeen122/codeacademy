
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from './useAuthState';
import type { PublishedCourse } from '@/types/course';

export const usePublishedCourses = () => {
  const [courses, setCourses] = useState<PublishedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();

  const fetchPublishedCourses = async () => {
    try {
      setLoading(true);

      // Récupérer tous les cours publiés avec les informations des enseignants
      const { data: publishedCourses, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:teacher_id (
            full_name
          ),
          course_content (
            id,
            title,
            is_published
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Pour chaque cours, vérifier si l'utilisateur est inscrit et calculer la progression
      const coursesWithProgress = await Promise.all(
        (publishedCourses || []).map(async (course: any) => {
          // Compter le nombre total de chapitres publiés
          const totalChapters = course.course_content?.filter((content: any) => content.is_published).length || 0;

          let isEnrolled = false;
          let completedChapters = 0;
          let progressPercentage = 0;

          if (user) {
            // Vérifier si l'utilisateur est inscrit (simulé pour l'instant)
            isEnrolled = Math.random() > 0.5; // Simulation

            if (isEnrolled) {
              // Calculer la progression (simulée)
              completedChapters = Math.floor(Math.random() * totalChapters);
              progressPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
            }
          }

          return {
            id: course.id,
            title: course.title,
            description: course.description || "",
            difficulty: course.difficulty,
            path: course.path,
            category: course.category,
            duration: "8 semaines", // Durée par défaut
            teacher_name: course.profiles?.full_name || "Enseignant",
            teacher_id: course.teacher_id,
            total_chapters: totalChapters,
            completed_chapters: completedChapters,
            progress_percentage: progressPercentage,
            is_enrolled: isEnrolled,
            created_at: course.created_at,
            is_published: course.is_published || false
          } as PublishedCourse;
        })
      );

      setCourses(coursesWithProgress);
    } catch (error: any) {
      console.error('Erreur lors du chargement des cours:', error);
      toast.error('Impossible de charger les cours');
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    try {
      if (!user) {
        toast.error('Vous devez être connecté pour vous inscrire');
        return;
      }

      // Ici, on ajouterait l'inscription à la base de données
      // Pour l'instant, on simule l'inscription
      setCourses(prev => 
        prev.map(course => 
          course.id === courseId 
            ? { ...course, is_enrolled: true, progress_percentage: 0, completed_chapters: 0 }
            : course
        )
      );

      toast.success('Inscription réussie ! Vous pouvez maintenant commencer le cours.');
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      toast.error('Erreur lors de l\'inscription au cours');
    }
  };

  const continueCourse = async (courseId: string) => {
    // Logique pour continuer un cours
    console.log('Continuation du cours:', courseId);
  };

  useEffect(() => {
    fetchPublishedCourses();
  }, [user]);

  return {
    courses,
    loading,
    fetchPublishedCourses,
    enrollInCourse,
    continueCourse
  };
};
