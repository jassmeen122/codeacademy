
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CourseResourceList } from '@/components/student/CourseResourceList';
import { useCourseResources } from '@/hooks/useCourseResources';
import { toast } from 'sonner';
import { Book, FileText, PlayCircle } from 'lucide-react';

const StudentCourseDetailsPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { resources, loading: resourcesLoading } = useCourseResources(courseId || '');
  
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      
      try {
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            profiles:teacher_id (full_name, avatar_url)
          `)
          .eq('id', courseId)
          .single();
          
        if (error) throw error;
        setCourse(data);
      } catch (error: any) {
        console.error('Error fetching course:', error);
        toast.error('Impossible de charger les détails du cours');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId]);
  
  if (loading) {
    return <DashboardLayout>Chargement des détails du cours...</DashboardLayout>;
  }
  
  if (!course) {
    return <DashboardLayout>Ce cours n'existe pas ou vous n'avez pas les droits pour y accéder.</DashboardLayout>;
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">
              Par {course.profiles?.full_name || 'Enseignant inconnu'}
            </p>
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                {course.difficulty}
              </span>
              <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs">
                {course.category}
              </span>
            </div>
          </div>
          
          <Button className="w-full md:w-auto">
            Commencer le cours
          </Button>
        </div>
        
        <div className="mt-8">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <Book className="h-4 w-4" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Ressources
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-1">
                <PlayCircle className="h-4 w-4" />
                Vidéos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Description du cours</h2>
                <p>{course.description || "Aucune description disponible pour ce cours."}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="resources" className="space-y-4">
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Ressources du cours</h2>
                <CourseResourceList 
                  resources={resources.filter(r => r.type === 'pdf' || r.type === 'presentation')} 
                  isLoading={resourcesLoading} 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="videos" className="space-y-4">
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Vidéos du cours</h2>
                <CourseResourceList 
                  resources={resources.filter(r => r.type === 'video')} 
                  isLoading={resourcesLoading} 
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentCourseDetailsPage;
