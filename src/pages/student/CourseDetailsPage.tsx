
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CourseResourceList } from '@/components/student/CourseResourceList';
import { useCourseResources } from '@/hooks/useCourseResources';
import { toast } from 'sonner';
import { Book, FileText, PlayCircle, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const StudentCourseDetailsPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const { resources, loading: resourcesLoading } = useCourseResources(courseId || '');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      
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
  
  const enrollInCourse = async () => {
    try {
      setEnrolling(true);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Veuillez vous connecter pour vous inscrire à ce cours");
        navigate("/auth");
        return;
      }
      
      // Here we would typically add the user to the course enrollment
      // For now, we'll just navigate to the learn page
      toast.success("Inscription réussie ! Vous pouvez maintenant commencer à apprendre.");
      navigate(`/student/courses/${courseId}/learn`);
    } catch (error: any) {
      console.error("Error enrolling in course:", error);
      toast.error("Erreur lors de l'inscription au cours");
    } finally {
      setEnrolling(false);
    }
  };
  
  const getProgrammingLanguageVideos = () => {
    const videos = {
      JavaScript: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
      Python: "https://www.youtube.com/watch?v=rfscVS0vtbw",
      Java: "https://www.youtube.com/watch?v=grEKMHGYyns",
      "C++": "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
      PHP: "https://www.youtube.com/watch?v=OK_JCtrrv-c",
      C: "https://www.youtube.com/watch?v=KJgsSFOSQv0",
      SQL: "https://www.youtube.com/watch?v=HXV3zeQKqGY"
    };
    
    return videos[course?.language as keyof typeof videos] || "https://www.youtube.com/watch?v=rfscVS0vtbw";
  };
  
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
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                {course.language || "JavaScript"}
              </span>
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <GraduationCap className="mr-2 h-4 w-4" />
                S'inscrire maintenant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Commencer le cours "{course.title}"</DialogTitle>
                <DialogDescription>
                  Choisissez comment vous souhaitez apprendre ce cours.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                <Card className="cursor-pointer hover:border-primary" onClick={() => window.open(getProgrammingLanguageVideos(), "_blank")}>
                  <CardContent className="flex flex-col items-center justify-center pt-6">
                    <PlayCircle className="h-12 w-12 text-primary mb-4" />
                    <h3 className="font-medium text-center">Regarder la vidéo</h3>
                    <p className="text-sm text-center text-muted-foreground mt-2">
                      Cours complet en vidéo
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:border-primary" onClick={() => {
                  const pdfResources = resources.filter(r => r.type === "pdf");
                  if (pdfResources.length > 0) {
                    window.open(pdfResources[0].file_url, "_blank");
                  } else {
                    toast.error("Aucun document PDF disponible pour ce cours");
                  }
                }}>
                  <CardContent className="flex flex-col items-center justify-center pt-6">
                    <FileText className="h-12 w-12 text-red-500 mb-4" />
                    <h3 className="font-medium text-center">Télécharger le PDF</h3>
                    <p className="text-sm text-center text-muted-foreground mt-2">
                      Support de cours complet
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:border-primary" onClick={() => {
                  const presentationResources = resources.filter(r => r.type === "presentation");
                  if (presentationResources.length > 0) {
                    window.open(presentationResources[0].file_url, "_blank");
                  } else {
                    toast.error("Aucune présentation disponible pour ce cours");
                  }
                }}>
                  <CardContent className="flex flex-col items-center justify-center pt-6">
                    <Book className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="font-medium text-center">Voir la présentation</h3>
                    <p className="text-sm text-center text-muted-foreground mt-2">
                      Support visuel du cours
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => navigate(`/student/courses/${courseId}/learn`)}>
                  Accéder au cours complet
                </Button>
                <Button onClick={enrollInCourse} disabled={enrolling}>
                  {enrolling ? "Inscription..." : "Confirmer l'inscription"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                  resources={resources.filter(r => r.type === 'video' || r.type === 'youtube')} 
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
