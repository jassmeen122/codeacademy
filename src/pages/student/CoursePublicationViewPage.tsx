
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  BookOpen, 
  User, 
  Calendar, 
  FileText, 
  Play, 
  ArrowLeft,
  Download,
  ExternalLink 
} from 'lucide-react';
import type { CourseLevel, CoursePath, CourseCategory } from '@/types/course';

interface CoursePublication {
  id: string;
  title: string;
  description: string;
  content: string;
  chapters: string[];
  teacher_name: string;
  difficulty: CourseLevel;
  path: CoursePath;
  category: CourseCategory;
  created_at: string;
  file_url?: string;
  video_url?: string;
}

const CoursePublicationViewPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CoursePublication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
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
        .eq('id', courseId)
        .eq('is_published', true)
        .single();

      if (error) throw error;

      if (data) {
        setCourse({
          id: data.id,
          title: data.title,
          description: data.description || '',
          content: data.content || '',
          chapters: data.chapters || [],
          teacher_name: data.profiles?.full_name || 'Enseignant inconnu',
          difficulty: data.difficulty as CourseLevel,
          path: data.path as CoursePath,
          category: data.category as CourseCategory,
          created_at: data.created_at,
          file_url: data.file_url,
          video_url: data.video_url
        });
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement du cours:', error);
      toast.error('Impossible de charger le cours');
      navigate('/student/courses');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openFileUrl = () => {
    if (course?.file_url) {
      window.open(course.file_url, '_blank');
    }
  };

  const openVideoUrl = () => {
    if (course?.video_url) {
      window.open(course.video_url, '_blank');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Cours non trouvé</h3>
              <p className="text-muted-foreground mb-4">
                Ce cours n'existe pas ou n'est plus disponible.
              </p>
              <Button onClick={() => navigate('/student/courses')}>
                Retour aux cours
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="default">{course.difficulty}</Badge>
              <Badge variant="outline">{course.category}</Badge>
              <Badge variant="secondary">{course.path}</Badge>
            </div>
            
            <CardTitle className="text-3xl mb-4">
              📘 {course.title}
            </CardTitle>
            
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>🧑‍🏫 Prof : {course.teacher_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Publié le {formatDate(course.created_at)}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">📝 Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            </div>

            <Separator />

            {course.chapters.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">📂 Chapitres</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.chapters.map((chapter, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm">{chapter}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {(course.file_url || course.video_url) && (
              <div>
                <h3 className="text-lg font-semibold mb-3">📎 Ressources</h3>
                <div className="flex gap-3">
                  {course.file_url && (
                    <Button 
                      variant="outline" 
                      onClick={openFileUrl}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      <Download className="h-3 w-3" />
                      Télécharger PDF
                    </Button>
                  )}
                  {course.video_url && (
                    <Button 
                      variant="outline" 
                      onClick={openVideoUrl}
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      <ExternalLink className="h-3 w-3" />
                      Voir la vidéo
                    </Button>
                  )}
                </div>
              </div>
            )}

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">📖 Contenu du cours</h3>
              <div className="prose max-w-none">
                <div className="bg-muted/30 p-6 rounded-lg">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {course.content}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CoursePublicationViewPage;
