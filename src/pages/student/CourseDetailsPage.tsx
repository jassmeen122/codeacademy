
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PayPalButton } from "@/components/payments/PayPalButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { AlertCircle, BookOpen, ChevronLeft, FileText, Video, Presentation, Lock } from "lucide-react";
import type { Course, CourseResource } from "@/types/course";

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthState();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (courseId && user) {
      fetchCourseDetails();
      checkEnrollment();
    }
  }, [courseId, user]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:teacher_id (
            name:full_name
          )
        `)
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      if (courseData) {
        // Transform to Course type
        const transformedCourse: Course = {
          id: courseData.id,
          title: courseData.title,
          description: courseData.description || "",
          duration: "8 semaines", // Donnée fictive
          students: 0, // Sera mis à jour ultérieurement
          image: "/placeholder.svg",
          difficulty: courseData.difficulty,
          path: courseData.path,
          category: courseData.category,
          language: "JavaScript", // Donnée fictive
          professor: {
            name: courseData.teacher?.name || "Professeur inconnu",
            title: "Instructeur du cours"
          },
          materials: {
            videos: 0,
            pdfs: 0,
            presentations: 0
          },
          isPremium: true, // Pour démonstration
          price: 49.99 // Prix par défaut
        };

        setCourse(transformedCourse);
        
        // Fetch course resources
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('course_resources')
          .select('*')
          .eq('course_id', courseId)
          .order('order_index', { ascending: true });
          
        if (resourcesError) throw resourcesError;
        
        setResources(resourcesData as CourseResource[]);
        
        // Update course materials count
        const videos = resourcesData.filter(r => r.type === 'video').length;
        const pdfs = resourcesData.filter(r => r.type === 'pdf').length;
        const presentations = resourcesData.filter(r => r.type === 'presentation').length;
        
        transformedCourse.materials = {
          videos,
          pdfs,
          presentations
        };
        
        setCourse(transformedCourse);
      }
    } catch (error: any) {
      console.error("Error fetching course:", error);
      toast.error("Erreur lors du chargement du cours");
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    if (!user?.id || !courseId) return;
    
    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('id')
        .eq('course_id', courseId)
        .eq('student_id', user.id)
        .single();
        
      setEnrolled(!!data);
    } catch (error) {
      // Si aucune inscription trouvée, on obtient une erreur, ce qui est normal
      setEnrolled(false);
    }
  };

  const handlePaymentSuccess = async (details: any) => {
    try {
      if (!user?.id || !courseId) {
        toast.error("Utilisateur non authentifié");
        return;
      }
      
      // Enregistrer l'inscription dans student_progress
      const { error } = await supabase
        .from('student_progress')
        .insert({
          student_id: user.id,
          course_id: courseId,
          started_at: new Date().toISOString(),
          completion_percentage: 0,
          completed_materials: []
        });
        
      if (error) throw error;
      
      toast.success("Vous êtes maintenant inscrit à ce cours !");
      setEnrolled(true);
      setShowPayment(false);
    } catch (error: any) {
      console.error("Erreur lors de l'inscription au cours:", error);
      toast.error("Échec de l'inscription");
    }
  };

  const renderEnrollmentOptions = () => {
    if (enrolled) {
      return (
        <Button className="w-full" onClick={() => navigate(`/student/courses/${courseId}/learn`)}>
          Continuer l'apprentissage
        </Button>
      );
    }
    
    if (showPayment) {
      return (
        <div className="space-y-4">
          <PayPalButton 
            amount={49.99} 
            courseId={courseId || ""}
            courseTitle={course?.title || ""}
            onSuccess={handlePaymentSuccess}
            onError={() => toast.error("Échec du paiement. Veuillez réessayer.")}
          />
          <Button variant="outline" className="w-full" onClick={() => setShowPayment(false)}>
            Annuler
          </Button>
        </div>
      );
    }
    
    return (
      <Button className="w-full" onClick={() => setShowPayment(true)}>
        S'inscrire pour 49.99€
      </Button>
    );
  };

  const renderResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-blue-500" />;
      case 'presentation':
        return <Presentation className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            Chargement du cours...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Cours introuvable</h2>
            <p className="mb-4">Le cours que vous recherchez n'existe pas ou a été supprimé.</p>
            <Button onClick={() => navigate('/student/courses')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Retour aux cours
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/student/courses')}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour aux cours
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary">{course.difficulty}</Badge>
                <Badge variant="outline">{course.path}</Badge>
                <Badge variant="outline">{course.category}</Badge>
              </div>
              <p className="text-gray-600">{course.description}</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Contenu du cours
                  {!enrolled && <Badge variant="outline" className="ml-2">Premium</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resources.length === 0 ? (
                    <p className="text-muted-foreground">Aucune ressource disponible pour ce cours.</p>
                  ) : (
                    resources.map((resource, index) => (
                      <div key={resource.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          {renderResourceIcon(resource.type)}
                          <div className="ml-3">
                            <h4 className="font-medium">{resource.title}</h4>
                            {resource.description && (
                              <p className="text-sm text-muted-foreground">{resource.description}</p>
                            )}
                          </div>
                        </div>
                        {!enrolled ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(resource.file_url, '_blank')}
                          >
                            Accéder
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="aspect-video bg-gray-100 rounded-md mb-4 overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt={course.title} 
                    className="object-cover w-full h-full"
                  />
                </div>
                
                <div className="text-3xl font-bold mb-4">49.99€</div>
                
                {renderEnrollmentOptions()}
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {course.materials.videos + course.materials.pdfs + course.materials.presentations} ressources disponibles
                    </span>
                  </div>
                  {course.materials.videos > 0 && (
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{course.materials.videos} vidéos</span>
                    </div>
                  )}
                  {course.materials.pdfs > 0 && (
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{course.materials.pdfs} documents PDF</span>
                    </div>
                  )}
                  {course.materials.presentations > 0 && (
                    <div className="flex items-center">
                      <Presentation className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{course.materials.presentations} présentations</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instructeur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                    {course.professor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium">{course.professor.name}</h3>
                    <p className="text-sm text-muted-foreground">{course.professor.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetailsPage;
