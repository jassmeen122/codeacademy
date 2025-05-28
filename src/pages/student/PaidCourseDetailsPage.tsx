
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { PayPalButton } from "@/components/payments/PayPalButton";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  BookOpen, 
  Star,
  Play,
  Lock,
  CheckCircle,
  Trophy
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  path: string;
  category: string;
  difficulty: string;
  teacher_id: string;
  created_at: string;
  updated_at: string;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: string;
  estimated_duration: string;
  order_index: number;
}

interface LocalStudentProgress {
  id: string;
  student_id: string;
  course_id: string;
  completion_percentage: number;
  last_accessed_at: string;
}

export default function PaidCourseDetailsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthState();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [progress, setProgress] = useState<LocalStudentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    if (courseId && user) {
      fetchCourseData();
      checkPurchaseStatus();
    }
  }, [courseId, user]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) {
        console.error('Error fetching course:', courseError);
        toast.error('Cours non trouvé');
        navigate('/student/courses');
        return;
      }

      setCourse(courseData);

      // Fetch course modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('language_id', courseData.id)
        .order('order_index');

      if (modulesError) {
        console.error('Error fetching modules:', modulesError);
      } else {
        setModules(modulesData || []);
      }

    } catch (error) {
      console.error('Error fetching course data:', error);
      toast.error('Erreur lors du chargement du cours');
    } finally {
      setLoading(false);
    }
  };

  const checkPurchaseStatus = async () => {
    if (!user || !courseId) return;

    try {
      // Use local storage to simulate progress tracking
      const localProgressKey = `course_progress_${user.id}_${courseId}`;
      const localProgress = localStorage.getItem(localProgressKey);
      
      if (localProgress) {
        const progressData = JSON.parse(localProgress);
        setProgress(progressData);
        setIsPurchased(true);
      } else {
        setIsPurchased(false);
      }
    } catch (error) {
      console.warn('Could not check purchase status:', error);
      setIsPurchased(false);
    }
  };

  const handlePurchaseSuccess = async () => {
    if (!user || !courseId) return;

    try {
      // Create local progress record
      const localProgress: LocalStudentProgress = {
        id: `local_${Date.now()}`,
        student_id: user.id,
        course_id: courseId,
        completion_percentage: 0,
        last_accessed_at: new Date().toISOString()
      };

      const localProgressKey = `course_progress_${user.id}_${courseId}`;
      localStorage.setItem(localProgressKey, JSON.stringify(localProgress));
      
      setProgress(localProgress);
      setIsPurchased(true);
      toast.success('Achat réussi ! Vous pouvez maintenant accéder au cours.');
    } catch (error) {
      console.error('Error handling purchase:', error);
      toast.error('Erreur lors de l\'enregistrement de l\'achat');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Chargement du cours...</p>
            </div>
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
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-4">
                  Cours non trouvé.
                </p>
                <Button onClick={() => navigate('/student/courses')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux cours
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const completedModules = progress ? Math.round((progress.completion_percentage / 100) * modules.length) : 0;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/student/courses')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux cours
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="outline">{course.difficulty}</Badge>
                      <Badge variant="secondary">{course.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>6-8 heures</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{modules.length} modules</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">4.8</span>
                    <span className="text-sm text-muted-foreground">(234)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
                
                {isPurchased && progress && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progression</span>
                      <span className="text-sm text-muted-foreground">
                        {completedModules}/{modules.length} modules
                      </span>
                    </div>
                    <Progress value={progress.completion_percentage} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Modules */}
            <Card>
              <CardHeader>
                <CardTitle>Programme du cours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {isPurchased ? (
                            completedModules > index ? (
                              <CheckCircle className="h-6 w-6 text-green-500" />
                            ) : (
                              <Play className="h-6 w-6 text-primary" />
                            )
                          ) : (
                            <Lock className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{module.title}</h4>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {module.difficulty}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {module.estimated_duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {isPurchased && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/student/courses/${courseId}/modules/${module.id}`)}
                        >
                          {completedModules > index ? 'Revoir' : 'Commencer'}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase/Access Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {isPurchased ? 'Accès au cours' : 'Acheter le cours'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isPurchased ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Vous avez accès à ce cours
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        const nextModule = modules.find((_, index) => index >= completedModules);
                        if (nextModule) {
                          navigate(`/student/courses/${courseId}/modules/${nextModule.id}`);
                        }
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Continuer le cours
                    </Button>
                    
                    <Separator />
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Progression:</span>
                        <span>{progress?.completion_percentage || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Modules terminés:</span>
                        <span>{completedModules}/{modules.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dernier accès:</span>
                        <span>
                          {progress?.last_accessed_at 
                            ? new Date(progress.last_accessed_at).toLocaleDateString() 
                            : 'Jamais'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">29,99 €</div>
                      <p className="text-sm text-muted-foreground">
                        Accès à vie au cours complet
                      </p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Accès à vie</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{modules.length} modules</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Certificat de completion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Support communautaire</span>
                      </div>
                    </div>
                    
                    <PayPalButton 
                      amount={29.99}
                      onSuccess={handlePurchaseSuccess}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructor Info */}
            <Card>
              <CardHeader>
                <CardTitle>Instructeur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                    JD
                  </div>
                  <div>
                    <h4 className="font-medium">John Doe</h4>
                    <p className="text-sm text-muted-foreground">Expert {course.path}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Développeur senior avec 10+ années d'expérience dans l'industrie.
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>1,234 étudiants</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>4.9 étoiles</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
